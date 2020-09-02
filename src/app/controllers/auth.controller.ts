import {Request, Response} from 'express';
import {compareSync, hashSync} from 'bcryptjs';
import {v4 as uuid} from 'uuid';
import {pool} from '../database/database';
import {verify} from "jsonwebtoken";

const {secret} = require('../../config/app').jwt;
const authHelper = require('../helpers/authHelper');

const singIn = async (req: Request, res: Response) => {
    const {id, password} = req.body;
    pool.query('SELECT * FROM users where email=$1', [id])
        .then(response => {
            if (response.rows.length === 1) {
                if (compareSync(password, response.rows[0].password)) {
                    const token = authHelper.updateTokens(response.rows[0].id)
                        .then((resource: any) => {
                            res.setHeader('Authorization', 'Bearer ' + resource);
                            res.json({message: 'Авторизация прошла успешно'}).status(200)
                        }).catch((e: any) => res.status(500).json({message: 'Ошибка сервера!'}))
                } else {
                    res.status(401).json({message: 'Не верно введены данные!'})
                }
            } else {
                res.status(401).json({message: 'Не верно введены данные!'})
            }
        })
        .catch(e => {
            res.status(404).json({message: 'Не верно введены данные!'})
        })
};

const signUp = (req: Request, res: Response) => {
    const {id, password} = req.body;
    pool.query('SELECT * FROM users where email=$1', [id])
        .then(response => {
            response.rows.length === 0 ?
                pool.query('INSERT INTO users (id,email, password) VALUES (uuid_generate_v1(), $1,$2)', [id, hashSync(password)])
                    .then(response => singIn(req, res))
                    .catch(e => res.status(400).json({message: 'Не верно введены данные!!!'})) :
                res.status(400).json({message: 'Такой пользователь уже существует'})
        })
        .catch(e => res.status(400).json({message: 'Не верно введены данные!'}));

};

const logout = async (req: Request, res: Response) => {
    const jwtPayload = <string>req.headers.authorization;
    verify(jwtPayload.split(' ')[1], secret, (err: any, payload: any) => {
        if (req.query.all === 'true' || req.query.all === 'false') {
            authHelper.removeToken({...payload, all: req.query.all}) ?
                res.status(200).json({message: 'Данные успешно удалены!'}) :
                res.status(400).json({message: 'Не верно введены данные!'});
        } else {
            res.status(400).json({message: 'Не верно введены данные!'});
        }
    });

};

module.exports = {
    singIn,
    signUp,
    logout,
};
