import { execQuery } from "./pg.js";
import { broadcast } from "./ws.js";

export async function addGame(name) {
    const query = `INSERT INTO public.game(name)
                   VALUES ('${name}') RETURNING *`;

    const result = await execQuery(query);
    const row = result.rows[0];

    broadcast("newGame", row);
}

export async function deleteGame(gameId) {
    const query = `DELETE FROM public.game WHERE id = ${gameId}`;

    const result = await execQuery(query);
    
    if (result.rowCount === 1) {
        broadcast("removeGame", gameId);
    }
}

export async function endGame(gameId) {
    const query = `UPDATE public.game 
                   SET ended = true 
                   WHERE id = ${gameId}`;

    const result = await execQuery(query);

    if (result.rowCount === 1) {
        broadcast("gameEnded", gameId);
    }
               
}

export async function getGames() {
    const query = `SELECT * FROM public.game ORDER BY id DESC`;
    const result = await execQuery(query);

    return result.rows;
}