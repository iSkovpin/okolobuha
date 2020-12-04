/**
 * Information about expenses sheet.
 */
class ExpensesSheetInfo extends SheetInfo {
    constructor() {
        let sheetNameConfigVar = 'sheets.expenses';
        super(sheetNameConfigVar);

        this.debtorsColumns = [];
        this.config.columns.debtors.forEach(debtorColumns => this.debtorsColumns.push(debtorColumns));

        this.tableHeaderRow = this.config.rows.tableHeader;
        this.sampleDataRow = this.config.rows.sampleData;
        this.firstDataRow = this.config.rows.firstData;

        this.columnDate = this.config.columns.date;
        this.columnExpenseSum = this.config.columns.sum;
        this.columnDebt = this.config.columns.sumDebt;
        this.columnPayer = this.config.columns.payer;
        this.columnInfo = this.config.columns.info;
    }

    /**
     * @return {number[]}
     */
    getDebtColumns() {
        let result = [];
        this.debtorsColumns.forEach(debtorColumns => result.push(debtorColumns.sum));
        return result;
    }

    /**
     * @return {number[]}
     */
    getCheckDebtColumns() {
        let result = [];
        this.debtorsColumns.forEach(debtorColumns => result.push(debtorColumns.check));
        return result;
    }

    /**
     * @return {number[]}
     */
    getParticipantColumns() {
        let result = [];
        this.debtorsColumns.forEach(debtorColumns => result.push(debtorColumns.participant));
        return result;
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
    isSumDebtCell(range) {
        return this.isDataCell(range)
            && range.getColumn() === this.columnDebt;
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isPayerCell(range) {
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
    isCheckDebtCell(range) {
        return this.isDataCell(range)
            && this.isCellColumnIn(range, this.getCheckDebtColumns());
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {boolean}
     */
    isDebtCell(range) {
        return this.isDataCell(range)
            && this.isCellColumnIn(range, this.getDebtColumns());
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @return {string}
     */
    getDebtorNameByCell(range) {
        if (this.isDataCell(range) === false) {
            throw range.getA1Notation() + ' is not a data cell';
        }

        let column = range.getColumn();
        for (let i = 0; i < this.debtorsColumns.length; i++) {
            for (let key in this.debtorsColumns[i]) {
                if (this.debtorsColumns[i][key] === column) {
                    return this.getSheet().getRange(this.tableHeaderRow, this.debtorsColumns[i].name).getValue();
                }
            }
        }

        throw 'Debtor name for a cell ' + range.getA1Notation() + ' not found';
    }

    /**
     * @param {string} debtorName
     * @return {number}
     */
    getDebtorColumnByName(debtorName) {
        return this.getDebtorColumnsByName(debtorName).name;
    }

    /**
     * @param {string} debtorName
     * @return {number}
     */
    getCheckDebtColumnByName(debtorName) {
        return this.getDebtorColumnsByName(debtorName).check;
    }

    /**
     * @param {string} debtorName
     * @return {number}
     */
    getParticipantColumnByName(debtorName) {
        return this.getDebtorColumnsByName(debtorName).participant;
    }

    /**
     * @param {string} debtorName
     * @return {Object}
     */
    getDebtorColumnsByName(debtorName) {
        for (let i = 0; i < this.debtorsColumns.length; i++) {
            let range = this.getSheet().getRange(this.tableHeaderRow, this.debtorsColumns[i].name);
            if (range.getValue() === debtorName) {
                return this.debtorsColumns[i];
            }
        }

        throw 'Debtor '+ debtorName + ' not found';
    }
}
