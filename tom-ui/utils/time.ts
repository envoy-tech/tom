export function minToDays(mins: number, toString: boolean) {
  let timeToAllocate = mins;
  if (timeToAllocate === undefined || Number.isNaN(timeToAllocate)) {
    timeToAllocate = 0;
  }

  let days = Math.floor(timeToAllocate / 1440);
  let remainingTime = timeToAllocate - Math.floor(days * 1440);
  let hours = Math.floor(remainingTime / 60);
  let minutes = Math.floor(remainingTime - hours * 60);
  return toString
    ? `${days} day(s) and ${hours} hour(s) and ${minutes} minutes(s).`
    : { days, hours, minutes };
}
