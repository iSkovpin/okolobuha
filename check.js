function isDataRow(row) {
  return row >= getFirstDataRow();
}

function isDataCell(range) {  
  return isDataRow(range.getRow());
}

function isDateCell(range) {
  return isDataCell(range) && range.getColumn() == 1;
}

function isSumCell(range) {
  return isDataCell(range) && range.getColumn() == 2;
}

function isDebtCell(range) {
  return isDataCell(range) && range.getColumn() == 3;
}

function isWhoCell(range) {
  return isDataCell(range) && range.getColumn() == 4;
}

function isInfoCell(range) {
  return isDataCell(range) && range.getColumn() == 5;
}

function isCheckPaymentCell(range) {
  return isDataCell(range) && [7,9,11,13].indexOf(parseInt(range.getColumn())) !== -1;
}

function isPaymentCell(range) {
  return isDataCell(range) && [6,8,10,12].indexOf(parseInt(range.getColumn())) !== -1;
}