import { handFromNotation } from './notation';
import { checkForMahjong, calculateWaits } from './mahjong';
import { Wind } from './types/tile';

describe('Mahjong detector', () => {

     it('should detect 7 pairs', () => {
         expect(checkForMahjong(handFromNotation('112244557788p11z'), Wind.East, Wind.East).length).toBe(1);
     });

     it('should calculate pair wait with open hand', () => {
         const hand = handFromNotation(`2p 1'23p 1'23m 1'23s 111z `);
         expect(calculateWaits(hand)).toEqual(['p2']);
     });

     it('should calculate 8 tile waits', () => {
         const hand = handFromNotation('222p 3456p 777p 111z');
         expect(calculateWaits(hand)).toEqual(handFromNotation('12345678p').concealedTiles);
     });

     it('should calculate waits for 9 gates', () => {
         const hand = handFromNotation('1112345678999p');
         expect(calculateWaits(hand)).toEqual(handFromNotation('123456789p').concealedTiles);
     });

     it('should calculate 13 tile wait (13 orphans)', () => {
         const hand = handFromNotation('19m 19p 19s 1234567z');
         expect(calculateWaits(hand)).toEqual(hand.concealedTiles);
     });

});
