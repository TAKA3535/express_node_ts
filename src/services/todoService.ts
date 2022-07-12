import { Todo } from "../models/todo";
import { ITodoRepository } from "../repositories/interface";
import { TodoRepository } from "../repositories/todoRepository";
import { ITodoService } from "./interface";

export class TodoService implements ITodoService {
  private todoRepository: ITodoRepository;

  //new(インタンス化)する時に何が必要で何をするか
  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  public async findAll(): Promise<Todo[] | Error> {
    //repositoryに命令してfindallしてる、それをresultで受け取っている
    const result = await this.todoRepository.findAll();
    //受け取ったresultを返却してる
    return result;
  }

  public async getById(id: number): Promise<Todo | Error> {
    const result = await this.todoRepository.getById(id);
    return result;
  }

  public async create(todo: Todo): Promise<number | Error> {
    const result = await this.todoRepository.create(todo);
    return result;
  }

  public async update(id: number, todo: Todo): Promise<void | Error> {
    const getResult = await this.todoRepository.getById(id);
    if (getResult instanceof Error) {
      return getResult;
    }

    const updateResult = await this.todoRepository.update(id, todo);
    return updateResult;
  }

  public async delete(id: number): Promise<void | Error> {
    const result = await this.todoRepository.delete(id);
    return result;
  }
}
