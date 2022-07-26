import { Request, Response, Router } from "express";
import { Todo } from "../models/todo";
import { TodoService } from "../services/todoService";
import { NotFoundDataError, SqlError } from "../utils/error";

export class TodoController {
  private todoService: TodoService;
  public router: Router;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
    this.router = Router();

    this.router.get("/todos", async (req: Request, res: Response) => {
      const result = await this.todoService.findAll();

      //返却された値がSqlErrorクラスかどうかチェック
      if (result instanceof Error) {
        //ここに入った時点でエラー
        res.status(500).json(result.message);
        return;
      }
      //ここまで来ている時点で正常
      res.status(200).json(result);
    });

    this.router.get("/todos/:id", async (req: Request, res: Response) => {
      //データを受け取る作業
      const id = parseInt(req.params.id);
      const result = await this.todoService.getById(id);

      if (result instanceof NotFoundDataError) {
        res.status(404).json(result.message);
        return;
      }

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(200).json(result);
    });

    this.router.post("/todos", async (req: Request, res: Response) => {
      //データを受け取る作業
      const todo: Todo = req.body;
      //受け取ったデータをサービス層に渡す
      const result = await this.todoService.create(todo);

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(201).json(result);
    });

    this.router.put("/todos/:id", async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const todo: Todo = req.body;
      const result = await this.todoService.update(id, todo);

      if (result instanceof NotFoundDataError) {
        res.status(404).json(result.message);
        return;
      }

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(200).json(result);
    });

    this.router.delete("/todos/:id", async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const result = await this.todoService.delete(id);

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(204).json(result);
    });
  }
}
