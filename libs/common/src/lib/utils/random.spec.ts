import { randomNumberGenerator } from './random';

describe('Random', () => {
    it('should generate known numbers from a seed', () => {
        let rng = randomNumberGenerator(12345);
        expect(rng.next().value).toEqual(-927619120);
        expect(rng.next().value).toEqual(1022647870);
        expect(rng.next().value).toEqual(-330853001);

        rng = randomNumberGenerator(9999);
        expect(rng.next().value).toEqual(-969847120);
        expect(rng.next().value).toEqual(611959226);
        expect(rng.next().value).toEqual(127564732);
    });
});
