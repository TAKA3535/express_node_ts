import { Request, Response, Router } from "express";
import { TodoService } from "../services/todoService";
import { SqlError } from "../utils/error";

export class TodoController {
  private todoService: TodoService;
  public router: Router;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
    this.router = Router();

    this.router.get("/todos/", async (req: Request, res: Response) => {
      const result = await this.todoService.findAll();

      if (result instanceof SqlError) {
        res.status(500).json(result.message);
      } else {
        res.status(200).json(result);
      }
    });
  }
}
