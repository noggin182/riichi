import * as utils  from "./tile-utils";
import { Tile, TileSuit } from '@riichi/definitions';

describe('Tile utils', () => {
    // beforeEach(() => cy.visit('/'));

    it('should translate tiles to unicode', () => {
        expect(utils.tileToUnicode(Tile.Blank)).toMatch('🀫');

        expect(utils.tileToUnicode(Tile.Ton)).toMatch('🀀');
        expect(utils.tileToUnicode(Tile.Nan)).toMatch('🀁');
        expect(utils.tileToUnicode(Tile.Shaa)).toMatch('🀂');
        expect(utils.tileToUnicode(Tile.Pei)).toMatch('🀃');
        expect(utils.tileToUnicode(Tile.Chun)).toMatch('🀄');
        expect(utils.tileToUnicode(Tile.Hatsu)).toMatch('🀅');
        expect(utils.tileToUnicode(Tile.Haku)).toMatch('🀆');
        expect(utils.tileToUnicode(Tile.Man1)).toMatch('🀇');
        expect(utils.tileToUnicode(Tile.Man2)).toMatch('🀈');
        expect(utils.tileToUnicode(Tile.Man3)).toMatch('🀉');
        expect(utils.tileToUnicode(Tile.Man4)).toMatch('🀊');
        expect(utils.tileToUnicode(Tile.Man5)).toMatch('🀋');
        expect(utils.tileToUnicode(Tile.Man6)).toMatch('🀌');
        expect(utils.tileToUnicode(Tile.Man7)).toMatch('🀍');
        expect(utils.tileToUnicode(Tile.Man8)).toMatch('🀎');
        expect(utils.tileToUnicode(Tile.Man9)).toMatch('🀏');
        expect(utils.tileToUnicode(Tile.Sou1)).toMatch('🀐');
        expect(utils.tileToUnicode(Tile.Sou2)).toMatch('🀑');
        expect(utils.tileToUnicode(Tile.Sou3)).toMatch('🀒');
        expect(utils.tileToUnicode(Tile.Sou4)).toMatch('🀓');
        expect(utils.tileToUnicode(Tile.Sou5)).toMatch('🀔');
        expect(utils.tileToUnicode(Tile.Sou6)).toMatch('🀕');
        expect(utils.tileToUnicode(Tile.Sou7)).toMatch('🀖');
        expect(utils.tileToUnicode(Tile.Sou8)).toMatch('🀗');
        expect(utils.tileToUnicode(Tile.Sou9)).toMatch('🀘');
        expect(utils.tileToUnicode(Tile.Pin1)).toMatch('🀙');
        expect(utils.tileToUnicode(Tile.Pin2)).toMatch('🀚');
        expect(utils.tileToUnicode(Tile.Pin3)).toMatch('🀛');
        expect(utils.tileToUnicode(Tile.Pin4)).toMatch('🀜');
        expect(utils.tileToUnicode(Tile.Pin5)).toMatch('🀝');
        expect(utils.tileToUnicode(Tile.Pin6)).toMatch('🀞');
        expect(utils.tileToUnicode(Tile.Pin7)).toMatch('🀟');
        expect(utils.tileToUnicode(Tile.Pin8)).toMatch('🀠');
        expect(utils.tileToUnicode(Tile.Pin9)).toMatch('🀡');
    });

    it('should translate hands to unicode', () => {
        expect(utils.handToUnicode([Tile.Chun, Tile.Hatsu, Tile.Man1, Tile.Pin2])).toMatch('🀄 🀅 🀇 🀚');
    });

    it('should make/deconstruct tiles correctly', () => {
        for (const suit of [TileSuit.None, TileSuit.Man, TileSuit.Sou, TileSuit.Pin, TileSuit.Wind, TileSuit.Dragon]) {
            for (let value = 0; value < utils.valuesInSuit(suit); value++) {
                const tile = utils.makeTile(suit, value);
                expect(utils.getSuitFromTile(tile)).toBe(suit);
                expect(utils.getValueFromTile(tile)).toBe(value);
            }
        }
    });

    it('should create new decks', () => {
        const deck = utils.createNewDeck();
        expect(deck.length).toBe(136);
        console.log(utils.handToUnicode(deck));

        for (const tile of Object.keys(Tile).map(k => Tile[k]).filter(t => t && typeof t === 'number')) {
            const numberOfTheseTiles = deck.filter(t => t === tile);
            expect(numberOfTheseTiles.length).toBe(4) 
        }
    });
});
