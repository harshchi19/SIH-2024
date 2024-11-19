import express from "express";
import { pool } from "./database/postgres.db.js";
import connectToDatabase from "./database/mongo.db.js";
import { createTables } from "./controllers/tables.controller.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.post("/user", async (req, res) => {
    try {
        const { name, age } = req.body;
        res.status(200).json({ message: "Success", user: { name, age } });
    } catch (error) {
        return res.status(400).json({ message: "Not received" });
    }
});

app.get("/get-all", async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM students');
        res.status(200).json({ students: data.rows });
    } catch (error) {
        console.log("Get all: ", error);
        res.status(400).json({ message: "Error in get all" });
    }
})

app.post("/insert", async (req, res) => {
    const { name, age } = req.body;

    try {
        await pool.query('INSERT INTO students (name, age) VALUES ($1, $2)', [name, age]);
        res.status(200).json({ message: "Data sent successfully" })
    } catch (error) {
        console.log("Insert: ", error);
        return res.status(400).json({ message: "Failed" })
    }
})

app.get("/setup", async (req, res) => {
    try {
        await pool.query('CREATE TABLE students (id SERIAL PRIMARY KEY, name VARCHAR(100), age INT)');
        res.status(200).json({ message: "Table Created successfully" })
    } catch (error) {
        console.log("Setup: ", error);
        return res.status(400).json({ message: "Failed" });
    }
});

app.get("/create-db", async (req, res) => {
    try {
        await pool.query('CREATE DATABASE sih24');
        res.status(200).json({ message: "DB Created successfully" });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Failed" })
    }
})

const PORT = process.env.PORT || 4224;

app.listen(PORT, () => {
    console.log(`Server listening to PORT ${PORT}`);
});

connectToDatabase();
createTables();