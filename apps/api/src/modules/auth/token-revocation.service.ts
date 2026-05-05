import { tokenRevocationRepository } from "./token-revocation.repository";

export const tokenRevocationService = {
  cleanupExpired() {
    return tokenRevocationRepository.cleanupExpired();
  },

  isRevoked(jti: string) {
    return tokenRevocationRepository.isRevoked(jti);
  },

  revoke(jti: string, expiresAt: Date) {
    return tokenRevocationRepository.revoke(jti, expiresAt);
  },
};
