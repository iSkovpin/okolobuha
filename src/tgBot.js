function tgBotSendMessage(msg) {
    var url = "https://api.telegram.org/bot" + config.get("tgBotToken") + "/sendMessage";

    var data = {
        "chat_id": config.get("tgBotChannelId"),
        "text": msg,
        "disable_notification": tgBotGetTimeAfterLastCall() < config.get("tgBotSilentBuffer"),
        "parse_mode": "HTML"
    };

    var options = {
        "method": "post",
        'contentType': 'application/json',
        'payload': JSON.stringify(data)
    };

    UrlFetchApp.fetch(url, options);
    tgBotSetLastCallTime();
}

function tgBotGetTimeAfterLastCall() {
    return Date.now() / 1000 - tgBotGetLastCallTime();
}

function tgBotGetLastCallTime() {
    var scriptProperties = PropertiesService.getScriptProperties();
    var timestamp = scriptProperties.getProperty('TG_BOT_LAST_CALL_TIME');

    if (timestamp === undefined) {
        timestamp = 0;
    }

    return timestamp;
}

function tgBotSetLastCallTime(timestamp) {
    if (timestamp === undefined) {
        timestamp = Date.now() / 1000;
    }

    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('TG_BOT_LAST_CALL_TIME', timestamp);
}
