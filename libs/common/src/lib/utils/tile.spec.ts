import { Dragon, TileKind, Wind } from "../types/tile";
import { distinct } from "./array";
import { createDummySetOfTiles, tileKind, tileToUnicode } from "./tile";

describe('Tile utils', () => {
     it('should create a set of tiles', () => {
        const tiles = createDummySetOfTiles();
        expect(tiles.length).toBe(9 + 9 + 9 + 4 + 3);
        expect(tiles.filter(distinct).length).toBe(tiles.length);
        expect(tiles.filter(t => tileKind(t) === TileKind.Man).length).toBe(9);
        expect(tiles.filter(t => tileKind(t) === TileKind.Pin).length).toBe(9);
        expect(tiles.filter(t => tileKind(t) === TileKind.Sou).length).toBe(9);
        expect(tiles.filter(t => tileKind(t) === TileKind.Honor).length).toBe(4 + 3);
     });

    it('should translate tiles to unicode', () => {
        //expect(tileToUnicode(null)).toMatch('🀫');
        //expect(tileToUnicode('--')).toMatch('🀫');
        expect(tileToUnicode(null)).toMatch('🎴');
        expect(tileToUnicode('--')).toMatch('🎴');

        expect(tileToUnicode(`${TileKind.Honor}${Wind.East}`)).toMatch('🀀');
        expect(tileToUnicode(`${TileKind.Honor}${Wind.South}`)).toMatch('🀁');
        expect(tileToUnicode(`${TileKind.Honor}${Wind.West}`)).toMatch('🀂');
        expect(tileToUnicode(`${TileKind.Honor}${Wind.North}`)).toMatch('🀃');
        expect(tileToUnicode(`${TileKind.Honor}${Dragon.Chun}`)).toMatch('🀄');
        expect(tileToUnicode(`${TileKind.Honor}${Dragon.Hatsu}`)).toMatch('🀅');
        expect(tileToUnicode(`${TileKind.Honor}${Dragon.Haku}`)).toMatch('🀆');
        expect(tileToUnicode(`${TileKind.Man}1`)).toMatch('🀇');
        expect(tileToUnicode(`${TileKind.Man}2`)).toMatch('🀈');
        expect(tileToUnicode(`${TileKind.Man}3`)).toMatch('🀉');
        expect(tileToUnicode(`${TileKind.Man}4`)).toMatch('🀊');
        expect(tileToUnicode(`${TileKind.Man}5`)).toMatch('🀋');
        expect(tileToUnicode(`${TileKind.Man}6`)).toMatch('🀌');
        expect(tileToUnicode(`${TileKind.Man}7`)).toMatch('🀍');
        expect(tileToUnicode(`${TileKind.Man}8`)).toMatch('🀎');
        expect(tileToUnicode(`${TileKind.Man}9`)).toMatch('🀏');
        expect(tileToUnicode(`${TileKind.Sou}1`)).toMatch('🀐');
        expect(tileToUnicode(`${TileKind.Sou}2`)).toMatch('🀑');
        expect(tileToUnicode(`${TileKind.Sou}3`)).toMatch('🀒');
        expect(tileToUnicode(`${TileKind.Sou}4`)).toMatch('🀓');
        expect(tileToUnicode(`${TileKind.Sou}5`)).toMatch('🀔');
        expect(tileToUnicode(`${TileKind.Sou}6`)).toMatch('🀕');
        expect(tileToUnicode(`${TileKind.Sou}7`)).toMatch('🀖');
        expect(tileToUnicode(`${TileKind.Sou}8`)).toMatch('🀗');
        expect(tileToUnicode(`${TileKind.Sou}9`)).toMatch('🀘');
        expect(tileToUnicode(`${TileKind.Pin}1`)).toMatch('🀙');
        expect(tileToUnicode(`${TileKind.Pin}2`)).toMatch('🀚');
        expect(tileToUnicode(`${TileKind.Pin}3`)).toMatch('🀛');
        expect(tileToUnicode(`${TileKind.Pin}4`)).toMatch('🀜');
        expect(tileToUnicode(`${TileKind.Pin}5`)).toMatch('🀝');
        expect(tileToUnicode(`${TileKind.Pin}6`)).toMatch('🀞');
        expect(tileToUnicode(`${TileKind.Pin}7`)).toMatch('🀟');
        expect(tileToUnicode(`${TileKind.Pin}8`)).toMatch('🀠');
        expect(tileToUnicode(`${TileKind.Pin}9`)).toMatch('🀡');
    });

//     it('should translate hands to unicode', () => {
//         expect(utils.handToUnicode([TileDef.Chun, TileDef.Hatsu, TileDef.Man1, TileDef.Pin2])).toMatch('🀄 🀅 🀇 🀚');
//     });

//     it('should make/deconstruct tiles correctly', () => {
//         for (const suit of [TileSuit.None, TileSuit.Man, TileSuit.Sou, TileSuit.Pin, TileSuit.Wind, TileSuit.Dragon]) {
//             for (let value = 1; value <= utils.valuesInSuit(suit); value++) {
//                 const tile = utils.makeTileDef(suit, value);
//                 expect(utils.getSuitFromTile(tile)).toBe(suit);
//                 expect(utils.getValueFromTile(tile)).toBe(value);
//             }
//         }
//     });

//     it('should create new decks', () => {
//         const deck = utils.createNewDeck();
//         expect(deck.length).toBe(136);

//         for (const tile of Object.keys(TileDef).map(k => TileDef[k]).filter(t => t && typeof t === 'number')) {
//             const numberOfTheseTiles = deck.filter(t => t === tile);
//             expect(numberOfTheseTiles.length).toBe(4);
//         }
//     });
});
