"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database/database");
const singIn = (req, res) => {
    const { id, password } = req.body;
    database_1.pool.query('SELECT * FROM users where mail=$1 and password=$2', [id, password])
        .then(response => {
        response.rows.length === 1 ?
            res.status(200).json(response.rows) :
            res.status(400).json({ message: 'Не верно введены данные!' });
    })
        .catch(e => res.status(400).json({ message: 'Не верно введены данные!' }));
};
const signUp = (req, res) => {
    const { id, password } = req.body;
    database_1.pool.query('SELECT * FROM users where mail=$1', [id])
        .then(response => {
        response.rows.length === 0 ?
            database_1.pool.query('INSERT INTO users (mail, password) VALUES ($1, $2)', [id, password])
                .then(response => res.status(201).json({ message: 'Данные сохранены успешно!' }))
                .catch(e => res.status(400).json({ message: 'Не верно введены данные!' })) :
            res.status(400).json({ message: 'Такой пользователь уже существует' });
    })
        .catch(e => res.status(400).json({ message: 'Не верно введены данные!' }));
};
const logout = (req, res) => {
    res.status(200).json({});
};
const getUsers = (req, res) => {
    database_1.pool.query('SELECT * FROM users')
        .then(response => {
        res.status(200).json(response.rows);
    })
        .catch(e => {
        res.status(500).json('Internal Server error');
    });
};
module.exports = {
    singIn,
    signUp,
    getUsers,
    logout,
};
