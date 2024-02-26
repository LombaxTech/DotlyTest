export function getCurrentDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getDifferenceInDays(startDate: any, endDate: any) {
  // Convert both dates to milliseconds
  const startMilliseconds = startDate.getTime();
  const endMilliseconds = endDate.getTime();

  // Calculate the difference in milliseconds
  const differenceMilliseconds = Math.abs(endMilliseconds - startMilliseconds);

  // Convert the difference to days
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const differenceInDays = Math.floor(
    differenceMilliseconds / millisecondsInADay
  );

  return differenceInDays;
}
