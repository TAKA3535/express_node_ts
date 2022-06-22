import { Todo } from "../models/todo";
import { TodoRepository } from "../repositories/todoRepository";

export class TodoService {
  private todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  public async findAll(): Promise<Todo[] | Error> {
    const result = await this.todoRepository.findAll();
    return result;
  }
}
