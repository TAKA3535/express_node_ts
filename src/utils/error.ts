class BaseError extends Error {
  constructor(e?: string) {
    super(e);

    // instance of で比較できるようにするため
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SqlError extends BaseError {}
