"use strict";
const auth = require('../app/controllers/auth.controller');
const otherControllers = require('../app/controllers/other.controller');
const authMiddleware = require('../app/middleware/auth');
module.exports = (app) => {
    app.get('/', auth.getUsers);
    app.post('/signin', auth.singIn);
    app.post('/signup', auth.signUp);
    app.get('/info', authMiddleware, otherControllers.info);
    app.get('/latency', authMiddleware, otherControllers.latency);
    app.get('/logout', authMiddleware, auth.logout);
};
