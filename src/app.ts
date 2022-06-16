//使うライブラリの宣言
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { AddressInfo } from "net";

async function main() {
  const PORT = "4000";

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

  app.get("/", async (req: express.Request, res: express.Response) => {
    res.json("テスト");
  });
}

main();
