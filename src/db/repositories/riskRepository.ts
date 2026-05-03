import type { RiskAcknowledgement } from "../types";
import { db } from "../dexie";

export const RISK_TEXT_VERSION = "2026-05-v1";

export function getRiskCopy(context: RiskAcknowledgement["context"]) {
  const copy: Record<RiskAcknowledgement["context"], { title: string; body: string }> = {
    advanced_strategies: {
      title: "Advanced strategy acknowledgement",
      body: "Advanced strategies can combine multiple risks, including assignment, volatility, and simplified payoff assumptions.",
    },
    short_options: {
      title: "Short option acknowledgement",
      body: "Short options can be assigned and create obligations that differ from buying options.",
    },
    assignment_risk: {
      title: "Assignment acknowledgement",
      body: "Assignment can require buying or selling shares at the strike. This simulation is educational only.",
    },
    undefined_risk: {
      title: "Undefined-risk acknowledgement",
      body: "Some short-option structures can have losses that are not capped by the option legs alone.",
    },
    simplified_model: {
      title: "Simplified model acknowledgement",
      body: "This MVP uses simplified expiration payoff views and does not model all volatility, early exercise, or liquidity effects.",
    },
    simulated_data: {
      title: "Simulated data acknowledgement",
      body: "Trades in OptionPath are local simulations and are not live orders or recommendations.",
    },
  };

  return copy[context];
}

export async function hasRiskAcknowledgement(context: RiskAcknowledgement["context"], strategyId?: string) {
  const records = await db.riskAcknowledgements.where("context").equals(context).toArray();
  return records.some(
    (record) =>
      record.acceptedTextVersion === RISK_TEXT_VERSION &&
      (!strategyId || !record.strategyId || record.strategyId === strategyId),
  );
}

export async function saveRiskAcknowledgement(input: {
  context: RiskAcknowledgement["context"];
  strategyId?: string;
  lessonId?: string;
}) {
  const now = new Date().toISOString();
  const id = `risk-${input.context}-${input.strategyId ?? input.lessonId ?? "global"}-${RISK_TEXT_VERSION}`;
  const record: RiskAcknowledgement = {
    id,
    context: input.context,
    strategyId: input.strategyId,
    lessonId: input.lessonId,
    acceptedTextVersion: RISK_TEXT_VERSION,
    createdAt: now,
    updatedAt: now,
  };

  await db.riskAcknowledgements.put(record);
  return record;
}

export async function getRiskAcknowledgements() {
  return db.riskAcknowledgements.orderBy("createdAt").reverse().toArray();
}

