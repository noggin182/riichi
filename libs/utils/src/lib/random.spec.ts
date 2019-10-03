import { Random } from "./random";

describe('Random', () => {
    it('should generate known numbers from a seed', () => {
        let r = new Random(12345);
        expect(r.next()).toEqual(-927619120);
        expect(r.next()).toEqual(1022647870);
        expect(r.next()).toEqual(-330853001);
        
        r = new Random(9999);     
        expect(r.next()).toEqual(-969847120);
        expect(r.next()).toEqual(611959226);
        expect(r.next()).toEqual(127564732);
    });
});