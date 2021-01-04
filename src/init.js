if (isDev()) {
    Logger.log('DEV MODE');
}

/**
 * Config initialization.
 * todo it can be encapsulated in okolobuha object too.
 * @type {Config}
 */
let config = new Config(isDev() ? configDev : configProd);

/**
 * Main app object.
 * @type {OkolobuhaApp}
 */
let okolobuha = new OkolobuhaApp(config);
