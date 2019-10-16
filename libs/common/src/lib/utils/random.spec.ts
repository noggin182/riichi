import { Random } from './random';

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

    // it('should shuffle tiles predictably', () => {
    //     const r = new Random(4644851398);
    //     expect(r.shuffle([TileDef.Man1, TileDef.Ton, TileDef.Pin2, TileDef.Pin2, TileDef.Blank, TileDef.Blank, TileDef.Chun, TileDef.Sou6]))
    //             .toEqual([TileDef.Blank, TileDef.Pin2, TileDef.Man1, TileDef.Sou6, TileDef.Blank, TileDef.Ton, TileDef.Pin2, TileDef.Chun]);
    // });
});
