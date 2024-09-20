export function minToDays(mins: number, toString: boolean) {
  let days = Math.floor(mins / 1440);
  let remainingTime = mins - Math.floor(days * 1440);
  let hours = Math.floor(remainingTime / 60);
  let minutes = Math.floor(remainingTime - hours * 60);
  return toString
    ? `${days} day(s) and ${hours} hour(s) and ${minutes} minutes(s).`
    : { days, hours, minutes };
}
