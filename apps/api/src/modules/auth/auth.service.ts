import type { AdminLoginInput } from "@monceri/shared";
import bcrypt from "bcryptjs";
import { UnauthorizedError, ValidationError } from "../../lib/errors";
import { authRepository } from "./auth.repository";

const LOCKOUT_THRESHOLDS = [
  { attempts: 5, durationMs: 60_000 },
  { attempts: 8, durationMs: 5 * 60_000 },
  { attempts: 12, durationMs: 30 * 60_000 },
  { attempts: 20, durationMs: 24 * 60 * 60_000 },
];

export const authService = {
  async login(input: AdminLoginInput) {
    const admin = await authRepository.findByEmail(input.email);

    if (!admin) {
      throw new UnauthorizedError();
    }

    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60_000);
      throw new UnauthorizedError(`Cuenta bloqueada temporalmente. Intenta en ${minutesLeft} minutos`);
    }

    const validPassword = await bcrypt.compare(input.password, admin.password);

    if (!validPassword) {
      const failedLoginCount = admin.failedLoginCount + 1;
      const threshold = LOCKOUT_THRESHOLDS.filter((item) => failedLoginCount >= item.attempts).pop();

      await authRepository.updateLoginFailure(
        admin.id,
        failedLoginCount,
        threshold ? new Date(Date.now() + threshold.durationMs) : null,
      );

      throw new UnauthorizedError();
    }

    await authRepository.updateLoginSuccess(admin.id);

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  },

  async changePassword(adminId: string, currentPassword: string, newPassword: string) {
    const admin = await authRepository.findById(adminId);

    if (!admin) {
      throw new UnauthorizedError();
    }

    const validPassword = await bcrypt.compare(currentPassword, admin.password);

    if (!validPassword) {
      throw new UnauthorizedError("Contrasena actual incorrecta");
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      throw new ValidationError("La nueva contrasena debe tener entre 8 y 72 caracteres");
    }

    const password = await bcrypt.hash(newPassword, 12);
    await authRepository.updatePassword(adminId, password);
  },
};
