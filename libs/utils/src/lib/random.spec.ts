import { Random } from "./random";
import { Tile } from '@riichi/definitions';

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

    it('should shuffle tiles predictably', () => {
        const r = new Random(4644851398);
        expect(r.shuffle([Tile.Man1, Tile.Ton, Tile.Pin2, Tile.Pin2, Tile.Blank, Tile.Blank, Tile.Chun, Tile.Sou6]))
                .toEqual([Tile.Blank, Tile.Pin2, Tile.Man1, Tile.Sou6, Tile.Blank, Tile.Ton, Tile.Pin2, Tile.Chun]);
    })
});