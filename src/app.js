/**
 * All main endpoints are here.
 */

/**
 * Add new expense record.
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
 * Pay all debts from a certain debtor to a certain payer.
 */
function payDebt() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ui = SpreadsheetApp.getUi();

    let range = ss.getActiveCell();
    let debtsSheetInfo = new DebtsSheetInfo();

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
        'Погасить долг ' + dict.getNoun(debtor, NounCase.ROD) + ' ' + dict.getNoun(payer, NounCase.DAT) + ' в размере '
        + debtSum.toFixed(2) + ' руб.?' + "\n"
        + 'Примечание: работа скрипта займёт некоторое время, не закрывайте таблицу сразу.',
        ui.ButtonSet.YES_NO
    );

    if (confirm !== ui.Button.YES) {
        return;
    }

    let expensesSheetInfo = new ExpensesSheetInfo();
    let msgBuilder = new LogMessageBuilder();
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

    if (config.get('telegramNotifications')) {
        let tgBot = new TelegramBot();
        tgBot.sendMessage(resultMsg);
    }

    resultMsg = resultMsg.stripTags();
    Logger.log(resultMsg);
    Logger.log('Rows processed: ' + (row - expensesSheetInfo.firstDataRow + 1));
    ui.alert(resultMsg);
}

function notifyAboutRent() {
    if (!config.get('telegramNotifications')) {
        return;
    }

    let tgBot = new TelegramBot();
    tgBot.sendMessage('Сегодня день арендной платы! 👻');
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function logEvent(e) {
    let eventHandler = new EventHandler(new ExpensesSheetInfo(), new LogMessageBuilder(), new TelegramBot(), Logger);
    eventHandler.handle(e);
}
