import { Request, Response, Router } from "express";
import { TodoService } from "../services/todoService";

export class TodoController {
  private todoService: TodoService;
  public router: Router;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
    this.router = Router();

    this.router.get("/todos/", async (req: Request, res: Response) => {
      const result = await this.todoService.findAll();
      res.json(result);
    });
  }
}
