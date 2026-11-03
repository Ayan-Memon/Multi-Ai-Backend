import sharp from "sharp";

export const compressImage = async (buffer) => {
  return await sharp(buffer)
    .resize({
      width: 1536,
      height: 1536,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();
};
