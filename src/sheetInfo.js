/**
 * Information about some sheet.
 */
class SheetInfo {
    /**
     * @param {string} sheetNameConfigVar
     */
    constructor(sheetNameConfigVar) {
        this.sheetNameConfigVar = sheetNameConfigVar;
        if (this.sheetNameConfigVar === undefined) {
            throw 'sheetNameConfigVar is not defined';
        }

        this.sheetName = getConfig(sheetNameConfigVar);
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
     * @return {boolean}
     */
    isCorrectSheet(sheet) {
        return sheet.getName() === this.sheetName;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isCorrectSheetByRange(range) {
        return this.isCorrectSheet(range.getSheet());
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @param {int[]} columns
     * @return {boolean}
     */
    isCellColumnIn(range, columns) {
        return columns.indexOf(range.getColumn()) !== -1
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @param {int[]} rows
     * @return {boolean}
     */
    isCellRowIn(range, rows) {
        return rows.indexOf(range.getRow()) !== -1
    }
}

/**
 * Information about debts sheet.
 */
class DebtsSheetInfo extends SheetInfo {
    constructor() {
        const sheetNameConfigVar = 'debtsSheetName';
        super(sheetNameConfigVar);

        this.sumDebtRows = [17, 18, 19, 20];
        this.sumDebtColumns = [2, 3, 4, 5];
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     */
    isSumDebtCell(range) {
        return this.isCorrectSheetByRange(range)
            && this.isCellRowIn(range, this.sumDebtRows)
            && this.isCellColumnIn(range, this.sumDebtColumns);
    }
}

/**
 * Information about expenses sheet.
 */
class ExpensesSheetInfo extends SheetInfo {
    constructor() {
        let sheetNameConfigVar = 'expensesSheetName';
        super(sheetNameConfigVar);

        this.paymentColumns = [6, 8, 10, 12];
        this.checkPaymentColumns = [7, 9, 11, 13];
        this.firstDataRow = 4;
        this.sampleDataRow = 3;
        this.columnDate = 1;
        this.columnExpenseSum = 2;
        this.columnDebt = 3;
        this.columnPayer = 4;
        this.columnInfo = 5;
    }

    /**
     * @param {int} row
     * @return {boolean}
     */
    isDataRow(row) {
        return row >= this.firstDataRow;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isDataCell(range) {
        return this.isCorrectSheetByRange(range) && this.isDataRow(range.getRow());
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isDateCell(range) {
        return this.isCorrectSheetByRange(range)
            && this.isDataCell(range)
            && range.getColumn() === this.columnDate;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isSumCell(range) {
        return this.isDataCell(range)
            && range.getColumn() === this.columnExpenseSum;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isDebtCell(range) {
        return this.isDataCell(range)
            && range.getColumn() === this.columnDebt;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isWhoCell(range) {
        return this.isDataCell(range)
            && range.getColumn() === this.columnPayer;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isInfoCell(range) {
        return this.isDataCell(range)
            && range.getColumn() === this.columnInfo;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isCheckPaymentCell(range) {
        return this.isDataCell(range)
            && this.isCellColumnIn(range, this.checkPaymentColumns);
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isPaymentCell(range) {
        return this.isDataCell(range)
            && this.isCellColumnIn(range, this.paymentColumns);
    }
}
