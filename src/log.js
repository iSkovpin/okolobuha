function logEvent(e) {
  logPayment(e);
  logNewRecord(e);
}

function logNewRecord(e) {
  var range = e.range;
  if (!isInfoCell(range) || e.oldValue != undefined) {
    return;
  }
  
  var row = parseInt(range.getRow());
  var who = getWhoCell(row).getValue(); 
  var sum = getSumCell(row).getValue().toFixed(2);
  var info = getInfoCell(row).getValue();

  var msg = who + " добавил(а) новую запись: " + sum + " руб. за \"" + info + "\"";
  Logger.log(msg);
  tgBotSendMessage(msg);  
}

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
  
  var msg = fromWho + " заплатил(а) " + howMuch + " руб. для " + who + " за \"" + info + "\"";
  Logger.log(msg);
  tgBotSendMessage(msg);    
}