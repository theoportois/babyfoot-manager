import { Router } from "express";
import { addGame, getGames, deleteGame, endGame } from "./game.js";

const router = Router();

router.get("/", async (req, res) => {
    console.log("GET /game");
    const result = await getGames();

    res.send(result);
});

router.post("/", (req, res) => {
    console.log("POST /game query:", req.query);
    const name = req.query.name;
    addGame(name);

    res.send();
});

router.put("/", (req, res) => {
    console.log("PUT /game query:", req.query);
    const id = req.query.id;
    endGame(id);

    res.send();
});

router.delete("/", (req, res) => {
    console.log("DELETE /game query:", req.query);
    const gameId = req.query.id;
    deleteGame(gameId);

    res.send();
});

export { router };