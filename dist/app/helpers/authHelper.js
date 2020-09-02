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
const database_1 = require("../database/database");
const uuid_1 = require("uuid");
const jwt = require('jsonwebtoken');
const { secret, tokens } = require('../../config/app').jwt;
const generateAccessToken = (userId, tokenId) => {
    const payload = {
        userId,
        tokenId,
        type: tokens.access.type,
    };
    const options = { expiresIn: tokens.access.expiresIn };
    return jwt.sign(payload, secret, options);
};
const updateTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const idToken = uuid_1.v4();
    const accessToken = generateAccessToken(userId, idToken);
    if (yield addTokenInDB(idToken, userId)) {
        return accessToken;
    }
    else {
        throw 'Ошибка в добалении данных';
    }
});
const addTokenInDB = (tokenId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('INSERT INTO token (userid, tokenid) VALUES ($1,$2)', [userId, tokenId]);
        return true;
    }
    catch (e) {
        return false;
    }
});
const removeToken = (payload) => {
    if (payload.all === 'true') {
        return database_1.pool.query('DELETE FROM token WHERE userid=$1', [payload.userId])
            .then(response => {
            return true;
        })
            .catch(e => {
            return false;
        });
    }
    else if (payload.all === 'false') {
        return database_1.pool.query('DELETE FROM token WHERE id = (SELECT id FROM token WHERE userid=$1 ORDER BY id DESC LIMIT 1)', [payload.userId])
            .then(response => {
            return true;
        })
            .catch(e => {
            return false;
        });
    }
};
const findToken = (payload) => {
    return database_1.pool.query('SELECT * FROM token WHERE userid=$1 AND tokenid=$2', [payload.userId, payload.tokenId])
        .then(response => {
        return response.rows.length === 1 ? true : false;
    })
        .catch(e => {
        return false;
    });
};
module.exports = {
    updateTokens,
    removeToken,
    findToken
};
