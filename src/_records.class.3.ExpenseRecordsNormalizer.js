class ExpenseRecordsNormalizer {
    /**
     * @param {ExpensesSheetInfo} sheetInfo
     */
    constructor(sheetInfo) {
        this.sheetInfo = sheetInfo;
    }

    normalize() {
        let row = this.sheetInfo.firstDataRow;
        while (true) {
            let record = new ExpenseRecord(row, this.sheetInfo);
            if (!record.isValid()) {
                break;
            }
            record.normalize();
            row++;
        }
    }
}
