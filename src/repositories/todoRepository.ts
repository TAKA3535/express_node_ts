import { RowDataPacket, Connection } from "mysql2/promise";
import { Todo } from "../models/todo";
import { SqlError } from "../utils/error";

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
}
