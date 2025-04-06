function formatMillisToShortWeekDay(millis) {
  const date = new Date(millis);
  const shortWeekDay = date.toLocaleDateString("pt-BR", { weekday: "short" });
  return shortWeekDay;
}

function formatMillisToDate(millis) {
  const date = new Date(millis);
  const dateFormated = date.toLocaleDateString();
  return dateFormated;
}

function formatMillisToTime(millis) {
  const date = new Date(millis);
  const timeFormated = date.toLocaleTimeString();
  return timeFormated;
}

function formatMillisToDateTime(millis) {
  const date = new Date(millis);
  const dateFormated = date.toLocaleDateString();
  const timeFormated = date.toLocaleTimeString();
  return `${dateFormated} ${timeFormated}`;
}

export {
  formatMillisToShortWeekDay,
  formatMillisToDate,
  formatMillisToTime,
  formatMillisToDateTime,
};
