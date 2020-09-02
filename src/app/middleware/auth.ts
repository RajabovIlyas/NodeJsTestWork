import {NextFunction, Request, Response} from 'express';
import jwt, {TokenExpiredError, verify} from 'jsonwebtoken';
const {secret} = require('../../config/app').jwt;
const authHelper=require('../helpers/authHelper');


module.exports = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = <string>req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({message: 'Токен не представлен!'});
    }
    const token = authHeader.replace('Bearer ', '');
    let jwtPayload;
    try {
        jwtPayload = <any>verify(token, secret);
        res.locals.jwtPayload = jwtPayload;
        if (jwtPayload.type !== 'access') {
            res.status(401).json({message: 'Токен не действителен!'});
            return;
        }
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            res.status(401).json({message: 'Токен истек!'});
            return;
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({message: 'Токен не действителен!'});
            return;
        }
    }
    if(! await authHelper.findToken(jwtPayload)){
        return res.status(401).json({message: 'Токен не действителен!'});
    }

    res.setHeader("Authorization", 'Bearer ' + authHelper.updateTokens(jwtPayload.userId));

    next();
};

