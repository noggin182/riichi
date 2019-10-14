export enum Wind {
    East,
    South,
    West,
    North
}

export enum TileSuit {
    None   = 0x00,
    Man    = 0x10,
    Sou    = 0x20,
    Pin    = 0x30,
    Wind   = 0x40,
    Dragon = 0x50
}

export const TILEMASK_HONOR = 0x40;

/**
 * Tile values can be treated as an 8 bit value and broken down into parts.
 * */
export enum Tile {
    Blank = 0,

    Man1 = TileSuit.Man,
    Man2,
    Man3,
    Man4,
    Man5,
    Man6,
    Man7,
    Man8,
    Man9,

    Sou1 = TileSuit.Sou,
    Sou2,
    Sou3,
    Sou4,
    Sou5,
    Sou6,
    Sou7,
    Sou8,
    Sou9,

    Pin1 = TileSuit.Pin,
    Pin2,
    Pin3,
    Pin4,
    Pin5,
    Pin6,
    Pin7,
    Pin8,
    Pin9,

    /* E */ Ton  = TileSuit.Wind + Wind.East,
    /* S */ Nan  = TileSuit.Wind + Wind.South,
    /* W */ Shaa = TileSuit.Wind + Wind.West,
    /* N */ Pei  = TileSuit.Wind + Wind.North,

    /* Red   */ Chun = TileSuit.Dragon,
    /* Green */ Hatsu,
    /* White */ Haku
}

export const allTiles = [
    Tile.Man1, Tile.Man2, Tile.Man3, Tile.Man4, Tile.Man5, Tile.Man6, Tile.Man7, Tile.Man8, Tile.Man9,
    Tile.Sou1, Tile.Sou2, Tile.Sou3, Tile.Sou4, Tile.Sou5, Tile.Sou6, Tile.Sou7, Tile.Sou8, Tile.Sou9,
    Tile.Pin1, Tile.Pin2, Tile.Pin3, Tile.Pin4, Tile.Pin5, Tile.Pin6, Tile.Pin7, Tile.Pin8, Tile.Pin9,

    Tile.Ton, Tile.Nan, Tile.Shaa, Tile.Pei,    
    Tile.Chun, Tile.Hatsu, Tile.Haku
];
