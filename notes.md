TODO:

Document - How the game is saved within the server, this does not exist outside of server core

Model
  The model that is sent to the client
  this is specific to each player, although does not include anything about "self"
  as models are serialised, they cannot contain undefined as a value

State - the view that has been massaged into a state easily used by the client






how to invoke functions from the new nested templates?
    passing in the game state and connection seems to help

move blockers are currently in the server, lets move them to a lib

normal client shouldn't need to import server-core! (unless hosting locally)


separate the internal and external interfaces out
external should not inherit from the internal representation, the server api is all external ones

the helpers can then work on the external state?

but helpers may need to work on the backend too?
   this shouldn't be an issue? anything should be able to be determined by the calling player


change player view of game to not be wind driven, but relative seat driven
    (self, left, right, opposite)




need for a ledger?

player has drawn/discard a tile - can be inferred
  but ONLY if successful,
  what if he draws a tile when not his go? if it goes to his hand then we can still infere it
  may attempt to draw the wrong tile

player makes a call?
  player calls pon/ron/chi
  calling is not instant, need to give players a chance to reach (overriding calls)
  player makes the call, THEN takes the tile, this is the time for another player to react, so need to share the CALL

=======================


the interface is what the client uses to interfaces to the server
it should already know the player, and each player has it's own instance

========================



google cloud

functions are http req/res only, can be used to perform action, ensure logic, and write to a store
client can subscribe to store, getting pushed on updates

store has a public view, and then different private view per player (auth)

assumes everything can be sent to client by monitoring the current game state
  difficult to portray actions (user called something)
  could have an array of actions that we append to


state (with array) is an observable <-- keep this as the only contract, it can split up either side if needed



wall
deadwall - contains visible tiles)
NESW discards - (one can be turned for riichi, store differently)

player hand
open melds




should we build the wall, or just have it pre split?


any reason to have the wall and deadwall split in the state??
- no wall is fixed, the break is dynamic and the api draws a tile from it's position


{

    state: {
        currentPlayer: Wind
        prevalentWind
    },
    wall: Tile[],
    players: {
        e: {
            name: string,
            avatar: string,
            points: number,
            hand: number[],
            discards: Tile[],
            melds: Tile[],
            riichiTile: Tile | undefined;
        }
    },
    moves: Move[]
}

moves:
  splitWall
  draw from wall
  discard tile
  call chi
  call pon
  call ron

