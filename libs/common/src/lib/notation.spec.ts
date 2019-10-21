import { handFromNotation } from './notation';

describe('Notation', () => {
    describe('should parse', () => {
        it('a simple hand', () => {
            const hand = handFromNotation('123456789m');
            expect(hand.concealedTiles.length).toBe(9);
            expect(hand.melds.length).toBe(0);
        });

        it ('verbose tiles in closed form', () => {
            const hand = handFromNotation('1m 2m 3m 4m 5m 6m 7m 8m 9m');
            expect(hand.concealedTiles.length).toBe(9);
            expect(hand.melds.length).toBe(0);
        });
    });
});
