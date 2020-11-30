function isDev() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    return sheet.getName().indexOf('dev') != -1;
}

function getConfig(prop) {
    if (isDev()) {
        return getConfigDev(prop);
    }
    return getConfigProd(prop);
}

function getConfigProd(prop) {
    return configProd[prop];
}

function getConfigDev(prop) {
    return configDev[prop];
}
