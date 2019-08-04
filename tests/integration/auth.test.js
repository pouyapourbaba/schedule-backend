const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
let server;
let api;
let userId1;

describe("API/AUTH *****************************************", () => {

    beforeEach(async () => {
        server = require("../../index");
        api = request(server);

        // register two users and use token created from them to store tasks and login
        const user1 = {
            first_name: "user1",
            last_name: "user1",
            email: "user1@gmail.com",
            password: "password"
        };

        const response1 = await api.post("/api/users").send(user1);
        token1 = response1.body.token;

        const decodedUser1 = await jwt.decode(token1, config.get("jwtPrivateKey"));

        userId1 = decodedUser1.id;
    });

    // Close the server and cleanup the DB
    afterEach(async () => {
        await User.remove({});
        await server.close();
    });

    afterAll(async () => {
        mongoose.connection.close();
    });

    describe("POST /", () => {
        it("should return 400 with the proper error if the password in not provided", async () => {
            const reqBody = {
                email: "user1@gmail.com"
            };
            const response = await api.post("/api/auth").send(reqBody);
            expect(response.status).toBe(400);
            expect(response.body.errors[0].param).toBe("password");
        });

        it("should return 400 with the proper error if the email in not provided", async () => {
            const reqBody = {
                password: "12345"
            };
            const response = await api.post("/api/auth").send(reqBody);
            expect(response.status).toBe(400);
            expect(response.body.errors[0].param).toBe("email");
        });

        it('should return 400 with the proper error if the user does not exist in the DB', async () => {
            const reqBody = {
                email: "user10000@gmail.com",
                password: "password"
            };
            const response = await api.post("/api/auth").send(reqBody);
            expect(response.status).toBe(400);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });
        
        it('should return 400 with the proper error if the password is incorrect', async () => {
            const reqBody = {
                email: "user1@gmail.com",
                password: "incorrect"
            };
            const response = await api.post("/api/auth").send(reqBody);
            expect(response.status).toBe(400);
            expect(response.body.errors.length).toBeGreaterThan(0);
        });
        
        it('should return 200 with the correct jwt token if the user is logged in', async () => {
            const reqBody = {
                email: "user1@gmail.com",
                password: "password"
            };
            const response = await api.post("/api/auth").send(reqBody);
            const decodedUser = await jwt.decode(response.body.token, config.get("jwtPrivateKey"));

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(decodedUser.id).toBe(userId1)
        });
    });
});
