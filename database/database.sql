CREATE DATABASE registration_data;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
    id UUID PRIMARY KEY,
    email character(30) NOT NULL,
    password character(60) NOT NULL
);


CREATE TABLE token(
    id SERIAL PRIMARY KEY,
    userId UUID REFERENCES users (id),
    tokenId UUID NOT NULL
);





INSERT INTO users(mail,password) VALUES ('ilyas@gmail.com','12345'),
('sergey@gmail.com','54321');

