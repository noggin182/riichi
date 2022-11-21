import { FuDefinition } from '../types/points';
import { isSimple, isHonor, isTerminal, isDragon } from '../utils/tile-checks';
import { FinalMeldKind } from '../types/hand';
import { tileRank } from '../utils/tile';

export const defaultFuDefinitions: FuDefinition[] = [
    {
        fu: 20,
        name: ['Winning hand', 'Fūtei', 'Fūtei'],
        check: hand => !hand.isSevenPairs
    },
    {
        fu: 10,
        name: ['Concealed on a discard', 'Menzen-kafu', 'Menzen-kafu'],
        check: hand => !hand.isSevenPairs && !hand.selfDrawn && !hand.isOpen
    },
    {
        fu: 25,
        name: ['Seven Pairs', 'Chii Toitsu', 'Chii Toitsu'],
        check: hand => hand.isSevenPairs,
        blocksRounding: true
    },
    // ============ Simple melds =============
    {
        fu: 2,
        name: ['Open pon of simples', 'Min-kōtsu', 'Min-kōtsu'],
        check: hand => hand.pons.filter(p => isSimple(p[0]) && p.meld.kind === FinalMeldKind.OpenPon)
    },
    {
        fu: 4,
        name: ['Closed pon of simples', 'An-kōtsu', 'An-kōtsu'],
        check: hand => hand.pons.filter(p => isSimple(p[0]) && p.meld.kind === FinalMeldKind.ClosedSet)
    },
    {
        fu: 8,
        name: ['Open kan of simples', 'Min-katsu', 'Min-katsu'],
        check: hand => hand.pons.filter(p => isSimple(p[0]) && (p.meld.kind === FinalMeldKind.OpenKan || p.meld.kind === FinalMeldKind.OpenAddedKan))
    },
    {
        fu: 16,
        name: ['Closed kan of simples', 'An-katsu', 'An-katsu'],
        check: hand => hand.pons.filter(p => isSimple(p[0]) && p.meld.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Honor melds =============
    {
        fu: 4,
        name: ['Open pon of honors', 'Min-kōtsu', 'Min-kōtsu'],
        check: hand => hand.pons.filter(p => isHonor(p[0]) && p.meld.kind === FinalMeldKind.OpenPon)
    },
    {
        fu: 8,
        name: ['Closed pon of honors', 'An-kōtsu', 'An-kōtsu'],
        check: hand => hand.pons.filter(p => isHonor(p[0]) && p.meld.kind === FinalMeldKind.ClosedSet)
    },
    {
        fu: 16,
        name: ['Open kan of honors', 'Min-katsu', 'Min-katsu'],
        check: hand => hand.pons.filter(p => isHonor(p[0]) && (p.meld.kind === FinalMeldKind.OpenKan || p.meld.kind === FinalMeldKind.OpenAddedKan))
    },
    {
        fu: 32,
        name: ['Closed kan of honors', 'An-katsu', 'An-katsu'],
        check: hand => hand.pons.filter(p => isHonor(p[0]) && p.meld.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Terminal melds =============
    {
        fu: 4,
        name: ['Open pon of terminals', 'Min-kōtsu', 'Min-kōtsu'],
        check: hand => hand.pons.filter(p => isTerminal(p[0]) && p.meld.kind === FinalMeldKind.OpenPon)
    },
    {
        fu: 8,
        name: ['Closed pon of terminals', 'An-kōtsu', 'An-kōtsu'],
        check: hand => hand.pons.filter(p => isTerminal(p[0]) && p.meld.kind === FinalMeldKind.ClosedSet)
    },
    {
        fu: 16,
        name: ['Open kan of terminals', 'Min-katsu', 'Min-katsu'],
        check: hand => hand.pons.filter(p => isTerminal(p[0]) && (p.meld.kind === FinalMeldKind.OpenKan || p.meld.kind === FinalMeldKind.OpenAddedKan))
    },
    {
        fu: 32,
        name: ['Closed kan of terminals', 'An-katsu', 'An-katsu'],
        check: hand => hand.pons.filter(p => isTerminal(p[0]) && p.meld.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Pair melds =============
    {
        fu: 2,
        name: ['Pair of seated winds', 'Toitsu', 'Toitsu'],
        check: hand => !!hand.pair && hand.isSeatWind(hand.pair[0]) && [hand.pair]
    },
    {
        fu: 2,
        name: ['Pair of prevailing winds', 'Toitsu', 'Toitsu'],
        check: hand => !!hand.pair && hand.isPrevalentWind(hand.pair[0]) && [hand.pair]
    },
    {
        fu: 2,
        name: ['Pair of dragons', 'Toitsu', 'Toitsu'],
        check: hand => !!hand.pair && isDragon(hand.pair[0]) && [hand.pair]
    },

    // ============ Waits =============
    {
        fu: 2,
        name: ['Pair wait', 'Tanki-machi', 'Tanki-machi'],
        check: hand => !!hand.pair && hand.pair.meld.tiles.includes(hand.finalTile) && [hand.pair]
    },
    {
        fu: 2,
        name: ['Middle wait', 'Kanchan-machi', 'Kanchan-machi'],
        check: hand => hand.chis.filter(c => c[1] === hand.finalTile)
    },
    {
        fu: 2,
        name: ['Edge wait', 'Penchan-machi', 'Penchan-machi'],
        check: hand => !hand.isPinfu && hand.chis.filter(c => (c[0] === hand.finalTile && tileRank(c[0]) === '7') || (c[2] === hand.finalTile && tileRank(c[2]) === '3'))
    },

    // ============ Hand Style =============
    {
        fu: 2,
        name: ['Self draw', 'Tsumo', 'Tsumo'],
        check: hand => hand.selfDrawn && !hand.isPinfu && !hand.isSevenPairs
    },
    {
        fu: 2,
        name: ['Open pinfu', 'Open pinfu', 'Open pinfu'],
        check: hand => hand.isOpen && hand.chis.length === 4 && hand.valuelessPair
    }
];

