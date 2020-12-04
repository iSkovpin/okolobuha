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
