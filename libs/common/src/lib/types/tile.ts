export const enum TileKind {
    Unknown = '-',
    Man     = 'm',
    Pin     = 'p',
    Sou     = 's',
    Honor   = 'z'
}

export const enum Wind {
    None  = '-',
    East  = '1',
    South = '2',
    West  = '3',
    North = '4'
}

export const enum Dragon {
    None  = '-',
    Haku  = '5',
    Hatsu = '6',
    Chun  = '7',
}

export type Honor = Wind | Dragon;

export type TileRank = '-' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type TileIndex = number;

// export interface Tile {
//     readonly kind: TileKind;
//     readonly rank: number;
// }

export type Tile = 
    '--' |
    'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6' | 'm7' | 'm8' | 'm9' |
    'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9' |
    's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9' |
    'z1' | 'z2' | 'z3' | 'z4' |
    'z5' | 'z6' | 'z7';

export const enum TileName {
    Blank = '--',

    Man1 = 'm1',
    Man2 = 'm2',
    Man3 = 'm3',
    Man4 = 'm4',
    Man5 = 'm5',
    Man6 = 'm6',
    Man7 = 'm7',
    Man8 = 'm8',
    Man9 = 'm9',

    Pin1 = 'p1',
    Pin2 = 'p2',
    Pin3 = 'p3',
    Pin4 = 'p4',
    Pin5 = 'p5',
    Pin6 = 'p6',
    Pin7 = 'p7',
    Pin8 = 'p8',
    Pin9 = 'p9',

    Sou1 = 's1',
    Sou2 = 's2',
    Sou3 = 's3',
    Sou4 = 's4',
    Sou5 = 's5',
    Sou6 = 's6',
    Sou7 = 's7',
    Sou8 = 's8',
    Sou9 = 's9',

    East  = 'z1',
    South = 'z2',
    West  = 'z3',
    North = 'z4',

    Chun  = 'z5',
    Hatsu = 'z6',
    Haku  = 'z7',
}

export const TileNames: Record<TileKind, TileName[]> = {
    [TileKind.Unknown]: [TileName.Blank],

    [TileKind.Man]: [TileName.Blank, TileName.Man1, TileName.Man2, TileName.Man3, TileName.Man4, TileName.Man5, TileName.Man6, TileName.Man7, TileName.Man8, TileName.Man9],
    [TileKind.Pin]: [TileName.Blank, TileName.Pin1, TileName.Pin2, TileName.Pin3, TileName.Pin4, TileName.Pin5, TileName.Pin6, TileName.Pin7, TileName.Pin8, TileName.Pin9],
    [TileKind.Sou]: [TileName.Blank, TileName.Sou1, TileName.Sou2, TileName.Sou3, TileName.Sou4, TileName.Sou5, TileName.Sou6, TileName.Sou7, TileName.Sou8, TileName.Sou9],

    [TileKind.Honor]: [
        TileName.Blank,
        TileName.East, TileName.South, TileName.West, TileName.North,
        TileName.Chun, TileName.Hatsu, TileName.Haku
    ]
}
