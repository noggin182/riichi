# Mahjong hand/tile notation

The hand notation here is inspired from http://arcturus.su/wiki/Help:MahjongTile

Tiles are expressed as a number followed their tile descriptor:
* `m` for Man
* `s` for Sou
* `p` for Pin
* `z` for Honor

For the suited tiles, the number is the rank of the tile (1-9). For honor tiles the following numbers are used:
1) East
2) South
3) West
4) North
5) Haku (white dragon)
6) Hatsu (green dragon)
7) Chun (red dragon)

Tiles of the same kind can be combined by listing their ranks followed by their descriptor:
* `12345p` = 1 2 3 4 and 5 of Pin
* `1122z` = a pair of East and a pair of South tiles

For concealed tiles, white space is completely ignored and can be ommitted. The following hands are all valid and identical:
* `123p444m`
* `123p 444m`
* `1p 2p 3p 4m 4m 4m`

## Open melds
It is possible to create open melds using a single quote after the tile that has been claimed
* `1'23p` Chi of 1, 2, 3 of Pin that has been claimed from the player to the left
* `44'4s` Pon of 4 of Sou that has been claimed from the player opposite
* `666'z` Pon of green dragons 4 of Sou that has been claimed from the player to the right

> The single quote chatacter is prefered, however double quotes and backticks are also supported to help avoid the need for escaping characters in code.

> It is invalid to have a chi from any other player than the left. `12'3p` is considered invalid notation.

> Tiles within a meld can appear in any valid order. `2'13p` is a an open chi of 123 Pin where we claimed the 2 of Pin

### Kans
Kans use the same notation as other melds with a few extra rules.
The single quote follows the tile that has been claimed. For open pons that have been extended to kans, both tiles should be marked as claimed.

Concealed kans use `x` to denote the middle tiles.

* `4xx4s` Concealed kan of 4 of Sou
* `1'111z` Kan of east claimed from the player to our left
* `33'33m` or `333'3m` Kan of 3 of Man claimed from the player opposite
* `1111'p` Kan of 1 of Pin claimed from the player to our right
* `99'9'9s` A pon of 9 of Sou claimed from the player opposite that has been extended to a kan
* `7'7'77s` A pon of 7 of Sou claimed from the player opposite to our left that has beenextended to a kan
