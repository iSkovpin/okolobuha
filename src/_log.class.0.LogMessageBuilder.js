class LogMessageBuilder {
    /**
     * @param {ExpenseRecord} expenseRecord
     * @return {string}
     */
    getNewRecordMsg(expenseRecord) {
        let payer = expenseRecord.getPayer();
        if (!payer) {
            payer = dict.getNoun('кто-то', NounCase.IM);
        }

        let infoLink = this.getExpenseRecordInfoLink(expenseRecord);
        let msg = payer + " " + dict.getVerb('добавить', dict.getNounGender(payer)) + " новую запись: " + expenseRecord.getSum().toFixed(2) + " руб. за " + infoLink;
        return msg.capitalize();
    }

    /**
     * @param {ExpenseRecord} expenseRecord
     * @param {DebtRecord} debtRecord
     * @return {string}
     */
    getDebtPaymentMsg(expenseRecord, debtRecord) {
        let infoLink = this.getExpenseRecordInfoLink(expenseRecord);
        let msg = debtRecord.getName() + " " + dict.getVerb('заплатить', dict.getNounGender(debtRecord.getName())) + " " + debtRecord.getSum().toFixed(2) + " руб. " + dict.getNoun(expenseRecord.getPayer(), NounCase.DAT) + " за " + infoLink;
        return msg.capitalize();
    }

    /**
     * @param {string} debtorName
     * @param {string} payerName
     * @param {number} debtSum
     * @param {string[]} debtMessages
     * @param {string[]} recalcMessages
     * @return {string}
     */
    getAllDebtsPayment(debtorName, payerName, debtSum, debtMessages, recalcMessages) {
        let resultMsg = "Долг " + dict.getNoun(debtorName, NounCase.ROD) + ' ' + dict.getNoun(payerName, NounCase.DAT) + " в размере " + debtSum.toFixed(2) + " руб. погашен с учётом взаимного перерасчёта.\n\nПозиции:\n";
        debtMessages.forEach(msg => resultMsg += msg + "\n");

        if (recalcMessages.length > 0) {
            resultMsg += "\nПерерасчёт:\n"
            recalcMessages.forEach(msg => resultMsg += msg + "\n");
        }

        return resultMsg;
    }

    /**
     * @param {ExpenseRecord} expenseRecord
     * @return {string}
     */
    getExpenseRecordInfoLink(expenseRecord) {
        return '<a href="' + getCellUrl(expenseRecord.infoCell) + '">' + expenseRecord.getInfo() + '</a>';
    }
}
