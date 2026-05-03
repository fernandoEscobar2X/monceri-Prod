import { AppError } from "../../lib/errors";

export class ProductInactiveError extends AppError {
  constructor() {
    super("Producto inactivo", 422, "PRODUCT_INACTIVE");
  }
}
