import { Wind, Tile } from './tile';

export interface WinState {
    readonly firstRound: boolean;
    readonly selfDrawnAfterKan: boolean;
    readonly robbedFromKan: boolean;
    readonly lastTile: boolean;

    readonly riichi: boolean;
    readonly doubleRiichi: boolean;
    readonly oneShot: boolean;
    readonly prevalentWind: Wind;
    readonly seatWind: Wind;
    readonly winningTileFromWind: Wind;

    readonly doraIndicator: readonly Tile[];
    readonly uraDoraIndicator: readonly Tile[];
}
