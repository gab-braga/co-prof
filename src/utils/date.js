function formatMillisToShortWeekDay(millis) {
  const date = new Date(millis);
  const shortWeekDay = date.toLocaleDateString('pt-BR', { weekday: 'short' });
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

function formatRecordingTitle(recording) {
  const weekDay = formatMillisToShortWeekDay(recording.recordingStartTime);
  const date = formatMillisToDate(recording.recordingStartTime);
  const startTime = formatMillisToTime(recording.recordingStartTime);
  const stopTime = formatMillisToTime(recording.recordingStopTime);
  return `${weekDay} ${date} ${startTime} - ${stopTime}`;
}

export {
  formatMillisToShortWeekDay,
  formatMillisToDate,
  formatMillisToTime,
  formatMillisToDateTime,
  formatRecordingTitle,
};
