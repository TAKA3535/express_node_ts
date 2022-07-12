import { RowDataPacket, Connection, ResultSetHeader } from "mysql2/promise";
import { Todo } from "../models/todo";
import { NotFoundDataError, SqlError } from "../utils/error";

export class TodoRepository {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async findAll(): Promise<Todo[] | Error> {
    try {
      const sql = "select * from todos";
      const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(sql);
      return rows;
    } catch (error) {
      return new SqlError(`TodoRepository.findAll() ERROR: ${error}`);
    }
  }

  public async getById(id: number): Promise<Todo | Error> {
    try {
      const sql = "select * from todos where id = ?";
      const [rows] = await this.connection.execute<Todo & RowDataPacket[]>(sql, [id]);
      //1件も返ってこない
      if (rows.length === 0) {
        return new NotFoundDataError(`not exists target todo`);
      }
      return rows[0] as Todo;
    } catch (error) {
      return new SqlError(`TodoRepository.getById() ERROR: ${error}`);
    }
  }

  public async create(todo: Todo): Promise<number | Error> {
    try {
      const sql = `
        insert into todos(title,description) values(?,?)
      `;
      const [result] = await this.connection.query<ResultSetHeader>(sql, [todo.title, todo.description]);
      return result.insertId;
    } catch (error) {
      return new SqlError(`TodoRepository.create() ERROR: ${error}`);
    }
  }

  public async update(id: number, todo: Todo): Promise<void | Error> {
    try {
      const sql = `
        update todos set title = ?, description = ?
        where id = ?`;
      await this.connection.query<ResultSetHeader>(sql, [todo.title, todo.description, id]);
    } catch (error) {
      return new SqlError(`TodoRepository.update() ERROR: ${error}`);
    }
  }

  public async delete(id: number): Promise<void | Error> {
    try {
      const sql = `delete from todos where id = ?`;
      await this.connection.query<ResultSetHeader>(sql, id);
    } catch (error) {
      return new SqlError(`TodoRepository.delete() ERROR: ${error}`);
    }
  }
}
