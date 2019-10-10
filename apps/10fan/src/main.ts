import { Meld, Wind, Tile } from '@riichi/definitions';
import { calculateWaits, tileToUnicode, handFromNotation } from '@riichi/utils'
console.log('Welcome to 10 Fan chombo!');
console.log("==============================");

const command = process.argv[2];
switch (command) {
    case "waits": {
        calcWaits();
        break;
    }
    default:
        console.log("Supported commands are: waits");
}

function calcWaits() {
    const hand: Tile[] = [];
    const melds: Meld[] = []
    let target: Tile[] = hand;
    for (const token of process.argv.slice(3)) {
        if (token === ":") {
            target = [];
            melds.push({from: Wind.East, tiles: target})
        } else {
            target.push(...handFromNotation(token));
        }
    }
    console.log('Your hand is: ', hand.map(tileToUnicode).join(' '));
    for (const meld of melds) {
        console.log('  Meld: ', meld.tiles.map(tileToUnicode).join(' '));
    }
    
    const waits = calculateWaits(hand, melds)
    if (waits.length === 0) {
        console.log("You are not tenpai");
    } else {
        console.log("You are waiting for: ", waits.map(tileToUnicode).join(' '));
    }
}