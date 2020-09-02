import bodyParser from 'body-parser';


module.exports=(app: any)=>{
    app.use(require('morgan')('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(require('cors')());
};
