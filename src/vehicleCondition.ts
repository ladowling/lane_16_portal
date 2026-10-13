// The backend has no fields for warning lights or interior odor, so the seller form stores them only inside a
// vehicle's `condition` text, as "exterior | mechanical | tires | warning lights | odor". Everything that writes
// or reads that text goes through these two helpers so the format stays in one place.

type ConditionSummaryParts = {
  exterior: string;
  mechanical: string;
  tires: string;
  warningLights?: string;
  interiorOdor?: string;
};

export const buildConditionSummary = ({ exterior, mechanical, tires, warningLights, interiorOdor }: ConditionSummaryParts) =>
  [exterior, mechanical, tires, warningLights, interiorOdor].filter(Boolean).join(' | ');

// Reads warning lights and odor back only when the first three parts match the dedicated fields,
// so a differently formatted summary isn't misread
export const parseConditionSummary = (condition: string, exterior: string, mechanical: string, tires: string) => {
  const parts = condition.split(' | ');
  const isSellerFormSummary = parts.length === 5 && parts[0] === exterior && parts[1] === mechanical && parts[2] === tires;
  return isSellerFormSummary ? { warningLights: parts[3], interiorOdor: parts[4] } : {};
};
