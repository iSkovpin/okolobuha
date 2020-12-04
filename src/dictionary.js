const VerbCase = {
    SIMPLE: 's',
    MALE: 'm',
    FEMALE: 'f',
    MIDDLE: 'md'
};

const NounCase = {
    IM: 'i',
    ROD: 'r',
    DAT: 'd',
    VIN: 'v',
    TV: 't',
    PRED: 'p'
}

class Dictionary {
    constructor() {
        this.nouns = {};
        this.verbs = {};
    }

    /**
     * @param noun {Noun}
     */
    addNoun(noun) {
        this.nouns[noun[NounCase.IM]] = noun;
    }

    /**
     * @param verb {Verb}
     */
    addVerb(verb) {
        this.verbs[verb[VerbCase.SIMPLE]] = verb;
    }

    /**
     * @param noun {string}
     * @param nounCase {string}
     * @return {string}
     */
    getNoun(noun, nounCase) {
        if (nounCase === undefined) {
            nounCase = NounCase.IM;
        }

        if (this.nouns[noun] === undefined) {
            Logger.log('Noun ' + noun + ' not found in the dictionary');
            return noun;
        }

        return this.nouns[noun][nounCase];
    }

    /**
     * @param verb {string}
     * @param verbCase {string}
     * @return {string}
     */
    getVerb(verb, verbCase) {
        if (verbCase === undefined) {
            verbCase = VerbCase.SIMPLE;
        }

        if (this.verbs[verb] === undefined) {
            Logger.log('Verb ' + verb + ' not found in the dictionary');
            return verb;
        }

        return this.verbs[verb][verbCase];
    }

    /**
     * @param noun {string}
     * @return {string}
     */
    getNounGender(noun) {
        if (this.nouns[noun] === undefined) {
            Logger.log('Noun ' + noun + ' not found in the dictionary');
            return VerbCase.MALE;
        }

        return this.nouns[noun].gender;
    }
}

class Noun {
    /**
     * @param i {string}
     * @param r {string}
     * @param d {string}
     * @param v {string}
     * @param t {string}
     * @param p {string}
     * @param gender {string}
     */
    constructor(i, r, d, v, t, p, gender) {
        this[NounCase.IM] = i;
        this[NounCase.ROD] = r;
        this[NounCase.DAT] = d;
        this[NounCase.VIN] = v;
        this[NounCase.TV] = t;
        this[NounCase.PRED] = p;
        this.gender = gender
    }
}

class Verb {
    /**
     * @param s {string}
     * @param m {string}
     * @param f {string}
     * @param md {string}
     */
    constructor(s, m, f, md) {
        this[VerbCase.SIMPLE] = s;
        this[VerbCase.MALE] = m;
        this[VerbCase.FEMALE] = f;
        this[VerbCase.MIDDLE] = md;
    }
}


