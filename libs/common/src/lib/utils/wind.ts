import { Wind } from '../types/tile';

export const enum RelativeSeat {
    Right = 1,
    Opposite = 2,
    Left = 3,
    Self = 0
}

export function relativeSeatToWind(playerWind: Wind, relative: RelativeSeat): Wind {
    return `${(((+playerWind - 1) + (+relative)) % 4) + 1}` as Wind;
}
