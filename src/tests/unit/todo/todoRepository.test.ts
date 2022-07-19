import { Connection, RowDataPacket } from "mysql2/promise";
import { Todo } from "../../../../src/models/todo";
import { TodoRepository } from "../../../../src/repositories/todoRepository";
import { NotFoundDataError } from "../../../../src/utils/error";
import { createDBConnection } from "../../utils/Database";
import { createTodoTestData } from "../../utils/testData/createTodoTestData";

let connection: Connection;

beforeEach(async () => {
  connection = await createDBConnection();
  connection.query(`delete from todos`);
});

afterEach(async () => {
  await connection.end();
});

describe("TodoRepository", () => {
  describe("findAll", () => {
    it("shoud return 5 todo", async () => {
      const repository = new TodoRepository(connection);
      const createdTodoList = await createTodoTestData(connection, 5);

      const result = await repository.findAll();
      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${result.message}`);
      }

      for (const todo of result) {
        const expectTodo = createdTodoList.filter((t) => t.id === todo.id)[0];
        expect(todo.id).toBe(expectTodo.id);
        expect(todo.title).toBe(expectTodo.title);
        expect(todo.description).toBe(expectTodo.description);
      }
    });
    it("shoud return empty", async () => {
      const repository = new TodoRepository(connection);

      const result = await repository.findAll();
      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${result.message}`);
      }
      expect(result.length).toBe(0);
    });
  });

  describe("getById", () => {
    it("shoud return todo", async () => {
      const repository = new TodoRepository(connection);
      const [todo] = await createTodoTestData(connection, 1);

      const result = await repository.getById(todo.id!);
      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${result.message}`);
      }

      expect(result.id).toBe(todo.id);
      expect(result.title).toBe(todo.title);
      expect(result.description).toBe(todo.description);
    });

    it("shoud return notfound error", async () => {
      const repository = new TodoRepository(connection);
      const result = await repository.getById(1);
      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result instanceof NotFoundDataError).toBeTruthy();
    });
  });

  describe("create", () => {
    it("shoud return createdId", async () => {
      const repository = new TodoRepository(connection);
      const todo: Todo = {
        title: "title",
        description: "description",
      };
      const createdId = await repository.create(todo);
      if (createdId instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${createdId.message}`);
      }

      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);
      const result = rows[0] as Todo;

      expect(result.id).toBe(createdId);
      expect(result.title).toBe(todo.title);
      expect(result.description).toBe(todo.description);
    });
  });

  describe("update", () => {
    it("shoud return no errors", async () => {
      const repository = new TodoRepository(connection);
      const [createdTodo] = await createTodoTestData(connection, 1);
      const createdId = createdTodo.id!;

      const todo: Todo = {
        title: "updated title",
        description: "updated description",
      };

      const updateResult = await repository.update(createdId, todo);
      if (updateResult instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${updateResult.message}`);
      }

      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);
      const result = rows[0] as Todo;

      expect(result.id).toBe(createdId);
      expect(result.title).toBe(todo.title);
      expect(result.description).toBe(todo.description);
    });
  });

  describe("delete", () => {
    it("shoud return no errors", async () => {
      const repository = new TodoRepository(connection);
      const [createdTodo] = await createTodoTestData(connection, 1);
      const createdId = createdTodo.id!;

      const deleteResult = await repository.delete(createdId);
      if (deleteResult instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${deleteResult.message}`);
      }

      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);

      expect(rows.length).toBe(0);
    });
  });
});
