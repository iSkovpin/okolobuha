

if (isDev()) {
    Logger.log('DEV MODE');
}



/**
 * Config initialization.
 */
if (isDev()) {
    configSource = configDev;
} else {
    configSource = configProd;
}

let config = new Config(configSource);
