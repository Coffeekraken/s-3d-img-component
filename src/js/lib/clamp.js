export default function clamp(number, lower, upper) {
  if (upper !== undefined) {
    number = number <= upper ? number : upper
  }
  if (lower !== undefined) {
    number = number >= lower ? number : lower
  }
  return number
}
