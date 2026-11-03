import { imagekit } from "../config/imageKit.js";

export const uploadFile = async (buffer, fileName, folderName) => {
  return imagekit.upload({
    file: buffer,
    fileName: fileName,
    folder: `/NEXORA/${folderName}`,
    useUniqueFileName: true,
  });
};
