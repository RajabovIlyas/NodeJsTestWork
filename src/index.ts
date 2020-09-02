import express from 'express';
const config = require('./config');

const app = express();
config.express(app);
config.routes(app);

const {appPort} = config.app;


app.listen(appPort, () => {
    console.log(`Server started: http://localhost:${appPort}`);
});




