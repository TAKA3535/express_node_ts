import { RowDataPacket, Connection } from "mysql2/promise";
import { resolve } from "path";
import { Todo } from "../models/todo";
import { SqlError } from "../utils/error";

export class TodoRepository {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async findAll() {
    const sql = "select * from todo";
    try {
      const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(sql);
      return rows;
    } catch (error) {
      return new SqlError(`TodoRepository.findAll() ERROR: ${error}`);
    }
  }
}
