import { createConnection, Connection } from "mysql2/promise";
import * as fs from "fs";

/*
  このファイルに定義しているのは、テスト専用データベースを使用する場合の関数。
  興味でやってみたらできたので残していますが、勉強会でここまでやる必要はないので無視してください。
*/
export async function resetTestDB() {
  const connection = await createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootPassword",
    multipleStatements: true,
  });
  await connection.connect();

  await connection.query("DROP DATABASE IF EXISTS test_db");
  await connection.query("CREATE DATABASE test_db");
  await connection.query("use test_db");

  const initSql = fs.readFileSync("./docker/mysql/init.sql", "utf8");

  const queries = initSql.split(";");
  for (const query of queries) {
    if (query !== "") {
      await connection.query(query);
    }
  }

  connection.end();
}

export async function createTestDBConnection(): Promise<Connection> {
  const connection = await createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootPassword",
    database: "test_db",
    multipleStatements: true,
  });
  return connection;
}
