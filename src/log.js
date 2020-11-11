/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function logEvent(e) {
  logPayment(e);
  logNewRecord(e);
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function logNewRecord(e) {
  var range = e.range;
  if (!isInfoCell(range) || e.oldValue != undefined) {
    return;
  }
  
  var row = parseInt(range.getRow());
  var who = getWhoCell(row).getValue(); 
  var sum = getSumCell(row).getValue().toFixed(2);
  var info = getInfoCell(row).getValue();

  let infoLink = '<a href="' + getCellUrl(range, e.source, e.source.getActiveSheet()) + '">' + info + '</a>';
  var msg = who + " " + dict.getVerb('добавить', dict.getNounGender(who)) + " новую запись: " + sum + " руб. за " + infoLink;

  Logger.log(msg);
  tgBotSendMessage(msg);  
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function logPayment(e) {
  if (!isCheckPaymentCell(e.range)) {
    return;
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var range = e.range;
  var col = parseInt(range.getColumn());
  var row = parseInt(range.getRow());
  
  var resultCell = sheet.getRange(row, col, 1);
  var partCell = sheet.getRange(row, col - 1, 1);  
  var who = getWhoCell(row).getValue();
  var info = getInfoCell(row).getValue();
  var fromWho = sheet.getRange(2, col - 1, 1).getValue();
  var howMuch = partCell.getValue().toFixed(2);
  
  if (!resultCell.getValue() || !partCell.getValue() || who == fromWho) {
    return;
  }

  let infoLink = '<a href="' + getCellUrl(getInfoCell(row), e.source, e.source.getActiveSheet()) + '">' + info + '</a>';
  var msg = fromWho + " " + dict.getVerb('заплатить', dict.getNounGender(fromWho)) + " " + howMuch + " руб. " + dict.getNoun(who, NounCase.DAT)  + " за " + infoLink;

  Logger.log(msg);
  tgBotSendMessage(msg);    
}
