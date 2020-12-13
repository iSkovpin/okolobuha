class ExpenseRecord extends DataRecord {
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

    /**
     * @return {boolean}
     */
    isValid() {
        return Boolean(this.getSum()) && Boolean(this.getPayer());
    }

    normalize() {
        for (let debtorName in this.debtRecords) {
            let debtRecord = this.debtRecords[debtorName];
            if ((debtRecord.getSum() === 0.0 && debtRecord.getCheck() === false) || debtRecord.getName() === this.getPayer()) {
                debtRecord.setCheck(true);
            }
        }
    }
}
