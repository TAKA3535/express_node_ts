import { TodoRepository } from "../repositories/todoRepository";

export class TodoService {
  private todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  public async findAll() {
    const result = await this.todoRepository.findAll();
    return result;
  }
}
