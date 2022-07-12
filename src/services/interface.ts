import { Todo } from "../models/todo";

export interface ITodoService {
  //引数なしでこれを返す
  findAll(): Promise<Todo[] | Error>;
  //idを引数にしてこれを返す
  getById(id: number): Promise<Todo | Error>;
  create(todo: Todo): Promise<number | Error>;
  update(id: number, todo: Todo): Promise<void | Error>;
  delete(id: number): Promise<void | Error>;
}
