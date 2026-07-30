import { PublicPluginError, readJson } from "./safe-io.mjs";

export const REQUIRED_FILES = [
  "mission.json",
  "lots.json",
  "execution-contract.json",
  "evidence.json",
];

const EXPECTED_FORMATS = {
  "mission.json": "dubsar.project-mission/1",
  "lots.json": "dubsar.project-lots/1",
  "execution-contract.json": "dubsar.execution-contract/1",
  "evidence.json": "dubsar.project-evidence/1",
};

function asArray(value, code, findings) {
  if (!Array.isArray(value)) {
    findings.push(code);
    return [];
  }
  return value;
}

function duplicateIds(items, field) {
  const seen = new Set();
  for (const item of items) {
    const id = item?.[field];
    if (typeof id !== "string" || id.length === 0) {
      continue;
    }
    if (seen.has(id)) {
      return true;
    }
    seen.add(id);
  }
  return false;
}

function hasDependencyCycle(lots) {
  const dependencies = new Map(
    lots.map((lot) => [
      lot?.lot_id,
      Array.isArray(lot?.depends_on) ? lot.depends_on : [],
    ]),
  );
  const visiting = new Set();
  const visited = new Set();

  function visit(id) {
    if (visiting.has(id)) {
      return true;
    }
    if (visited.has(id)) {
      return false;
    }
    visiting.add(id);
    for (const dependency of dependencies.get(id) ?? []) {
      if (dependencies.has(dependency) && visit(dependency)) {
        return true;
      }
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  }

  return [...dependencies.keys()].some((id) => visit(id));
}

export async function loadProjectWorkspace(root) {
  const documents = {};
  for (const file of REQUIRED_FILES) {
    documents[file] = await readJson(root, file);
  }
  return documents;
}

function determineNextStep(mission, lots, contract) {
  if (mission.status === "draft") {
    return "Review and approve the project mission.";
  }
  const incomplete = lots.filter((lot) => lot.status !== "complete");
  if (incomplete.length === 0) {
    return lots.length === 0
      ? "Decompose the approved mission into verifiable lots."
      : "Review mission acceptance evidence.";
  }
  const candidate = incomplete.find((lot) => lot.status === "candidate");
  if (!candidate) {
    return "Select the first unblocked lot as the next candidate.";
  }
  if (contract.lot_id !== candidate.lot_id) {
    return `Draft an execution contract for lot ${candidate.lot_id}.`;
  }
  if (contract.status === "draft") {
    return `Review the execution contract for lot ${candidate.lot_id}.`;
  }
  return `Prepare the approved lot ${candidate.lot_id}; no execution is started by this plugin.`;
}

export async function validateProjectWorkspace(root) {
  const findings = [];
  let documents;
  try {
    documents = await loadProjectWorkspace(root);
  } catch (error) {
    if (error instanceof PublicPluginError) {
      return {
        status: "invalid",
        continuity_status: "continuity_blocked",
        findings: [error.code],
      };
    }
    throw error;
  }

  for (const [file, expected] of Object.entries(EXPECTED_FORMATS)) {
    if (documents[file]?.format !== expected) {
      findings.push(`FORMAT_MISMATCH:${file}`);
    }
  }

  const mission = documents["mission.json"];
  const missionId = mission?.mission_id;
  if (typeof missionId !== "string" || missionId.length === 0) {
    findings.push("MISSION_ID_MISSING");
  }
  for (const file of REQUIRED_FILES.slice(1)) {
    if (documents[file]?.mission_id !== missionId) {
      findings.push(`MISSION_ID_MISMATCH:${file}`);
    }
  }

  const lots = asArray(
    documents["lots.json"]?.lots,
    "LOTS_NOT_ARRAY",
    findings,
  );
  const evidence = asArray(
    documents["evidence.json"]?.entries,
    "EVIDENCE_NOT_ARRAY",
    findings,
  );
  const contract = documents["execution-contract.json"];
  if (!["draft", "approved", "complete"].includes(mission?.status)) {
    findings.push("MISSION_STATUS_INVALID");
  }
  asArray(mission?.stop_conditions, "MISSION_STOP_CONDITIONS_NOT_ARRAY", findings);

  if (duplicateIds(lots, "lot_id")) {
    findings.push("DUPLICATE_LOT_ID");
  }
  if (duplicateIds(evidence, "evidence_id")) {
    findings.push("DUPLICATE_EVIDENCE_ID");
  }
  if (lots.filter((lot) => lot?.status === "candidate").length > 1) {
    findings.push("MULTIPLE_CANDIDATE_LOTS");
  }
  if (
    lots.some(
      (lot) => typeof lot?.lot_id !== "string" || lot.lot_id.length === 0,
    )
  ) {
    findings.push("LOT_ID_MISSING");
  }
  if (
    evidence.some(
      (item) =>
        typeof item?.evidence_id !== "string" ||
        item.evidence_id.length === 0,
    )
  ) {
    findings.push("EVIDENCE_ID_MISSING");
  }
  if (hasDependencyCycle(lots)) {
    findings.push("LOT_DEPENDENCY_CYCLE");
  }

  const lotIds = new Set(lots.map((lot) => lot?.lot_id));
  const evidenceIds = new Set(evidence.map((item) => item?.evidence_id));
  const evidenceClasses = new Map(
    evidence.map((item) => [item?.evidence_id, item?.class]),
  );
  const evidenceSupport = new Map(
    evidence.map((item) => [
      item?.evidence_id,
      Array.isArray(item?.artifact_refs) &&
        item.artifact_refs.length > 0 &&
        Array.isArray(item?.validation) &&
        item.validation.length > 0,
    ]),
  );
  const lotById = new Map(lots.map((lot) => [lot?.lot_id, lot]));
  for (const lot of lots) {
    if (!["planned", "candidate", "complete"].includes(lot?.status)) {
      findings.push("LOT_STATUS_INVALID");
    }
    for (const dependency of asArray(
      lot?.depends_on,
      "LOT_DEPENDENCIES_NOT_ARRAY",
      findings,
    )) {
      if (!lotIds.has(dependency) || dependency === lot?.lot_id) {
        findings.push("LOT_DEPENDENCY_INVALID");
      }
      if (
        ["candidate", "complete"].includes(lot?.status) &&
        lotById.get(dependency)?.status !== "complete"
      ) {
        findings.push("LOT_DEPENDENCY_NOT_COMPLETE");
      }
    }
    if (lot?.status === "complete") {
      const expectedEvidence = asArray(
        lot?.expected_evidence,
        "LOT_EXPECTED_EVIDENCE_NOT_ARRAY",
        findings,
      );
      if (expectedEvidence.length === 0) {
        findings.push("COMPLETE_LOT_HAS_NO_EXPECTED_EVIDENCE");
      }
      for (const expected of expectedEvidence) {
        if (
          !evidenceIds.has(expected) ||
          !["observed", "derived"].includes(evidenceClasses.get(expected)) ||
          evidenceSupport.get(expected) !== true
        ) {
          findings.push("COMPLETE_LOT_EVIDENCE_MISSING");
        }
      }
    }
  }

  for (const item of evidence) {
    if (!lotIds.has(item?.lot_id)) {
      findings.push("EVIDENCE_LOT_REFERENCE_MISSING");
    }
    if (
      !["observed", "reported", "derived", "unverified"].includes(item?.class)
    ) {
      findings.push("EVIDENCE_CLASS_INVALID");
    }
    if (typeof item?.claim !== "string" || item.claim.trim() === "") {
      findings.push("EVIDENCE_CLAIM_MISSING");
    }
    const artifactRefs = asArray(
      item?.artifact_refs,
      "EVIDENCE_ARTIFACT_REFS_NOT_ARRAY",
      findings,
    );
    const validationSteps = asArray(
      item?.validation,
      "EVIDENCE_VALIDATION_NOT_ARRAY",
      findings,
    );
    asArray(
      item?.limitations,
      "EVIDENCE_LIMITATIONS_NOT_ARRAY",
      findings,
    );
    if (
      ["observed", "derived"].includes(item?.class) &&
      (artifactRefs.length === 0 || validationSteps.length === 0)
    ) {
      findings.push("EVIDENCE_SUPPORT_MISSING");
    }
  }

  const contractHasLot =
    typeof contract?.lot_id === "string" && contract.lot_id.length > 0;
  if (!["draft", "approved", "closed"].includes(contract?.status)) {
    findings.push("CONTRACT_STATUS_INVALID");
  }
  asArray(
    contract?.protected_areas,
    "CONTRACT_PROTECTED_AREAS_NOT_ARRAY",
    findings,
  );
  asArray(
    contract?.stop_conditions,
    "CONTRACT_STOP_CONDITIONS_NOT_ARRAY",
    findings,
  );
  if (contractHasLot && !lotIds.has(contract.lot_id)) {
    findings.push("CONTRACT_LOT_REFERENCE_MISSING");
  }
  if (
    contractHasLot &&
    (typeof contract?.contract_id !== "string" ||
      contract.contract_id.length === 0)
  ) {
    findings.push("CONTRACT_ID_MISSING");
  }
  if (
    !contractHasLot &&
    (contract?.contract_id !== null || contract?.status !== "draft")
  ) {
    findings.push("ORPHAN_CONTRACT_STATE");
  }
  if (
    contract?.status === "approved" &&
    !lots.some(
      (lot) =>
        lot?.lot_id === contract.lot_id &&
        ["candidate", "complete"].includes(lot.status),
    )
  ) {
    findings.push("APPROVED_CONTRACT_WITHOUT_CANDIDATE");
  }

  const uniqueFindings = [...new Set(findings)].sort();
  return {
    status: uniqueFindings.length === 0 ? "valid" : "invalid",
    continuity_status:
      uniqueFindings.length === 0 ? "continuity_valid" : "continuity_blocked",
    mission_id: typeof missionId === "string" ? missionId : null,
    mission_status: mission?.status ?? null,
    counts: {
      lots: lots.length,
      complete_lots: lots.filter((lot) => lot?.status === "complete").length,
      evidence_entries: evidence.length,
    },
    next_preparation_step:
      uniqueFindings.length === 0
        ? determineNextStep(mission, lots, contract)
        : "Resolve the listed contradictions with a human before resuming.",
    findings: uniqueFindings,
  };
}
