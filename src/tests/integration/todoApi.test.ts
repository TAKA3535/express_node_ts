import axios from "axios";
import * as dotenv from "dotenv";
import { Connection, RowDataPacket } from "mysql2/promise";
import { Todo } from "../../../src/models/todo";
import { createDBConnection } from "../utils/Database";
import { createTodoTestData } from "../utils/testData/createTodoTestData";

dotenv.config();
const { PORT } = process.env;
axios.defaults.baseURL = `http://localhost:${PORT}`;
axios.defaults.headers.common = { "Content-Type": "application/json" };
axios.defaults.validateStatus = (status) => status >= 200 && status < 500;

let connection: Connection;

beforeEach(async () => {
  connection = await createDBConnection();
  connection.query(`delete from todos`);
});

afterEach(async () => {
  await connection.end();
});

describe("TodoApi", () => {
  describe("findAll", () => {
    it("should return 5 todo and 200 status", async () => {
      const createdTodoList = await createTodoTestData(connection, 5);

      const response = await axios.get<Todo[]>("/api/todos");

      expect(response.status).toBe(200);
      expect(response.data.length).toBe(5);

      for (const todo of response.data) {
        const expectTodo = createdTodoList.filter((t) => t.id === todo.id)[0];
        expect(todo.id).toBe(expectTodo.id);
        expect(todo.title).toBe(expectTodo.title);
        expect(todo.description).toBe(expectTodo.description);
      }
    });
    it("should return empty and 200 status", async () => {
      const response = await axios.get<Todo[]>("/api/todos");
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(0);
    });
  });
  describe("getById", () => {
    it("should return todo and 200 status", async () => {
      const createdTodoList = await createTodoTestData(connection, 1);
      const expectTodo = createdTodoList[0];
      const response = await axios.get<Todo>(`/api/todos/${expectTodo.id}`);

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(expectTodo.id);
      expect(response.data.title).toBe(expectTodo.title);
      expect(response.data.description).toBe(expectTodo.description);
    });
    it("should return 404 status", async () => {
      const notExistsId = 1;
      const response = await axios.get<Todo>(`/api/todos/${notExistsId}`);
      expect(response.status).toBe(404);
    });
  });
  describe("create", () => {
    it("should return 201 status", async () => {
      const request: Todo = {
        title: "title",
        description: "description",
      };
      const response = await axios.post<number>("/api/todos", request);
      const createdId = response.data;

      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);
      const queryResult = rows[0] as Todo;

      expect(response.status).toBe(201);
      expect(queryResult.id).toBe(createdId);
      expect(queryResult.title).toBe(request.title);
      expect(queryResult.description).toBe(request.description);
    });
  });
  describe("update", () => {
    it("should return 200 status", async () => {
      const createdTodoList = await createTodoTestData(connection, 1);
      const createdId = createdTodoList[0].id;

      const request: Todo = {
        title: "updated title",
        description: "updated description",
      };

      const response = await axios.put(`/api/todos/${createdId}`, request);

      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);
      const queryResult = rows[0] as Todo;

      expect(response.status).toBe(200);
      expect(queryResult.id).toBe(createdId);
      expect(queryResult.title).toBe(request.title);
      expect(queryResult.description).toBe(request.description);
    });
    it("should return 404 status", async () => {
      const notExistsId = 1;
      const request: Todo = {
        title: "updated title",
        description: "updated description",
      };
      const response = await axios.put(`/api/todos/${notExistsId}`, request);
      expect(response.status).toBe(404);
    });
  });
  describe("delete", () => {
    it("should return 204 status", async () => {
      const createdTodoList = await createTodoTestData(connection, 1);
      const createdId = createdTodoList[0].id;
      const response = await axios.delete(`/api/todos/${createdId}`);

      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);

      expect(response.status).toBe(204);
      expect(rows.length).toBe(0);
    });
  });
});
