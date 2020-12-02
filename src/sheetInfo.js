/**
 * Information about some sheet.
 */
class SheetInfo {
    /**
     * @param {string} sheetConfigVar
     */
    constructor(sheetConfigVar) {
        this.sheetNameConfigVar = sheetConfigVar;
        if (this.sheetNameConfigVar === undefined) {
            throw 'sheetConfigVar is not defined';
        }

        this.config = config.get(sheetConfigVar);
    }

    /**
     * @return {GoogleAppsScript.Spreadsheet.Sheet}
     */
    getSheet() {
        return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.config.name);
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
     * @return {boolean}
     */
    isCorrectSheet(sheet) {
        return sheet.getName() === this.config.name;
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
     * @param {number[]} columns
     * @return {boolean}
     */
    isCellColumnIn(range, columns) {
        return columns.indexOf(range.getColumn()) !== -1
    }

    /**
     * @param {GoogleAppsScript.Spreadsheet.Range} range
     * @param {number[]} rows
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
