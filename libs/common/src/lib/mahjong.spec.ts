import { handFromNotation } from './notation';
import { checkForMahjong, calculateWaits } from './mahjong';
import { Wind, TileName } from './types/tile';
import { getTileName } from './utils/tile';

describe('Mahjong detector', () => {

     it('should detect 7 pairs', () => {
         expect(checkForMahjong(handFromNotation('112244557788p11z'), Wind.East, Wind.East).length).toBe(1);
     });

     it('should calculate pair wait with open hand', () => {
         const hand = handFromNotation(`2p 123'p 123'm 123's 111z `);
         expect(calculateWaits(hand).map(getTileName)).toEqual([TileName.Pin2]);
     });

     it('should calculate 8 tile waits', () => {
         const hand = handFromNotation('222p 3456p 777p 111z');
         expect(calculateWaits(hand).map(getTileName)).toEqual(handFromNotation('12345678p').concealedTiles.map(getTileName));
     });

     it('should calculate waits for 9 gates', () => {
         const hand = handFromNotation('1112345678999p');
         expect(calculateWaits(hand).map(getTileName)).toEqual(handFromNotation('123456789p').concealedTiles.map(getTileName));
     });

     it('should calculate 13 tile wait (13 orphans)', () => {
         const hand = handFromNotation('19m 19s 19p 1234567z');
         expect(calculateWaits(hand).map(getTileName)).toEqual(hand.concealedTiles.map(getTileName));
     });

});
