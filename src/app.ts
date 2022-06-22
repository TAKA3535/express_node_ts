//使うライブラリの宣言
import express, { Express } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";
import mysql, { Connection } from "mysql2/promise";
import { TodoRepository } from "./repositories/todoRepository";
import { TodoService } from "./services/todoService";
import { TodoController } from "./controllers/todoController";

async function main() {
  //.envファイルの読み込み
  dotenv.config();
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB, PORT } = process.env;

  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS設定
  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  // expressで4000ポートにサーバー起動
  const server = app.listen(parseInt(PORT as string), () => {
    const address = server.address() as AddressInfo;
    console.log("Node.js is listening to PORT:" + address.port);
  });

  const connection: Connection = await mysql.createConnection({
    host: MYSQL_HOST as string,
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER as string,
    password: MYSQL_PASS as string,
    database: MYSQL_DB as string,
  });

  const repository = new TodoRepository(connection);
  const service = new TodoService(repository);
  const controller = new TodoController(service);
  app.use("/api/", controller.router);
}

main();
