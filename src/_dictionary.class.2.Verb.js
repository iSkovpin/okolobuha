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
