const mask = 0xffffffff;

// tslint:disable: no-bitwise
export class Random {
    constructor (seed?: number) {
        this.m_w = seed === undefined ? new Date().getTime() : seed;
        this.m_z = 987654321;
    }

    private m_w = 123456789;
    private m_z = 987654321;

    next()
    {
        
        this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & mask;
        this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & mask;
        return ((this.m_z << 16) + this.m_w) & mask;
    }

    /** Returns a new array with the items shuffled */
    shuffle<T>(items: T[]) {
        return items.map(v => ({v, r: this.next()})).sort((a,b) => (a.r - b.r)).map(i => i.v);
    }
}