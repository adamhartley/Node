// Swagger set up
exports.swaggerDoc = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Nodejs RESTful API",
            version: "1.0.0",
            description:
                "A RESTful API built using Nodejs and Express"
        },
        schemes: [
            "http",
            "https"
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        servers: [
            {
                url: "http://localhost:8081"
            }
        ]
    },
    apis: [
        "./models/user.js",
        "./models/post.js",
        "./routes/feed.js",
        "./routes/auth.js"
    ]

};