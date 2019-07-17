const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const { Task } = require("../../models/Task");
const { User } = require("../../models/User");
const { aggregate } = require("../testHelpers");
let server;
let api;
let userId1;
let userId2;
let token1;
let token2;
let tasks;
let task;

describe("/api/users", () => {
  // run the server
  beforeAll(async () => {
    server = require("../../index");
    api = request(server);

    // register two users and use token created from them to store tasks and login
    const user1 = {
      first_name: "user1",
      last_name: "user1",
      email: "user1@gmail.com",
      password: "password"
    };
    const user2 = {
      first_name: "user2",
      last_name: "user2",
      email: "user2@gmail.com",
      password: "password"
    };

    const response1 = await api.post("/api/users").send(user1);
    token1 = response1.body.token;
    const response2 = await api.post("/api/users").send(user2);
    token2 = response2.body.token;

    const decodedUser1 = await jwt.decode(token1, config.get("jwtPrivateKey"));
    const decodedUser2 = await jwt.decode(token2, config.get("jwtPrivateKey"));

    userId1 = mongoose.Types.ObjectId(decodedUser1.id);
    userId2 = mongoose.Types.ObjectId(decodedUser2.id);

    await server.close();
  });

  beforeEach(async () => {
    server = require("../../index");
    api = request(server);

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
        title: "task2",
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
        title: "task3",
        userId: userId1,
        year: 1,
        month: 2,
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

  afterAll(async () => {
    await await User.remove({});
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
      const response = await api.get(`/api/tasks`).set("x-auth-token", token1);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe("task1");
      expect(response.body[0].userId.toString()).toEqual(userId1.toString());
    });

    it("should return 404 if no tasks are found for that user", async () => {
      const response = await api.get(`/api/tasks`).set("x-auth-token", token1);

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
        .set("x-auth-token", token1)
        .send(task);
      expect(response.status).toBe(400);
    });

    it("should return 400 when the year of the task is not set", async () => {
      delete task.year;
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token1)
        .send(task);
      expect(response.status).toBe(400);
    });

    it("should return 400 when the month of the task is not set", async () => {
      delete task.month;
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token1)
        .send(task);
      expect(response.status).toBe(400);
    });

    it("should return 400 when the week of the task is not set", async () => {
      delete task.week;
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token1)
        .send(task);
      expect(response.status).toBe(400);
    });

    it("should return 200 when the task is successfully saved in the DB", async () => {
      const response = await api
        .post("/api/tasks")
        .set("x-auth-token", token1)
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
      Task.collection.insert(tasks);

      const response = await api
        .get(`/api/tasks/sum-weeks`)
        .set("x-auth-token", token1);

      expect(response.status).toBe(200);
      expect(response.body[0].total).toBe(aggregate(tasks, userId1, "week", 2));
      expect(response.body[1].total).toBe(aggregate(tasks, userId1, "week", 1));
    });

    it("should return 404 if no tasks were found", async () => {
      const response = await api
        .get("/api/tasks/sum-weeks")
        .set("x-auth-token", token1);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /sum-months", () => {
    it("should retun 401 if the user is not authorized", async () => {
      const response = await api.get("/api/tasks/sum-months");
      expect(response.status).toBe(401);
    });

    it("should return the array of the monthly sum for the user", async () => {
      Task.collection.insert(tasks);

      const response = await api
        .get(`/api/tasks/sum-months`)
        .set("x-auth-token", token1);

      expect(response.status).toBe(200);
      expect(response.body[0].total).toBe(
        aggregate(tasks, userId1, "month", 2)
      );
      expect(response.body[1].total).toBe(
        aggregate(tasks, userId1, "month", 1)
      );
    });

    it("should return 404 if no tasks were found", async () => {
      const response = await api
        .get("/api/tasks/sum-months")
        .set("x-auth-token", token1);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /week/:number", () => {
    it("should return 401 if the user is not logged in", async () => {
      const response = await api.get("/api/tasks/week/1");

      expect(response.status).toBe(401);
    });

    it("should return 404 if there is no task for that week", async () => {
      const response = await api
        .get("/api/tasks/week/65654")
        .set("x-auth-token", token1);

      expect(response.status).toBe(404);
    });

    it("should return the tasks for the week", async () => {
      Task.collection.insert(tasks);

      const response = await api
        .get("/api/tasks/week/1")
        .set("x-auth-token", token1);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some(t => t.title === "task1")).toBeTruthy();
      expect(response.body.some(t => t.title === "task2")).toBeTruthy();
    });
  });

  describe("GET /month/:number", () => {
    it("should return 401 if the user is not logged in", async () => {
      const response = await api.get("/api/tasks/month/1");

      expect(response.status).toBe(401);
    });

    it("should return 404 if there is no task for that week", async () => {
      const response = await api
        .get("/api/tasks/month/65654")
        .set("x-auth-token", token1);

      expect(response.status).toBe(404);
    });

    it("should return the tasks for the month", async () => {
      Task.collection.insert(tasks);

      const response = await api
        .get("/api/tasks/month/1")
        .set("x-auth-token", token1);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some(t => t.title === "task1")).toBeTruthy();
      expect(response.body.some(t => t.title === "task2")).toBeTruthy();
    });
  });

  describe("DELETE /:taskId", () => {
    it("should return 401 when the user is not authorized", async () => {
      const response = await api.delete(`/api/tasks/1`);

      expect(response.status).toBe(401);
    });

    it("should return 404 when the task does not exist in the DB or the ID of the task is not valid", async () => {
      Task.collection.insert(tasks);

      const response = await api
        .delete("/api/tasks/5")
        .set("x-auth-token", token1);

      expect(response.status).toBe(404);
    });

    it("should return 404 if a user wants to delete other user's task", async () => {
      Task.collection.insert(tasks);

      const tasksFromDbStart = await api
        .get("/api/tasks")
        .set("x-auth-token", token1);

      // use the ID to delete the task with other users token
      const response = await api
        .delete(`/api/tasks/${tasksFromDbStart.body[0]._id}`)
        .set("x-auth-token", token2);

      expect(response.status).toBe(404);
    });

    it("should return 204 and delete the task from the DB", async () => {
      Task.collection.insert(tasks);

      const tasksFromDbStart = await api
        .get("/api/tasks")
        .set("x-auth-token", token1);

      // use the ID to delete the task
      const response = await api
        .delete(`/api/tasks/${tasksFromDbStart.body[0]._id}`)
        .set("x-auth-token", token1);

      const tasksFromDbEnd = await await api
        .get("/api/tasks")
        .set("x-auth-token", token1);

      expect(response.status).toBe(204);
      expect(tasksFromDbEnd.body.length).toBe(tasksFromDbStart.body.length - 1);
    });
  });

  describe("PUT /:taskId", () => {
    it("should return 401 if the user is not authorized", async () => {
      const response = await api.put("/api/tasks/1");

      expect(response.status).toBe(401);
    });

    it("should return 404 if the task is not found or the task ID is not valid", async () => {
      const response = await api
        .put("/api/tasks/1")
        .set("x-auth-token", token1);

      expect(response.status).toBe(404);
    });

    it("should return 404 if a user wants to update other user's task", async () => {
      Task.collection.insert(tasks);

      const tasksFromDbStart = await api
        .get("/api/tasks")
        .set("x-auth-token", token1);

      const task1 = tasksFromDbStart.body[0];
      task1.title = "updated";
      task1.days[0].duration = 10;

      // use the ID to delete the task with other users token
      const response = await api
        .delete(`/api/tasks/${tasksFromDbStart.body[0]._id}`)
        .set("x-auth-token", token2)
        .send(task1);

      expect(response.status).toBe(404);
    });

    it("should return 204 and the updated task", async () => {
      Task.collection.insert(tasks);

      const tasksFromDbStart = await api
        .get("/api/tasks")
        .set("x-auth-token", token1);

      const task1 = tasksFromDbStart.body[0];
      task1.title = "updated";
      task1.days[0].duration = 10;

      const response = await api
        .put(`/api/tasks/${task1._id}`)
        .set("x-auth-token", token1)
        .send(task1);

      expect(response.status).toBe(201);
      expect(response.body.title).toMatch("updated");
      expect(response.body.days[0].duration).toBe(10);
    });
  });
});
