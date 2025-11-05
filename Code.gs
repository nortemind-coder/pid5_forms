/**
 * SETTINGS
 */
const SHEET_NAME = 'Respostas';                 // Aba onde salvar
const SPREADSHEET_NAME = 'Respostas PID-5';     // Nome da planilha

function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'home';
  const template = HtmlService.createTemplateFromFile(page === 'form' ? 'form' : 'index');
  template.page = page;
  const html = template.evaluate()
    .setTitle('Questionário – 220 Afirmações')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return html;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Garante cabeçalho: Timestamp | Nome | Idade | SubmissionID | Q1..Q220
function ensureHeader() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByName(SPREADSHEET_NAME);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  const expectedCols = 224; // 4 fixos + 220
  if (sheet.getLastRow() === 0) {
    const header = ['Timestamp','Nome','Idade','SubmissionID'];
    for (let i = 1; i <= 220; i++) header.push(`Q${i}`);
    sheet.getRange(1,1,1,header.length).setValues([header]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastColumn() < expectedCols) {
    const range = sheet.getRange(1,1,1,expectedCols);
    const values = range.getValues()[0];
    if (!values[0]) values[0] = 'Timestamp';
    if (!values[1]) values[1] = 'Nome';
    if (!values[2]) values[2] = 'Idade';
    if (!values[3]) values[3] = 'SubmissionID';
    for (let i = 4; i < expectedCols; i++) if (!values[i]) values[i] = `Q${i-3}`;
    range.setValues([values]);
  }
}

// Recebe e grava respostas
function submitAnswers(payload) {
  // payload: { nome, idade, answers[220] }
  if (!payload || !payload.answers || payload.answers.length !== 220) {
    throw new Error('Envio inválido: são necessárias 220 respostas.');
  }
  if (!payload.nome || String(payload.nome).trim() === '') {
    throw new Error('Informe o Nome.');
  }
  if (payload.idade === undefined || payload.idade === null || String(payload.idade).trim() === '' || isNaN(Number(payload.idade))) {
    throw new Error('Informe a Idade (número).');
  }

  ensureHeader();

  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByName(SPREADSHEET_NAME);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const submissionId = Utilities.getUuid();

  const row = [
    new Date(),
    String(payload.nome).trim(),
    Number(payload.idade),
    submissionId,
    ...payload.answers
  ];

  sheet.appendRow(row);
  return { ok: true, submissionId };
}