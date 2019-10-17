// import * as utils from './tile-utils';
// import { checkForMahjong, calculateWaits } from './mahjong';
// import { OpenMeld, Wind } from '@riichi/common';

 describe('Mahjong detector', () => {
    it('should have at least one test', () => {

    });
//     // beforeEach(() => cy.visit('/'));

//     it('should detect 7 pairs', () => {
//         expect(checkForMahjong(utils.handFromNotation('M1 M1 M2 M2 M3 M3 M4 M4 M5 M5 M6 M6 M7 M7'), []).length).toBeGreaterThan(0);
//     });

//     it('should calculate pair wait with open hand', () => {
//         const hand = utils.handFromNotation('P2');
//         const melds: OpenMeld[] = [
//             {from: Wind.East, tiles: utils.handFromNotation('P1 P2 P3')},
//             {from: Wind.East, tiles: utils.handFromNotation('M1 M2 M3')},
//             {from: Wind.East, tiles: utils.handFromNotation('S1 S2 S3')},
//             {from: Wind.East, tiles: utils.handFromNotation('S S S')},
//         ];
//         expect(calculateWaits(hand, melds)).toEqual(utils.handFromNotation('P2'));
//     });

//     it('should calculate 8 tile waits', () => {
//         const hand = utils.handFromNotation('P2 P2 P2 P3 P4 P5 P6 P7 P7 P7 E E E');
//         expect(calculateWaits(hand, [])).toEqual(utils.handFromNotation('P1 P2 P3 P4 P5 P6 P7 P8'));
//     });

//     it('should calculate waits for 9 gates', () => {
//         const hand = utils.handFromNotation('P1 P1 P1 P2 P3 P4 P5 P6 P7 P8 P9 P9 P9');
//         expect(calculateWaits(hand, [])).toEqual(utils.handFromNotation('P1 P2 P3 P4 P5 P6 P7 P8 P9'));
//     });

//     it('should calculate 13 tile wait (13 orphans)', () => {
//         const hand = utils.handFromNotation('M1 S1 P1 M9 S9 P9 N E S W C H B');
//         expect(calculateWaits(hand, [])).toEqual(hand.slice().sort());
//     });

});
