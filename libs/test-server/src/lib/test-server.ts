import {
    InMemoryDocumentStore,
    createNewGameDocument,
    DocumentStore,
    createMoveProxy,
    moveValidators
} from "@riichi/server-core";
import { GameService, MoveFunctions, PlayerIndex } from '@riichi/game-core';


export class TestServer {
    constructor() {
        this.store = new InMemoryDocumentStore();
        this.gameId = this.store.create(createNewGameDocument([
            {
                name: 'Player 1',
                id: 'test-p1',
                avatarUrl: '1.png'
            }, {
                name: 'Player 2',
                id: 'test-p2',
                avatarUrl: '2.png'
            }, {
                name: 'Player 3',
                id: 'test-p3',
                avatarUrl: '3.png'
            }, {
                name: 'Player 4',
                id: 'test-p4',
                avatarUrl: '4.png'
            }
        ]));
    }

    useTrainingWheels = true;

    connect(playerIndex: PlayerIndex): GameService {
        const playerId = this.playerData[playerIndex].id;
        const gameDocument$ = this.store.get$(this.gameId, playerId);
        const moveProxy = createMoveProxy(this.gameId, playerId, this.store);

        const trainingProxy = new Proxy(moveProxy, {
            get: (target, prop, reciever) => {
                return (...args: unknown[]) => {
                    const valid = !this.useTrainingWheels || (moveValidators as unknown as Record<string | symbol, (...args: unknown[]) => ReturnType<typeof moveValidators['rollDice']>>)[prop]
                        (this.store.get(this.gameId, playerId), playerIndex, ...args);
                    if (valid !== true) {
                        console.warn(valid)
                    } else {
                        return Reflect.get(target, prop, reciever)(...args);
                    }
                }
            }
        })

        return new GameService(this.gameId, this.playerData[playerIndex].id, gameDocument$, trainingProxy);
    }


    readonly gameId: string;
    private readonly playerData = [
        {
            name: 'Player 1',
            id: 'test-p1',
            avatarUrl: '1.png'
        }, {
            name: 'Player 2',
            id: 'test-p2',
            avatarUrl: '2.png'
        }, {
            name: 'Player 3',
            id: 'test-p3',
            avatarUrl: '3.png'
        }, {
            name: 'Player 4',
            id: 'test-p4',
            avatarUrl: '4.png'
        }
    ] as const;

    private store: DocumentStore;
}