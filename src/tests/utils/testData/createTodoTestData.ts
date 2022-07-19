import { Connection, ResultSetHeader } from "mysql2/promise";
import { Todo } from "../../../../src/models/todo";

export async function createTodoTestData(connection: Connection, num: number): Promise<Todo[]> {
  const todoList: Todo[] = [];

  for (let index = 0; index < num; index++) {
    const todo: Todo = {
      title: `title_${index}`,
      description: `description_${index}`,
    };
    const query = `insert into todos(title,description) values("${todo.title}","${todo.description}")`;
    const [result] = await connection.query<ResultSetHeader>(query);

    todo.id = result.insertId;
    todoList.push(todo);
  }

  return todoList;
}
