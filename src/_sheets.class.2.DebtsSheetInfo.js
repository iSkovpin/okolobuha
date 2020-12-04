/**
 * Information about debts sheet.
 */
class DebtsSheetInfo extends SheetInfo {
    constructor() {
        const sheetConfigVar = 'sheets.debts';
        super(sheetConfigVar);

        this.sumDebtRows = this.config.rows.sumDebt;
        this.sumDebtColumns = this.config.columns.sumDebt;
        this.sumDebtPayersColumn = this.config.columns.sumDebtPayers;
        this.sumDebtDebtorsRow = this.config.rows.sumDebtDebtors;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     */
    isSumDebtCell(range) {
        return this.isCorrectSheetByRange(range)
            && this.isCellRowIn(range, this.sumDebtRows)
            && this.isCellColumnIn(range, this.sumDebtColumns);
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     */
    getSumDebtPayerCell(range) {
        if (this.isSumDebtCell(range) === false) {
            throw range.getA1Notation() + ' is not a sum debt cell';
        }

        let sheet = this.getSheet();
        return sheet.getRange(range.getRow(), this.sumDebtPayersColumn);
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     */
    getSumDebtDebtorCell(range) {
        if (this.isSumDebtCell(range) === false) {
            throw range.getA1Notation() + ' is not a sum debt cell';
        }

        let sheet = this.getSheet();
        return sheet.getRange(this.sumDebtDebtorsRow, range.getColumn());
    }
}
