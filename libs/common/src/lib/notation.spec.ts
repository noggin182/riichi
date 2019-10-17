import * as utils from './tile-utils';
import { checkForMahjong, calculateWaits } from './mahjong';
import { OpenMeld, Wind } from '@riichi/common';
import { handFromNotation } from './notation';

describe('Notation', () => {
    // beforeEach(() => cy.visit('/'));
    describe('should parse', () => {
        it('a simple hand', () => {
            const hand = handFromNotation('123456789m');
            expect(hand.concealedTiles.length).toBe(9);
            expect(hand.melds.length).toBe(0);
        });

        it ('verbose tiles in closed form', () => {
            // const hand
        });

    });




});
