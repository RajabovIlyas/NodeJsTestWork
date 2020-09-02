"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const database_1 = require("../database/database");
const { secret } = require('../../config/app').jwt;
const info = (req, res) => {
    const jwtPayload = req.headers.authorization;
    jsonwebtoken_1.verify(jwtPayload.split(' ')[1], secret, (err, payload) => {
        database_1.pool.query('SELECT * FROM users where id=$1', [payload.userId])
            .then(result => {
            res.status(200).send({ userId: payload.userId, email: result.rows[0].email });
        })
            .catch(e => res.status(404).send({ message: 'Пользователь не определен!' }));
    });
};
const latency = (req, res) => {
    setTimeout(() => res.redirect("https://google.com"), 3000);
};
module.exports = {
    info,
    latency,
};
