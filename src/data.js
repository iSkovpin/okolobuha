function addRecord() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    var srcRowNum = getSampleDataRow();
    var destRowNum = srcRowNum + 1;
    sheet.insertRowAfter(srcRowNum);

    var srcRow = getRecord(srcRowNum);
    var destRow = getRecord(destRowNum);

    srcRow.copyTo(destRow);

    var date = Utilities.formatDate(new Date(), "GMT+7", "dd.MM.yyyy");
    var dateCell = getDateCell(destRowNum);
    dateCell.setValue(date);

    var sumCell = getSumCell(destRowNum);
    sumCell.activate().setValue("");
}

function getRecord(row) {
    return SpreadsheetApp.getActiveSpreadsheet().getRange("A" + row + ":S" + row);
}

function getFirstDataRow() {
    return 4;
}

function getSampleDataRow() {
    return 3;
}

function getDateCell(row) {
    return SpreadsheetApp.getActiveSpreadsheet().getRange("A" + row);
}

function getSumCell(row) {
    return SpreadsheetApp.getActiveSpreadsheet().getRange("B" + row);
}

function getDebtCell(row) {
    return SpreadsheetApp.getActiveSpreadsheet().getRange("C" + row);
}

function getWhoCell(row) {
    return SpreadsheetApp.getActiveSpreadsheet().getRange("D" + row);
}

function getInfoCell(row) {
    return SpreadsheetApp.getActiveSpreadsheet().getRange("E" + row);
}

/**
 * @param {GoogleAppsScript.Spreadsheet.Range} range
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @return {string}
 */
function getCellUrl(range, ss, sheet) {
    if (ss === undefined) {
        ss = SpreadsheetApp.getActiveSpreadsheet();
    }
    if (sheet === undefined) {
        sheet = ss.getActiveSheet();
    }

    return ss.getUrl() + '#gid=' + sheet.getSheetId() + "&range=" + range.getA1Notation();
}
