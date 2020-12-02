if (isDev()) {
    Logger.log('DEV MODE');
}

/**
 * Config initialization.
 */
let config = new Config(isDev() ? configDev : configProd);
