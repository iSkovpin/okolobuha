function addRecord() {
    okolobuha.addExpenseRecord();
}

function payDebt() {
    okolobuha.payDebt();
}

function sendNotifications() {
    let today = new Date();
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (today.getDate() === 25) {
        okolobuha.sendTelegramNotification('Сегодня день арендной платы! 👻');
    }

    if (today.getDate() === lastDayOfMonth.getDate()) {
        okolobuha.sendTelegramNotification('Пришло время сверить счётчики! 🎰');
    }
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
