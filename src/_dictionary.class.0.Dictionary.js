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
