import {pool} from "../database/database";
import {v4 as uuid} from "uuid";


const jwt = require('jsonwebtoken');
const {secret, tokens} = require('../../config/app').jwt;

const generateAccessToken = (userId: string, tokenId: string) => {
    const payload = {
        userId,
        tokenId,
        type: tokens.access.type,
    };
    const options = {expiresIn: tokens.access.expiresIn};
    return jwt.sign(payload, secret, options);
};

const updateTokens = async (userId: string) => {
    const idToken = uuid();
    const accessToken = generateAccessToken(userId, idToken);
    if(await addTokenInDB(idToken, userId)){
        return accessToken;
    }else{
        throw 'Ошибка в добалении данных';
    }

};

const addTokenInDB = async (tokenId: string, userId: string) => {
    try {
        const response = await pool.query('INSERT INTO token (userid, tokenid) VALUES ($1,$2)', [userId, tokenId]);
        return true;
    } catch (e) {
        return false;
    }
};

const removeToken = (payload: any) => {
    if (payload.all === 'true') {
        return pool.query('DELETE FROM token WHERE userid=$1', [payload.userId])
            .then(response => {
                return true
            })
            .catch(e => {
                return false
            });
    } else if(payload.all === 'false'){
        return pool.query('DELETE FROM token WHERE id = (SELECT id FROM token WHERE userid=$1 ORDER BY id DESC LIMIT 1)', [payload.userId])
            .then(response => {
                return true;
            })
            .catch(e => {
                return false;
            });
    }
};

const findToken = (payload: any) => {
    return pool.query('SELECT * FROM token WHERE userid=$1 AND tokenid=$2', [payload.userId, payload.tokenId])
        .then(response => {
            return response.rows.length === 1 ? true : false
        })
        .catch(e => {
            return false
        });
};

module.exports = {
    updateTokens,
    removeToken,
    findToken
};
