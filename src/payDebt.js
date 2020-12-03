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
        + debtSum.toFixed(2) + ' руб.?' + "\n\n"
        + 'Примечание: работа скрипта займёт некоторое время, не закрывайте таблицу сразу.',
        ui.ButtonSet.YES_NO
    );

    if (confirm !== ui.Button.YES) {
        return;
    }

    let expensesSheetInfo = new ExpensesSheetInfo();
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
            debtMessages.push('[' + debtRecord.getSum().toFixed(2) + ' руб.] ' + record.getInfo());
        } else if (isPayerToDebtorRecord) {
            let debtRecord = record.getDebtRecordByName(payer);
            if (debtRecord.getCheck() === true) {
                continue;
            }

            debtRecord.setCheck(true);
            debtRestSum += debtRecord.getSum();
            recalcMessages.push('[-' + debtRecord.getSum().toFixed(2) + ' руб.] ' + record.getInfo());
        }
    }

    let resultMsg = "Долг " + dict.getNoun(debtor, NounCase.ROD) + ' ' + dict.getNoun(payer, NounCase.DAT) + " в размере " + debtSum.toFixed(2) + " руб. погашен с учётом взаимного перерасчёта.\n\nПозиции:\n";
    debtMessages.forEach(msg => resultMsg += msg + "\n");

    if (recalcMessages.length > 0) {
        resultMsg += "\nПерерасчёт:\n"
        recalcMessages.forEach(msg => resultMsg += msg + "\n");
    }

    Logger.log(resultMsg);
    Logger.log('Rows processed: ' + (row - expensesSheetInfo.firstDataRow + 1));
    tgBotSendMessage(resultMsg);

    ui.alert(resultMsg);
}
