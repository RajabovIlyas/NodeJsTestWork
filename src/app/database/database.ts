import {Pool} from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'ilyas2310',
    database: 'registration_data',
    port: 5432
});

