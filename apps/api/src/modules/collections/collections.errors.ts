import { NotFoundError } from "../../lib/errors";

export class CollectionNotFoundError extends NotFoundError {
  constructor() {
    super("Temporada");
  }
}
