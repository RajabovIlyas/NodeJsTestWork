import {Request, Response} from 'express';
import jwt, {JsonWebTokenError, TokenExpiredError, verify} from 'jsonwebtoken';
import {pool} from '../database/database';

const {secret} = require('../../config/app').jwt;

const info = (req: Request, res: Response) => {
    const jwtPayload = <string>req.headers.authorization;
    verify(jwtPayload.split(' ')[1], secret, (err: any, payload: any) => {
        pool.query('SELECT * FROM users where id=$1', [payload.userId])
            .then(result => {
                res.status(200).send({userId: payload.userId, email: result.rows[0].email});
            })
            .catch(e=>res.status(404).send({message:'Пользователь не определен!'}))
    });
};

const latency = (req: Request, res: Response) => {
    setTimeout(() => res.redirect("https://google.com"), 3000)
};

module.exports = {
    info,
    latency,
};
