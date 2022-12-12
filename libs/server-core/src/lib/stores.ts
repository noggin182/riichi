import { GameDocument } from "@riichi/game-core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { InternalGameDocument } from "./documents";
import { createPlayerGameDocument } from "./server-core";

export type GameId = string;

export interface DocumentStore {
    create(gameDocument: InternalGameDocument): GameId;
    get$(gameId: string, playerId: string): Observable<GameDocument>;
    update(gameId: GameId, updater: (internalGameDocument: InternalGameDocument) => InternalGameDocument): Promise<void>;

    // this is temp and will need removing
    get(gameId: string, playerId: string): GameDocument;
}

export class InMemoryDocumentStore implements DocumentStore {
    private document$Store: Record<GameId, BehaviorSubject<InternalGameDocument> | undefined> = {};

    private document$(gameId: GameId) {
        const doc$ = this.document$Store[gameId];
        if (!doc$) { throw new Error(`No game with the id '${gameId}'`); }
        return doc$;
    }

    create(internalGameDocument: InternalGameDocument): GameId {
        const id = `test-game-${Math.random().toString(36).padEnd(13, '0').slice(2)}`;
        this.document$Store[id] = new BehaviorSubject(internalGameDocument);
        return id;
    }

    get$(gameId: string, playerId: string): Observable<GameDocument> {
        return this.document$(gameId).pipe(
            map(doc => createPlayerGameDocument(doc, playerId))
        );
    }

    get(gameId: string, playerId: string): GameDocument {
        return createPlayerGameDocument(this.document$(gameId).value, playerId);
    }

    update(gameId: GameId, updater: (internalGameDocument: InternalGameDocument) => InternalGameDocument): Promise<void> {
        const doc$ = this.document$(gameId);
        let value = doc$.value;
        // do a deep clone of the document to ensure we behave the same as real stores;
        value = JSON.parse(JSON.stringify(value));
        doc$.next(updater(value));
        return Promise.resolve();
    }
}
