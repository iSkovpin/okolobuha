class EventHandler {
    /**
     * @param {ExpensesSheetInfo} expensesSheetInfo
     * @param {LogMessageBuilder} msgBuilder
     * @param {TelegramBot} tgBot
     * @param {GoogleAppsScript.Base.Logger} logger
     */
    constructor(expensesSheetInfo, msgBuilder, tgBot, logger) {
        this.logger = logger;
        this.msgBuilder = msgBuilder;
        this.expensesSheetInfo = expensesSheetInfo;
        this.tgBot = tgBot;
    }

    /**
     * @param {GoogleAppsScript.Events.SheetsOnEdit} e
     */
    handle(e) {
        if (this.handleNewRecordEvent(e)) return;
        if (this.handleDebtPaymentEvent(e)) return;
    }

    /**
     * @param {GoogleAppsScript.Events.SheetsOnEdit} e
     */
    handleDebtPaymentEvent(e) {
        if (!this.expensesSheetInfo.isCheckDebtCell(e.range)) {
            return false;
        }

        let record = new ExpenseRecord(e.range.getRow(), this.expensesSheetInfo);
        let debtor = this.expensesSheetInfo.getDebtorNameByCell(e.range);
        let debtRecord = record.getDebtRecordByName(debtor);

        if (!debtRecord.getCheck() || !debtRecord.getSum() || record.getPayer() === debtRecord.getName()) {
            return false;
        }

        let msg = this.msgBuilder.getDebtPaymentMsg(record, debtRecord);
        this.logger.log(msg);
        if (config.get('telegramNotifications')) {
            this.tgBot.sendMessage(msg);
        }
        return true;
    }

    /**
     * @param {GoogleAppsScript.Events.SheetsOnEdit} e
     */
    handleNewRecordEvent(e) {
        if (!(this.expensesSheetInfo.isInfoCell(e.range) && e.oldValue === undefined)) {
            return false;
        }
        let record = new ExpenseRecord(e.range.getRow(), this.expensesSheetInfo);
        let msg = this.msgBuilder.getNewRecordMsg(record);
        this.logger.log(msg);
        if (config.get('telegramNotifications')) {
            this.tgBot.sendMessage(msg);
        }
        return true;
    }
}
