export const enum TileKind {
    Unknown,
    Man,
    Sou,
    Pin,
    Honor
}

export const enum Wind {
    None  = 0,
    East  = 1,
    South = 2,
    West  = 3,
    North = 4
}

export const enum Dragon {
    None  = 0,
    Haku  = 5,
    Hatsu = 6,
    Chun  = 7,
}

export type Honor = Wind | Dragon;

export interface Tile {
    readonly id: number;
    readonly kind: TileKind;
    readonly rank: number;
}

export const enum TileName {
    Blank = 0,

    Man1 = TileKind.Man * 10 + 1,
    Man2 = TileKind.Man * 10 + 2,
    Man3 = TileKind.Man * 10 + 3,
    Man4 = TileKind.Man * 10 + 4,
    Man5 = TileKind.Man * 10 + 5,
    Man6 = TileKind.Man * 10 + 6,
    Man7 = TileKind.Man * 10 + 7,
    Man8 = TileKind.Man * 10 + 8,
    Man9 = TileKind.Man * 10 + 9,
    Sou1 = TileKind.Sou * 10 + 1,
    Sou2 = TileKind.Sou * 10 + 2,
    Sou3 = TileKind.Sou * 10 + 3,
    Sou4 = TileKind.Sou * 10 + 4,
    Sou5 = TileKind.Sou * 10 + 5,
    Sou6 = TileKind.Sou * 10 + 6,
    Sou7 = TileKind.Sou * 10 + 7,
    Sou8 = TileKind.Sou * 10 + 8,
    Sou9 = TileKind.Sou * 10 + 9,
    Pin1 = TileKind.Pin * 10 + 1,
    Pin2 = TileKind.Pin * 10 + 2,
    Pin3 = TileKind.Pin * 10 + 3,
    Pin4 = TileKind.Pin * 10 + 4,
    Pin5 = TileKind.Pin * 10 + 5,
    Pin6 = TileKind.Pin * 10 + 6,
    Pin7 = TileKind.Pin * 10 + 7,
    Pin8 = TileKind.Pin * 10 + 8,
    Pin9 = TileKind.Pin * 10 + 9,

    East  = TileKind.Honor * 10 + 1,
    South = TileKind.Honor * 10 + 2,
    West  = TileKind.Honor * 10 + 3,
    North = TileKind.Honor * 10 + 4,

    Chun  = TileKind.Honor * 10 + 5,
    Hatsu = TileKind.Honor * 10 + 6,
    Haku  = TileKind.Honor * 10 + 7
}
