const request = require("supertest");
const { Task } = require("../../models/Task");
const { User } = require("../../models/User");
const mongoose = require("mongoose");
let server;
let api;
let userId1;
let userId2;
let token;
let tasks;
let task;

describe("/api/users", () => {
  // run the server
  beforeEach(() => {
    server = require("../../index");
    api = request(server);
    userId1 = mongoose.Types.ObjectId();
    userId2 = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    tasks = [
      {
        title: "task1",
        userId: userId1,
        year: 1,
        month: 1,
        week: 1,
        days: [
          { day: "monday", duration: 1 },
          { day: "tuesday", duration: 1 },
          { day: "wednesday", duration: 1 },
          { day: "thursday", duration: 1 },
          { day: "friday", duration: 1 },
          { day: "saturday", duration: 1 },
          { day: "sunday", duration: 1 }
        ]
      },
      {
        title: "task1",
        userId: userId1,
        year: 1,
        month: 1,
        week: 2,
        days: [
          { day: "monday", duration: 1 },
          { day: "tuesday", duration: 1 },
          { day: "wednesday", duration: 1 },
          { day: "thursday", duration: 1 },
          { day: "friday", duration: 1 },
          { day: "saturday", duration: 1 },
          { day: "sunday", duration: 1 }
        ]
      },
      {
        title: "task2",
        userId: userId2,
        year: 2,
        month: 2,
        week: 2,
        days: [
          { day: "monday", duration: 2 },
          { day: "tuesday", duration: 2 },
          { day: "wednesday", duration: 2 },
          { day: "thursday", duration: 2 },
          { day: "friday", duration: 2 },
          { day: "saturday", duration: 2 },
          { day: "sunday", duration: 2 }
        ]
      }
    ];
    task = {
      title: "task1",
      year: 2019,
      month: 7,
      week: 1,
      days: [
        { day: "monday", duration: 0 },
        { day: "tuesday", duration: 0 },
        { day: "wednesday", duration: 0 },
        { day: "thursday", duration: 0 },
        { day: "friday", duration: 0 },
        { day: "saturday", duration: 0 },
        { day: "sunday", duration: 0 }
      ]
    };
  });

  // Close the server and cleanup the DB
  afterEach(async () => {
    await server.close();
    await Task.remove({});
  });

  describe("GET /", () => {
    it("should return 401 if the client is not logged in", async () => {
      const response = await api.get("/api/tasks");
      expect(response.status).toBe(401);
    });

    it("should return all tasks related to the user", async () => {
      // when saving tasks via task.save() it is not required to declare the duration
      // because it is by default it will be set to zero
      Task.collection.insert(tasks);
      const response = await api
        .get(`/api/tasks/${userId1.toString()}`)
        .set("x-auth-token", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe("task1");
      expect(response.body[0].userId.toString()).toEqual(userId1.toString());
    });

    it("should return 404 if no tasks are found for that user", async () => {
      const response = await api
        .get(`/api/tasks/${userId1.toString()}`)
        .set("x-auth-token", token);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return 401 when the user is not logged in", async () => {
      const response = await api.post("/api/tasks").send(task);

      expect(response.status).toBe(401);
    });

    it("should return 400 when the title of the task is not set", async () => {
      delete task.title;
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token)
        .send(task);
      expect(response.status).toBe(400);
    });

    it("should return 400 when the year of the task is not set", async () => {
      delete task.year;
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token)
        .send(task);
      expect(response.status).toBe(400);
    });

    it("should return 400 when the month of the task is not set", async () => {
      delete task.month;
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token)
        .send(task);
      expect(response.status).toBe(400);
    });

    it("should return 400 when the week of the task is not set", async () => {
      delete task.week;
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token)
        .send(task);
      expect(response.status).toBe(400);
    });

    it("should return 200 when the task is successfully saved in the DB", async () => {
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token)
        .send(task);

      const tasksInDbAtEnd = await Task.find();

      expect(response.status).toBe(200);
      expect(tasksInDbAtEnd.length).toBe(1);
      expect(tasksInDbAtEnd[0].title).toEqual("task1");
    });
  });

  describe("GET /sum-weeks", () => {
    it("should retun 401 if the user is not authorized", async () => {
      const response = await api.get("/api/tasks/sum-weeks");
      expect(response.status).toBe(401);
    });

    it("should return the array of the weekly sum for the user", async () => {
      Task.collection.insert(tasks)

      const response = await api
        .get(`/api/tasks/sum-weeks/${userId1.toString()}`)
        .set("x-auth-token", token);

      expect(response.status).toBe(200);
      expect(response.body[0].total).toBe(7);
      expect(response.body[0]._id).toBe(tasks[1].week);
      expect(response.body[0].total).toBe(7);
      expect(response.body[1]._id).toBe(tasks[0].week);
    });
  });
});
