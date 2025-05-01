import { HTML_REGEX } from "./regex";

function formatSummaryText(data) {
  if (!data) throw new Error("Data cannot be null");
  const { summary, actionItems, keyConcepts, examples } = data;
  const summaryText = htmlToText(summary);
  const actionItemsText = arrayToText(actionItems);
  const keyConceptsText = arrayToText(keyConcepts);
  const examplesText = arrayToText(examples);
  const text = `* Resumo\n${summaryText}\n\n* Marcos\n${actionItemsText}\n\n* Conceitos Chave\n${keyConceptsText}\n\n* Exemplos\n${examplesText}`;
  return text;
}

function htmlToText(html) {
  const text = html.replace(HTML_REGEX, '');
  return text;
}

function arrayToText(array) {
  if (!Array.isArray(array)) return "";
  const arrayPined = array.map(item => `- ${item}`);
  const text = arrayPined.join("\n");
  return text;
}

export { formatSummaryText }