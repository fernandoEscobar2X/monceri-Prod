import type { AdminLoginInput } from "@monceri/shared";
import bcrypt from "bcryptjs";
import { UnauthorizedError } from "../../lib/errors";
import { authRepository } from "./auth.repository";

export const authService = {
  async login(input: AdminLoginInput) {
    const admin = await authRepository.findByEmail(input.email);

    if (!admin) {
      throw new UnauthorizedError();
    }

    const validPassword = await bcrypt.compare(input.password, admin.password);

    if (!validPassword) {
      throw new UnauthorizedError();
    }

    await authRepository.touchLastLogin(admin.id);

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  },
};
