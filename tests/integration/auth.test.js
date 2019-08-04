const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
let server;
let api;

describe("API/AUTH *****************************************", () => {
    it('should have tests', () => {
        expect(1).toBe(1);
    });
});
