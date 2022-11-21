import { Tile, TileKind, Wind } from './types/tile';
import { createNewDeck } from './utils/tile';
import { sequentialNumberGenerator } from './utils/random';
import { Hand, MeldKind as MeldKind } from './types/hand';
import { validHandExpression } from './notation.expression';
import { relativeSeatToWind, RelativeSeat } from './utils/wind';

/*

123456789m 12'3p 44'p 3333s 3333s

kans!
    3333' -> from right
    3'333 -> from left
    33'33 -> from opposite
    333'3 -> from opposite

    333'3' -> pon from right extended
    3'3'33 -> pon from left extended
    33'3'3 -> pon from opposite extended

    3'333' -> concealed?

    3xx3 -> concealed?

*/

export class HandNotationError {
    constructor(readonly message: string) {
    }

    toString() {
        return `[HandNotationError] ${this.message}`;
    }
}

export function handFromNotation(str: string, forWind: Wind = Wind.East, deck?: Tile[]): Hand {
    const tempDeck = deck ? deck.slice() : createNewDeck(sequentialNumberGenerator());
    str = str.toLowerCase()
             .replace(/\s/g, '')   // remove all whitespace
             .replace(/['"]/g, '`'); // convert all chi markers to backtick

    const hand: Hand = {
        concealedTiles: [],
        melds: []
    };

    const matches = validHandExpression.test(str) && str.match(/[1-9`x]+[mspz]/g);

    if (!matches) {
        throw new HandNotationError('Invalid hand notation');
    }

    for (const s of matches) {
        const kind = kindFromLetter(s.charAt(s.length - 1));

        if (s.charAt(1) === 'x') {
            const rank = parseInt(s.charAt(0), 10);
            // special handling for closed kan
            hand.melds.push({
                kind: MeldKind.ConcealedKan,
                claimedTile: null,
                from: forWind,
                tiles: [
                    takeTile(tempDeck, kind, rank),
                    takeTile(tempDeck, kind, rank),
                    takeTile(tempDeck, kind, rank),
                    takeTile(tempDeck, kind, rank)
                ]
            });
            continue;
        }

        const values = s.match(/[1-9x]`?/g)!.map(t => ({
            rank: parseInt(t === 'x' ? s.charAt(0) : t, 10),
            claimed: t.length > 1
        }));

        const tiles = values.map(v => takeTile(tempDeck, kind, v.rank));
        const claimed = values.findIndex(v => v.claimed);
        if (values.every(v => !v.claimed)) {
            hand.concealedTiles.push(...tiles);
        } else if (values.length === 4) {
            // this is some kind of kan
            const addedKan = values.filter(v => v.claimed).length === 2;
            hand.melds.push({
                kind: addedKan ? MeldKind.AddedKan : MeldKind.Kan,
                claimedTile: tiles[claimed],
                from: relativeSeatToWind(forWind, claimed === 0 ? RelativeSeat.Left : claimed === 3 ? RelativeSeat.Right : RelativeSeat.Opposite),
                tiles: tiles
            });
        } else {
            // this should be a pon or a chi
            if (values.length !== 3) {
                throw new HandNotationError(`Unexpected number of tiles in an open meld`);
            }
            const from = relativeSeatToWind(forWind, claimed === 0 ? RelativeSeat.Left : claimed === 1 ? RelativeSeat.Opposite : RelativeSeat.Right);

            if (values.every(v => v.rank === values[0].rank)) {
                // easy pon
                hand.melds.push({
                    kind: MeldKind.Pon,
                    claimedTile: tiles[claimed],
                    from: from,
                    tiles: tiles
                });
            } else {
                const ranks = values.map(v => v.rank).sort();
                if (!ranks.every((r, i) => r === ranks[0] + i)) {
                    throw new HandNotationError(`Invalid values for a chi: ${ranks.join(',')}`);
                }
                hand.melds.push({
                    kind: MeldKind.Chi,
                    claimedTile: tiles[claimed],
                    from: from,
                    tiles: tiles
                });
            }
        }
    }

    if (deck) {
        deck.splice(0, deck.length, ...tempDeck);
    }

    return hand;
}

function kindFromLetter(letter: string) {
    switch (letter) {
        case 'm': return TileKind.Man;
        case 's': return TileKind.Sou;
        case 'p': return TileKind.Pin;
        case 'z': return TileKind.Honor;
    }
    throw new HandNotationError(`Invalid tile kind '${letter}'`);
}

function takeTile(deck: Tile[], kind: TileKind, rank: number) {
    const index = deck.indexOf(`${kind}${rank}` as Tile);
    if (index === -1) {
        throw new HandNotationError(`Deck does not contain all required tiles. Cannot find ${kind}${rank}`);
    }
    return deck.splice(index, 1)[0];
}
