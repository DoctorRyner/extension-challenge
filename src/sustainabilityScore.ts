export type SustainabilityScore = 'good' | 'oneleaf' | 'noleaf' | 'bad';

export function numberToSustainabilityScore(sustainabilityScore: number): SustainabilityScore {
  if (sustainabilityScore < 25) {
    return 'bad';
  } else if (sustainabilityScore < 50) {
    return 'noleaf';
  } else if (sustainabilityScore < 75) {
    return 'oneleaf';
  } else {
    return 'good';
  }
}
