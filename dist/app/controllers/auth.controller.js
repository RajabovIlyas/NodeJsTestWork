"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const database_1 = require("../database/database");
const jsonwebtoken_1 = require("jsonwebtoken");
const { secret } = require('../../config/app').jwt;
const authHelper = require('../helpers/authHelper');
const singIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, password } = req.body;
    database_1.pool.query('SELECT * FROM users where email=$1', [id])
        .then(response => {
        if (response.rows.length === 1) {
            if (bcryptjs_1.compareSync(password, response.rows[0].password)) {
                const token = authHelper.updateTokens(response.rows[0].id)
                    .then((resource) => {
                    res.setHeader('Authorization', 'Bearer ' + resource);
                    res.json({ message: 'Авторизация прошла успешно' }).status(200);
                }).catch((e) => res.status(500).json({ message: 'Ошибка сервера!' }));
            }
            else {
                res.status(401).json({ message: 'Не верно введены данные!' });
            }
        }
        else {
            res.status(401).json({ message: 'Не верно введены данные!' });
        }
    })
        .catch(e => {
        res.status(404).json({ message: 'Не верно введены данные!' });
    });
});
const signUp = (req, res) => {
    const { id, password } = req.body;
    database_1.pool.query('SELECT * FROM users where email=$1', [id])
        .then(response => {
        response.rows.length === 0 ?
            database_1.pool.query('INSERT INTO users (id,email, password) VALUES (uuid_generate_v1(), $1,$2)', [id, bcryptjs_1.hashSync(password)])
                .then(response => singIn(req, res))
                .catch(e => res.status(400).json({ message: 'Не верно введены данные!!!' })) :
            res.status(400).json({ message: 'Такой пользователь уже существует' });
    })
        .catch(e => res.status(400).json({ message: 'Не верно введены данные!' }));
};
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtPayload = req.headers.authorization;
    jsonwebtoken_1.verify(jwtPayload.split(' ')[1], secret, (err, payload) => {
        if (req.query.all === 'true' || req.query.all === 'false') {
            authHelper.removeToken(Object.assign(Object.assign({}, payload), { all: req.query.all })) ?
                res.status(200).json({ message: 'Данные успешно удалены!' }) :
                res.status(400).json({ message: 'Не верно введены данные!' });
        }
        else {
            res.status(400).json({ message: 'Не верно введены данные!' });
        }
    });
});
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
