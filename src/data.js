/**
 * Add new expense record
 */
function addRecord() {
    let sheetInfo = new ExpensesSheetInfo();
    let sheet = sheetInfo.getSheet();

    let srcRowNum = sheetInfo.sampleDataRow;
    let destRowNum = sheetInfo.firstDataRow;
    sheet.insertRowBefore(destRowNum);

    let firstColumn = sheetInfo.getFirstConfigurableColumn();
    let lastColumn = sheetInfo.getLastConfigurableColumn();
    let columnsNumber = lastColumn - firstColumn + 1;

    let srcRow = sheet.getRange(srcRowNum, firstColumn, 1, columnsNumber);
    let destRow = sheet.getRange(destRowNum, firstColumn, 1, columnsNumber);

    srcRow.copyTo(destRow);

    let record = new ExpenseRecord(destRowNum, sheetInfo);
    let date = Utilities.formatDate(new Date(), config.get('timezone'), config.get('dateFormat'));
    record.setDate(date);
    record.setSum('');
    record.sumCell.activate();
}


/**
 * Common record class. Only for extending.
 */
class Record {
    /**
     * @param {number} row
     * @param {ExpensesSheetInfo|DebtsSheetInfo} sheetInfo
     */
    constructor(row, sheetInfo) {
        this.row = row;
        this.sheetInfo = sheetInfo;
    }

    /**
     * @param {number} column
     * @return {string}
     */
    getCellValue(column) {
        return this.getCell(column).getValue();
    }

    /**
     *
     * @param {number} column
     * @param {number?} row
     * @return {GoogleAppsScript.Spreadsheet.Range}
     */
    getCell(column, row) {
        if (row === undefined) {
            row = this.row;
        }
        return this.sheetInfo.getSheet().getRange(row, column);
    }
}

class DebtRecord extends Record {
    /**
     * @param {number} row
     * @param {ExpensesSheetInfo} sheetInfo
     * @param {Object} debtorConfig
     */
    constructor(row, sheetInfo, debtorConfig) {
        super(row, sheetInfo);
        this.debtorConfig = debtorConfig;

        this.nameCell = this.getCell(debtorConfig.name, sheetInfo.tableHeaderRow);
        this.sumCell = this.getCell(debtorConfig.sum);
        this.checkCell = this.getCell(debtorConfig.check);
        this.participantCell = this.getCell(debtorConfig.participant);
    }

    /**
     * @return {string}
     */
    getName() {
        return this.nameCell.getValue();
    }

    /**
     * @return {number}
     */
    getSum() {
        return parseFloat(this.sumCell.getValue());
    }

    /**
     * @return {boolean}
     */
    getCheck() {
        return Boolean(this.checkCell.getValue());
    }

    /**
     * @return {boolean}
     */
    getIsParticipant() {
        return Boolean(this.participantCell.getValue());
    }

    /**
     * @param {boolean} value
     * @return {DebtRecord}
     */
    setCheck(value) {
        this.checkCell.setValue(value);
        return this;
    }

    /**
     * @param {boolean} value
     * @return {DebtRecord}
     */
    setIsParticipant(value) {
        this.participantCell.setValue(value);
        return this;
    }
}

class ExpenseRecord extends Record {

    /**
     * @param {number} row
     * @param {ExpensesSheetInfo} sheetInfo
     */
    constructor(row, sheetInfo) {
        super(row, sheetInfo);

        this.dateCell = this.getCell(this.sheetInfo.columnDate);
        this.sumCell = this.getCell(this.sheetInfo.columnExpenseSum);
        this.sumDebtCell = this.getCell(this.sheetInfo.columnDebt);
        this.payerCell = this.getCell(this.sheetInfo.columnPayer);
        this.infoCell = this.getCell(this.sheetInfo.columnInfo);

        this.debtRecords = {};
        this.sheetInfo.debtorsColumns.forEach(debtorColumns => {
                let debtRecord = new DebtRecord(this.row, this.sheetInfo, debtorColumns);
                this.debtRecords[debtRecord.getName()] = debtRecord;
            }
        );
    }

    /**
     * @return {string}
     */
    getDate() {
        return this.dateCell.getValue();
    }

    /**
     * @return {number}
     */
    getSum() {
        return parseFloat(this.sumCell.getValue());
    }

    /**
     * @return {number}
     */
    getSumDebt() {
        return parseFloat(this.sumDebtCell.getValue());
    }

    /**
     * @return {string}
     */
    getPayer() {
        return this.payerCell.getValue();
    }

    /**
     * @return {string}
     */
    getInfo() {
        return this.infoCell.getValue();
    }

    /**
     * @return {Object}
     */
    getDebtRecords() {
        return this.debtRecords;
    }

    /**
     * @param {String} debtorName
     * @return {DebtRecord}
     */
    getDebtRecordByName(debtorName) {
        let record = this.debtRecords[debtorName];
        if (record === undefined) {
            throw 'Debtor ' + debtorName + ' not found';
        }

        return record;
    }

    /**
     * @param {string} value
     * @return {ExpenseRecord}
     */
    setDate(value) {
        this.dateCell.setValue(value);
        return this;
    }

    /**
     * @param {number} value
     * @return {ExpenseRecord}
     */
    setSum(value) {
        this.sumCell.setValue(value);
        return this;
    }

    /**
     * @param {number} value
     * @return {ExpenseRecord}
     */
    setPayer(value) {
        this.payerCell.setValue(value);
        return this;
    }

    /**
     * @param {number} value
     * @return {ExpenseRecord}
     */
    setInfo(value) {
        this.infoCell.setValue(value);
        return this;
    }
}
