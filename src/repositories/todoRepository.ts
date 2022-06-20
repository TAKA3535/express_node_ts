import { RowDataPacket, Connection } from "mysql2/promise";
import { Todo } from "../models/todo";

export class TodoRepository {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async findAll() {
    const sql = "select * from todos";
    const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(sql);
    return rows;
  }
}
