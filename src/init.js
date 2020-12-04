if (isDev()) {
    Logger.log('DEV MODE');
}

/**
 * Config initialization.
 * @type {Config}
 */
let config = new Config(isDev() ? configDev : configProd);

/**
 * Dictionary initialization.
 * @type {Dictionary}
 */
let dict = new Dictionary();
dict.addNoun(new Noun('кто-то', 'кого-то', 'кому-то', 'кого-то', 'кем-то', 'о ком-то', VerbCase.MALE));
dict.addNoun(new Noun('Иван', 'Ивана', 'Ивану', 'Ивана', 'Иваном', 'об Иване', VerbCase.MALE));
dict.addNoun(new Noun('Арсения', 'Арсении', 'Арсении', 'Арсению', 'Арсенией', 'об Арсении', VerbCase.FEMALE));
dict.addNoun(new Noun('Александр', 'Александра', 'Александру', 'Александра', 'Александром', 'об Александре', VerbCase.MALE));
dict.addNoun(new Noun('Яна', 'Яны', 'Яне', 'Яну', 'Яной', 'о Яне', VerbCase.FEMALE));
dict.addVerb(new Verb('заплатить', 'заплатил', 'заплатила', 'заплатило'));
dict.addVerb(new Verb('добавить', 'добавил', 'добавила', 'добавило'));
