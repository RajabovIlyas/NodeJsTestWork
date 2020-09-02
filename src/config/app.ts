module.exports = {
    appPort: 3000,
    database: {},
    jwt: {
        secret: '5e7a2eb53b92a881e87b3a1b',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '10m',
            },
        },
    },

};
