export function momentumScore(
  starDelta: number,
  contributorDelta: number,
  issueDelta: number = 0
) {
  return starDelta * 2 + contributorDelta * 5 + issueDelta * 1.5;
}