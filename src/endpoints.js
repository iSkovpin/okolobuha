function addRecord() {
    okolobuha.addExpenseRecord();
}

function payDebt() {
    okolobuha.payDebt();
}

function notifyAboutRent() {
    okolobuha.sendTelegramNotification('Сегодня день арендной платы! 👻');
}

function normalizeExpenseRecords() {
    okolobuha.normalizeExpenseRecords();
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function logEvent(e) {
    okolobuha.getEventHandler().handle(e);
}
