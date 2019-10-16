import * as utils from './tile-utils';
import { TileDef, TileSuit } from '@riichi/common';

describe('Tile utils', () => {
    // beforeEach(() => cy.visit('/'));

    it('should translate tiles to unicode', () => {
        expect(utils.tileToUnicode(TileDef.Blank)).toMatch('🀫');

        expect(utils.tileToUnicode(TileDef.Ton)).toMatch('🀀');
        expect(utils.tileToUnicode(TileDef.Nan)).toMatch('🀁');
        expect(utils.tileToUnicode(TileDef.Shaa)).toMatch('🀂');
        expect(utils.tileToUnicode(TileDef.Pei)).toMatch('🀃');
        expect(utils.tileToUnicode(TileDef.Chun)).toMatch('🀄');
        expect(utils.tileToUnicode(TileDef.Hatsu)).toMatch('🀅');
        expect(utils.tileToUnicode(TileDef.Haku)).toMatch('🀆');
        expect(utils.tileToUnicode(TileDef.Man1)).toMatch('🀇');
        expect(utils.tileToUnicode(TileDef.Man2)).toMatch('🀈');
        expect(utils.tileToUnicode(TileDef.Man3)).toMatch('🀉');
        expect(utils.tileToUnicode(TileDef.Man4)).toMatch('🀊');
        expect(utils.tileToUnicode(TileDef.Man5)).toMatch('🀋');
        expect(utils.tileToUnicode(TileDef.Man6)).toMatch('🀌');
        expect(utils.tileToUnicode(TileDef.Man7)).toMatch('🀍');
        expect(utils.tileToUnicode(TileDef.Man8)).toMatch('🀎');
        expect(utils.tileToUnicode(TileDef.Man9)).toMatch('🀏');
        expect(utils.tileToUnicode(TileDef.Sou1)).toMatch('🀐');
        expect(utils.tileToUnicode(TileDef.Sou2)).toMatch('🀑');
        expect(utils.tileToUnicode(TileDef.Sou3)).toMatch('🀒');
        expect(utils.tileToUnicode(TileDef.Sou4)).toMatch('🀓');
        expect(utils.tileToUnicode(TileDef.Sou5)).toMatch('🀔');
        expect(utils.tileToUnicode(TileDef.Sou6)).toMatch('🀕');
        expect(utils.tileToUnicode(TileDef.Sou7)).toMatch('🀖');
        expect(utils.tileToUnicode(TileDef.Sou8)).toMatch('🀗');
        expect(utils.tileToUnicode(TileDef.Sou9)).toMatch('🀘');
        expect(utils.tileToUnicode(TileDef.Pin1)).toMatch('🀙');
        expect(utils.tileToUnicode(TileDef.Pin2)).toMatch('🀚');
        expect(utils.tileToUnicode(TileDef.Pin3)).toMatch('🀛');
        expect(utils.tileToUnicode(TileDef.Pin4)).toMatch('🀜');
        expect(utils.tileToUnicode(TileDef.Pin5)).toMatch('🀝');
        expect(utils.tileToUnicode(TileDef.Pin6)).toMatch('🀞');
        expect(utils.tileToUnicode(TileDef.Pin7)).toMatch('🀟');
        expect(utils.tileToUnicode(TileDef.Pin8)).toMatch('🀠');
        expect(utils.tileToUnicode(TileDef.Pin9)).toMatch('🀡');
    });

    it('should translate hands to unicode', () => {
        expect(utils.handToUnicode([TileDef.Chun, TileDef.Hatsu, TileDef.Man1, TileDef.Pin2])).toMatch('🀄 🀅 🀇 🀚');
    });

    it('should make/deconstruct tiles correctly', () => {
        for (const suit of [TileSuit.None, TileSuit.Man, TileSuit.Sou, TileSuit.Pin, TileSuit.Wind, TileSuit.Dragon]) {
            for (let value = 1; value <= utils.valuesInSuit(suit); value++) {
                const tile = utils.makeTileDef(suit, value);
                expect(utils.getSuitFromTile(tile)).toBe(suit);
                expect(utils.getValueFromTile(tile)).toBe(value);
            }
        }
    });

    it('should create new decks', () => {
        const deck = utils.createNewDeck();
        expect(deck.length).toBe(136);

        for (const tile of Object.keys(TileDef).map(k => TileDef[k]).filter(t => t && typeof t === 'number')) {
            const numberOfTheseTiles = deck.filter(t => t === tile);
            expect(numberOfTheseTiles.length).toBe(4);
        }
    });
});
