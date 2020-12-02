/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function logEvent(e) {
    logPayment(e);
    logNewRecord(e);
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function logNewRecord(e) {
    let range = e.range;
    let sheetInfo = new ExpensesSheetInfo();

    if (!sheetInfo.isInfoCell(range) || e.oldValue !== undefined) {
        return;
    }

    let record = new ExpenseRecord(range.getRow(), sheetInfo);
    let payer = record.getPayer();

    if (!payer) {
        payer = dict.getNoun('кто-то', NounCase.IM);
    }

    let infoLink = '<a href="' + getCellUrl(range, e.source, e.source.getActiveSheet()) + '">' + record.getInfo() + '</a>';
    let msg = payer + " " + dict.getVerb('добавить', dict.getNounGender(payer)) + " новую запись: " + record.getSum().toFixed(2) + " руб. за " + infoLink;
    msg = msg.capitalize();

    Logger.log(msg);
    tgBotSendMessage(msg);
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function logPayment(e) {
    let range = e.range;
    let sheetInfo = new ExpensesSheetInfo();
    if (!sheetInfo.isCheckDebtCell(range)) {
        return;
    }

    let record = new ExpenseRecord(range.getRow(), sheetInfo);
    let debtor = sheetInfo.getDebtorNameByCell(range);
    let debtRecord = record.getDebtRecordByName(debtor);

    if (!debtRecord.getCheck() || !debtRecord.getSum() || record.getPayer() === debtRecord.getName()) {
        return;
    }

    let infoLink = '<a href="' + getCellUrl(record.infoCell, e.source, e.source.getActiveSheet()) + '">' + record.getInfo() + '</a>';
    let msg = debtRecord.getName() + " " + dict.getVerb('заплатить', dict.getNounGender(debtRecord.getName())) + " " + debtRecord.getSum().toFixed(2) + " руб. " + dict.getNoun(record.getPayer(), NounCase.DAT) + " за " + infoLink;
    msg = msg.capitalize();

    Logger.log(msg);
    tgBotSendMessage(msg);
}
