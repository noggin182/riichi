import { FuDefinition } from '../types/points';
import { isSimple, isHonor, isTerminal, isDragon } from '../utils/tile-checks';
import { FinalMeldKind } from '../types/hand';

export const defaultFuDefinitions: FuDefinition[] = [
    {
        fu: 20,
        name: ['Winning hand', 'Fūtei'],
        check: hand => !hand.isSevenPairs
    },
    {
        fu: 10,
        name: ['Concealed on a discard', 'Menzen-kafu'],
        check: hand => !hand.isSevenPairs && !hand.selfDrawn && !hand.isOpen
    },
    {
        fu: 25,
        name: ['Seven Pairs', 'Chii Toitsu'],
        check: hand => hand.isSevenPairs,
        blocksRounding: true
    },
    // ============ Simple melds =============
    {
        fu: 2,
        name: ['Open pon of simples', 'Min-kōtsu'],
        check: hand => hand.pons.filter(p => isSimple(p) && p.meld.kind === FinalMeldKind.OpenPon)
    },
    {
        fu: 4,
        name: ['Closed pon of simples', 'An-kōtsu'],
        check: hand => hand.pons.filter(p => isSimple(p) && p.meld.kind === FinalMeldKind.ClosedSet)
    },
    {
        fu: 8,
        name: ['Open kan of simples', 'Min-katsu'],
        check: hand => hand.pons.filter(p => isSimple(p) && (p.meld.kind === FinalMeldKind.OpenKan || p.meld.kind === FinalMeldKind.OpenAddedKan))
    },
    {
        fu: 16,
        name: ['Closed kan of simples', 'An-katsu'],
        check: hand => hand.pons.filter(p => isSimple(p) && p.meld.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Honor melds =============
    {
        fu: 4,
        name: ['Open pon of honors', 'Min-kōtsu'],
        check: hand => hand.pons.filter(p => isHonor(p) && p.meld.kind === FinalMeldKind.OpenPon)
    },
    {
        fu: 8,
        name: ['Closed pon of honors', 'An-kōtsu'],
        check: hand => hand.pons.filter(p => isHonor(p) && p.meld.kind === FinalMeldKind.ClosedSet)
    },
    {
        fu: 16,
        name: ['Open kan of honors', 'Min-katsu'],
        check: hand => hand.pons.filter(p => isHonor(p) && (p.meld.kind === FinalMeldKind.OpenKan || p.meld.kind === FinalMeldKind.OpenAddedKan))
    },
    {
        fu: 32,
        name: ['Closed kan of honors', 'An-katsu'],
        check: hand => hand.pons.filter(p => isHonor(p) && p.meld.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Terminal melds =============
    {
        fu: 4,
        name: ['Open pon of terminals', 'Min-kōtsu'],
        check: hand => hand.pons.filter(p => isTerminal(p) && p.meld.kind === FinalMeldKind.OpenPon)
    },
    {
        fu: 8,
        name: ['Closed pon of terminals', 'An-kōtsu'],
        check: hand => hand.pons.filter(p => isTerminal(p) && p.meld.kind === FinalMeldKind.ClosedSet)
    },
    {
        fu: 16,
        name: ['Open kan of terminals', 'Min-katsu'],
        check: hand => hand.pons.filter(p => isTerminal(p) && (p.meld.kind === FinalMeldKind.OpenKan || p.meld.kind === FinalMeldKind.OpenAddedKan))
    },
    {
        fu: 32,
        name: ['Closed kan of terminals', 'An-katsu'],
        check: hand => hand.pons.filter(p => isTerminal(p) && p.meld.kind === FinalMeldKind.ClosedKan)
    },

    // ============ Pair melds =============
    {
        fu: 2,
        name: ['Pair of seated winds', 'Toitsu'],
        check: hand => !hand.isSevenPairs && hand.isSeatWind(hand.pair) && [hand.pair]
    },
    {
        fu: 2,
        name: ['Pair of prevailing winds', 'Toitsu'],
        check: hand => !hand.isSevenPairs && hand.isPrevalentWind(hand.pair) && [hand.pair]
    },
    {
        fu: 2,
        name: ['Pair of dragons', 'Toitsu'],
        check: hand => !hand.isSevenPairs && isDragon(hand.pair) && [hand.pair]
    },

    // ============ Waits =============
    {
        fu: 2,
        name: ['Pair wait', 'Tanki-machi'],
        check: hand => !hand.isSevenPairs && hand.pair.meld.tiles.includes(hand.finalTile) && [hand.pair]
    },
    {
        fu: 2,
        name: ['Middle wait', 'Kanchan-machi'],
        check: hand => hand.chis.filter(c => c[1] === hand.finalTile)
    },
    {
        fu: 2,
        name: ['Edge wait', 'Penchan-machi'],
        check: hand => !hand.isPinfu && hand.chis.filter(c => c[0] === hand.finalTile || c[2] === hand.finalTile)
    },

    // ============ Hand Style =============
    {
        fu: 2,
        name: ['Self draw', 'Tsumo'],
        check: hand => hand.selfDrawn && !hand.isPinfu && !hand.isSevenPairs
    },
    {
        fu: 2,
        name: ['Open pinfu', 'Open pinfu'],
        check: hand => hand.isOpen && hand.chis.length === 4 && hand.valuelessPair
    }
];

