import { uploadsRepository } from "./uploads.repository";

export const uploadsService = {
  async registerUploadedFile(url: string) {
    return uploadsRepository.saveMetadata(url);
  },
};
