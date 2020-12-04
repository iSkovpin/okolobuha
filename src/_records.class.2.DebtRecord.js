class DebtRecord extends DataRecord {
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
