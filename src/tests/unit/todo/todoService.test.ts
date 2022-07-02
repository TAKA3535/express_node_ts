import { Todo } from "../../../../src/models/todo";
import { ITodoRepository } from "../../../repositories/interface";
import { TodoService } from "../../../services/todoService";
import { NotFoundDataError } from "../../../../src/utils/error";

//テスト用のリポジトリ作成関数
function createMockRepository(): ITodoRepository {
  const mockRepository: ITodoRepository = {
    findAll: jest.fn(() => {
      throw new Error("Function not implemented.");
    }),
    getById: jest.fn((id: number) => {
      throw new Error("Function not implemented.");
    }),
    create: jest.fn((todo: Todo) => {
      throw new Error("Function not implemented.");
    }),
    update: jest.fn((id: number, todo: Todo) => {
      throw new Error("Function not implemented.");
    }),
    delete: jest.fn((id: number) => {
      throw new Error("Function not implemented.");
    }),
  };

  return mockRepository;
}

//テスト用のTodo作成関数、引数に渡した数分Todoを作成する
function createMockTodoList(num: number): Todo[] {
  const todoList: Todo[] = [];

  for (let index = 0; index < num; index++) {
    const todo: Todo = {
      id: index,
      title: `title_${index}`,
      description: `description_${index}`,
    };
    todoList.push(todo);
  }

  return todoList;
}

describe("TodoService", () => {
  describe("findAll", () => {
    //正常系テスト
    it("should return 5 todo", async () => {
      // サンプルでTodoを5個作成
      const mockResult: Todo[] = createMockTodoList(5);

      // テスト用のリポジトリを生成
      let mockRepository = createMockRepository();
      // テスト用にただ値を返すだけのfindAllメソッドをリポジトリに実装
      mockRepository.findAll = jest.fn(() => new Promise<Todo[] | Error>((resolve) => resolve(mockResult)));

      // テスト対象のServiceを生成
      const service = new TodoService(mockRepository);
      // 実行
      const result = await service.findAll();

      // エラー型かどうかチェック
      if (result instanceof Error) {
        // エラーが起きていたらテスト失敗
        throw new Error("Test failed because an error has occurred.");
      }

      // 返却値が5個であることを検証
      expect(result.length).toBe(5);

      // 返却値を一件ずつ検証
      for (let index = 0; index < result.length; index++) {
        // idの検証
        expect(mockResult[index].id).toBe(result[index].id);
        // titleの検証
        expect(mockResult[index].title).toBe(result[index].title);
        // descriptionの検証
        expect(mockResult[index].description).toBe(result[index].description);
      }
    });

    //異常系テスト
    it("should return repository error", async () => {
      // エラー文を生成
      const errMsg = "mock error";
      // 期待するエラーを作成
      const mockResult: Error = new Error(errMsg);

      // テスト用のリポジトリを生成
      let mockRepository = createMockRepository();
      // テスト用にただ値を返すだけのfindAllメソッドをリポジトリに実装
      mockRepository.findAll = jest.fn(() => new Promise<Todo[] | Error>((resolve) => resolve(mockResult)));

      // 実行
      const service = new TodoService(mockRepository);
      const result = await service.findAll();

      if (!(result instanceof Error)) {
        // エラーじゃなかったらテスト失敗
        throw new Error("Test failed because no error occurred");
      }

      // エラーメッセージが一致することを検証
      expect(result.message).toBe(mockResult.message);
    });
  });

  describe("getById", () => {
    // 正常系テスト
    it("should return todo", async () => {
      // テストデータ準備
      const mockResult: Todo = {
        id: 1,
        title: "title",
        description: "description",
      };

      // テスト用のリポジトリを生成
      let mockRepository = createMockRepository();
      // テスト用にただ値を返すだけのgetByIdメソッドをリポジトリに実装
      mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockResult)));

      //実行
      const service = new TodoService(mockRepository);
      const result = await service.getById(1);

      //エラーだった場合はテスト失敗
      if (result instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      //取得できた値が準備したテストデータと一致するかどうか検証
      expect(result.id).toBe(mockResult.id);
    });

    // 異常系テスト
    it("should return repository error", async () => {
      // テストデータ準備
      const errMsg = "mock error";
      const mockResult: Error = new Error(errMsg);

      // テスト用のリポジトリ生成
      let mockRepository = createMockRepository();
      // テスト用にただ値を返すだけのgetByIdをリポジトリに実装
      mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockResult)));

      // 実行
      const service = new TodoService(mockRepository);
      const result = await service.getById(1);

      // エラーが出なかったら
      if (!(result instanceof Error)) {
        //テスト失敗のエラーを出す
        throw new Error("Test failed because no error occurred");
      }

      // 返却されたメッセージが、テストデータ準備で作成したメッセージと一致することを検証
      expect(result.message).toBe(mockResult.message);
    });
  });

  describe("create", () => {
    it("should return createdId 1", async () => {
      const mockResult: number = 1;

      let mockRepository = createMockRepository();
      mockRepository.create = jest.fn(() => new Promise<number | Error>((resolve) => resolve(mockResult)));
      const service = new TodoService(mockRepository);

      const createTodo: Todo = {
        title: "title",
        description: "description",
      };
      const result = await service.create(createTodo);

      if (result instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      expect(result).toBe(mockResult);
    });

    it("should return repository error", async () => {
      const errMsg = "mock error";
      const mockResult: Error = new Error(errMsg);

      let mockRepository = createMockRepository();
      mockRepository.create = jest.fn(() => new Promise<number | Error>((resolve) => resolve(mockResult)));
      const service = new TodoService(mockRepository);

      const createTodo: Todo = {
        title: "title",
        description: "description",
      };
      const result = await service.create(createTodo);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result.message).toBe(mockResult.message);
    });
  });

  describe("update", () => {
    it("should return no errors", async () => {
      const mockGetByIdResult: Todo = {
        title: "title",
        description: "description",
      };

      let mockRepository = createMockRepository();
      mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockGetByIdResult)));
      mockRepository.update = jest.fn(() => new Promise<void | Error>((resolve) => resolve()));

      const service = new TodoService(mockRepository);

      const updateTodo: Todo = {
        title: "title",
        description: "description",
      };
      const result = await service.update(1, updateTodo);

      expect(result instanceof Error).toBeFalsy();
    });

    it("should return notfound error", async () => {
      const mockGetByIdResult: Error = new NotFoundDataError("mock notfound error");

      let mockRepository = createMockRepository();
      mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockGetByIdResult)));
      mockRepository.update = jest.fn(() => new Promise<void | Error>((resolve) => resolve()));

      const service = new TodoService(mockRepository);

      const updateTodo: Todo = {
        id: 1,
        title: "title",
        description: "description",
      };
      const result = await service.update(1, updateTodo);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result instanceof NotFoundDataError).toBeTruthy();
      expect(result.message).toBe(mockGetByIdResult.message);
    });

    it("should return repository error", async () => {
      const mockGetByIdResult: Todo = {
        id: 1,
        title: "title",
        description: "description",
      };
      const errMsg = "mock error";
      const mockUpdateResult: Error = new Error(errMsg);

      let mockRepository = createMockRepository();
      mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockGetByIdResult)));
      mockRepository.update = jest.fn(() => new Promise<void | Error>((resolve) => resolve(mockUpdateResult)));

      const service = new TodoService(mockRepository);

      const updateTodo: Todo = {
        id: 1,
        title: "title",
        description: "description",
      };
      const result = await service.update(1, updateTodo);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }
      expect(result.message).toBe(mockUpdateResult.message);
    });
  });

  describe("delete", () => {
    it("should return no errors", async () => {
      let mockRepository = createMockRepository();
      mockRepository.delete = jest.fn(() => new Promise<void | Error>((resolve) => resolve()));
      const service = new TodoService(mockRepository);

      const result = await service.delete(1);

      expect(result instanceof Error).toBeFalsy;
    });

    it("should return repository error", async () => {
      const errMsg = "mock error";
      const mockResult: Error = new Error(errMsg);

      let mockRepository = createMockRepository();
      mockRepository.delete = jest.fn(() => new Promise<void | Error>((resolve) => resolve(mockResult)));
      const service = new TodoService(mockRepository);

      const result = await service.delete(1);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result.message).toBe(mockResult.message);
    });
  });
});
