class OkolobuhaApp {
    /**
     * @param {Config} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Add new expense record.
     */
    addExpenseRecord() {
        let sheetInfo = this.getExpensesSheetInfo();
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
        let date = Utilities.formatDate(new Date(), this.getConfig().get('timezone'), this.getConfig().get('dateFormat'));
        record.setDate(date);
        record.setSum('');
        record.sumCell.activate();
    }

    /**
     * Pay all debts from a certain debtor to a certain payer.
     */
    payDebt() {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const ui = SpreadsheetApp.getUi();

        let range = ss.getActiveCell();
        let debtsSheetInfo = this.getDebtsSheetInfo();

        if (range === undefined) {
            ui.alert('Сначала выберите ячейку с суммой долга');
            return;
        }

        if (debtsSheetInfo.isSumDebtCell(range) === false) {
            let correctRange = debtsSheetInfo.getSheet().getRange(debtsSheetInfo.sumDebtRows[0], debtsSheetInfo.sumDebtColumns[0]).getA1Notation();
            correctRange += ':';
            correctRange += debtsSheetInfo.getSheet().getRange(debtsSheetInfo.sumDebtRows[debtsSheetInfo.sumDebtRows.length - 1], debtsSheetInfo.sumDebtColumns[debtsSheetInfo.sumDebtColumns.length - 1]).getA1Notation();

            ui.alert('Выберите ячейку из диапазона ' + correctRange);
            return;
        }

        let debtSum = parseFloat(range.getValue());
        if (debtSum === 0.0) {
            ui.alert('Выберите ячейку с положительным значением');
            return;
        }

        let payer = debtsSheetInfo.getSumDebtPayerCell(range).getValue();
        let debtor = debtsSheetInfo.getSumDebtDebtorCell(range).getValue();

        let confirm = ui.alert(
            'Перепроверь!',
            'Погасить долг ' + this.getDict().getNoun(debtor, NounCase.ROD) + ' ' + this.getDict().getNoun(payer, NounCase.DAT) + ' в размере '
            + debtSum.toFixed(2) + ' руб.?' + "\n"
            + 'Примечание: работа скрипта займёт некоторое время, не закрывайте таблицу сразу.',
            ui.ButtonSet.YES_NO
        );

        if (confirm !== ui.Button.YES) {
            return;
        }

        let expensesSheetInfo = this.getExpensesSheetInfo();
        let msgBuilder = this.getLogMessageBuilder();
        let row = expensesSheetInfo.firstDataRow - 1;
        let debtMessages = [];
        let recalcMessages = [];
        let debtRestSum = debtSum;

        while (Math.abs(debtRestSum) > 0.01) {
            row++;

            let record = new ExpenseRecord(row, expensesSheetInfo);

            if (record.getPayer() === undefined || record.getPayer() === '') {
                break;
            }

            const isDebtorToPayerRecord = record.getPayer() === payer;
            const isPayerToDebtorRecord = record.getPayer() === debtor;

            if (isDebtorToPayerRecord) {
                let debtRecord = record.getDebtRecordByName(debtor);
                if (debtRecord.getCheck() === true) {
                    continue;
                }

                debtRecord.setCheck(true);
                debtRestSum -= debtRecord.getSum();
                debtMessages.push('[' + debtRecord.getSum().toFixed(2) + ' руб.] ' + msgBuilder.getExpenseRecordInfoLink(record));
            } else if (isPayerToDebtorRecord) {
                let debtRecord = record.getDebtRecordByName(payer);
                if (debtRecord.getCheck() === true) {
                    continue;
                }

                debtRecord.setCheck(true);
                debtRestSum += debtRecord.getSum();
                recalcMessages.push('[-' + debtRecord.getSum().toFixed(2) + ' руб.] ' + msgBuilder.getExpenseRecordInfoLink(record));
            }
        }

        let resultMsg = msgBuilder.getAllDebtsPayment(debtor, payer, debtSum, debtMessages, recalcMessages);

        this.sendTelegramNotification(resultMsg);

        resultMsg = resultMsg.stripTags();
        this.getLogger().log(resultMsg);
        this.getLogger().log('Rows processed: ' + (row - expensesSheetInfo.firstDataRow + 1));
        ui.alert(resultMsg);
    }

    normalizeExpenseRecords() {
        let normalizer = new ExpenseRecordsNormalizer(this.getExpensesSheetInfo());
        normalizer.normalize();
    }

    sendTelegramNotification(msg) {
        if (this.getConfig().get('telegramNotifications') === false) {
            return;
        }

        this.getTelegramBot().sendMessage(msg);
    }

    /**
     * @return {EventHandler}
     */
    getEventHandler() {
        if (this.eventHandler === undefined) {
            this.eventHandler = new EventHandler(this.getExpensesSheetInfo(), this.getLogMessageBuilder(), this.getTelegramBot(), this.getLogger());
        }

        return this.eventHandler;
    }

    /**
     * @return {GoogleAppsScript.Base.Logger}
     */
    getLogger() {
        if (this.logger === undefined) {
            this.logger = Logger;
        }

        return this.logger;
    }

    /**
     * @return {ExpensesSheetInfo}
     */
    getExpensesSheetInfo() {
        if (this.expensesSheetInfo === undefined) {
            this.expensesSheetInfo = new ExpensesSheetInfo();
        }

        return this.expensesSheetInfo;
    }

    /**
     * @return {DebtsSheetInfo}
     */
    getDebtsSheetInfo() {
        if (this.debtsSheetInfo === undefined) {
            this.debtsSheetInfo = new DebtsSheetInfo();
        }

        return this.debtsSheetInfo;
    }

    /**
     * @return {LogMessageBuilder}
     */
    getLogMessageBuilder() {
        if (this.logMessageBuilder === undefined) {
            this.logMessageBuilder = new LogMessageBuilder(this.getDict());
        }

        return this.logMessageBuilder;
    }

    /**
     * @return {TelegramBot}
     */
    getTelegramBot() {
        if (this.telegramBot === undefined) {
            this.telegramBot = new TelegramBot();
        }

        return this.telegramBot;
    }

    /**
     * @return {Dictionary}
     */
    getDict() {
        if (this.dict === undefined) {
            this.dict = new Dictionary(this.getConfig().get('dict'));
        }

        return this.dict;
    }

    /**
     * @return {Config}
     */
    getConfig() {
        return this.config;
    }
}
