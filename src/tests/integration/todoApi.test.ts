//import文
import axios from "axios";
import * as dotenv from "dotenv";
import { Connection, RowDataPacket } from "mysql2/promise";
import { Todo } from "../../../src/models/todo";
import { createDBConnection } from "../utils/Database";
import { createTodoTestData } from "../utils/testData/createTodoTestData";

//envファイルの読み込み
dotenv.config();
//envファイルの「PORT」を変数に代入
const { PORT } = process.env;

//axios→非同期処理 下で登場するURLを短くするために書いてるよ！書かなくてもいいよ○
axios.defaults.baseURL = `http://localhost:${PORT}`;
//APIテスターでも入ってるよね？
axios.defaults.headers.common = { "Content-Type": "application/json" };
//ステータスコードの許容値の設定
axios.defaults.validateStatus = (status) => status >= 200 && status < 500;

let connection: Connection;

//全部のテストに共通の前処理
beforeEach(async () => {
  //DB接続開始
  connection = await createDBConnection();
  //todosテーブルのデータを全て削除
  connection.query(`delete from todos`);
});

//全部のテストに共通の後処理
afterEach(async () => {
  //DB接続終了
  await connection.end();
});

describe("TodoApi", () => {
  describe("findAll", () => {
    it("should return 5 todo and 200 status", async () => {
      //準備
      const createdTodoList = await createTodoTestData(connection, 5);

      //実行
      const response = await axios.get<Todo[]>("/api/todos");

      //検証
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(5);

      for (const todo of response.data) {
        const expectTodo = createdTodoList.filter((t) => t.id === todo.id)[0];
        expect(todo.id).toBe(expectTodo.id);
        expect(todo.title).toBe(expectTodo.title);
        expect(todo.description).toBe(expectTodo.description);
      }
    });
  });
  describe("getById", () => {
    it("should return todo and 200 status", async () => {
      //準備
      const createdTodoList = await createTodoTestData(connection, 1);
      const expectTodo = createdTodoList[0];

      //実行
      const response = await axios.get<Todo>(`/api/todos/${expectTodo.id}`);

      //検証
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(expectTodo.id);
      expect(response.data.title).toBe(expectTodo.title);
      expect(response.data.description).toBe(expectTodo.description);
    });
    it("should return 404 status", async () => {
      const notExistsId = 1;
      const response = await axios.get<Todo>(`/api/todos/${notExistsId}`);
      expect(response.status).toBe(404);
      //エラーメッセージのチェックまでしてあげる方が親切！好みだよ
      expect(response.statusText).toBe("not exists target todo");
    });
  });
  describe("create", () => {
    it("should return 201 status", async () => {
      //準備
      const request: Todo = {
        title: "title",
        description: "description",
      };
      //実行
      const response = await axios.post<number>("/api/todos", request);

      //検証
      expect(response.status).toBe(201);

      //作成されたTodoのID
      const createdId = response.data;

      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);
      const queryResult = rows[0] as Todo;

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

      //ステータスコードのチェック！
      expect(response.status).toBe(200);

      //こっから下は実際にデータベース見に行くよ！
      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);
      const queryResult = rows[0] as Todo;

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

      expect(response.status).toBe(204);

      const query = `select * from todos where id = ${createdId}`;
      const [rows] = await connection.query<Todo & RowDataPacket[]>(query);
      expect(rows.length).toBe(0);
    });
  });
});
