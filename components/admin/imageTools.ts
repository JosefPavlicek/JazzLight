export type PreparedImage = {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  base64: string;
};

export type CompressOptions = {
  targetBytes?: number;
  maxWidth?: number;
  maxHeight?: number;
  initialQuality?: number;
  minQuality?: number;
};

const DEFAULT_TARGET_IMAGE_BYTES = 220_000;
const DEFAULT_MAX_WIDTH = 1000;
const DEFAULT_MAX_HEIGHT = 1000;

function dataUrlSizeBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.round((base64.length * 3) / 4);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Nepodařilo se načíst obrázek ${file.name}.`));
    };

    image.src = url;
  });
}

function renderJpeg(image: HTMLImageElement, width: number, height: number, quality: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas není dostupný.");

  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function compressImage(file: File, options: CompressOptions = {}): Promise<PreparedImage> {
  const image = await loadImage(file);

  const targetBytes = options.targetBytes ?? DEFAULT_TARGET_IMAGE_BYTES;
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const maxHeight = options.maxHeight ?? DEFAULT_MAX_HEIGHT;
  const initialQuality = options.initialQuality ?? 0.78;
  const minQuality = options.minQuality ?? 0.34;

  let ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  let width = Math.max(1, Math.round(image.width * ratio));
  let height = Math.max(1, Math.round(image.height * ratio));

  let quality = initialQuality;
  let base64 = renderJpeg(image, width, height, quality);
  let sizeBytes = dataUrlSizeBytes(base64);

  while (sizeBytes > targetBytes && quality > minQuality) {
    quality = Math.max(minQuality, quality - 0.06);
    base64 = renderJpeg(image, width, height, quality);
    sizeBytes = dataUrlSizeBytes(base64);
  }

  while (sizeBytes > targetBytes && width > 420 && height > 420) {
    width = Math.round(width * 0.86);
    height = Math.round(height * 0.86);
    base64 = renderJpeg(image, width, height, quality);
    sizeBytes = dataUrlSizeBytes(base64);
  }

  return {
    id: crypto.randomUUID(),
    name: file.name.replace(/\.[^.]+$/, ".jpg"),
    mimeType: "image/jpeg",
    sizeBytes,
    base64,
  };
}

export async function compressImagesWithProgress(
  files: File[],
  onProgress: (progress: number) => void,
  options: CompressOptions = {}
): Promise<PreparedImage[]> {
  const result: PreparedImage[] = [];

  if (!files.length) {
    onProgress(100);
    return result;
  }

  for (let index = 0; index < files.length; index += 1) {
    const image = await compressImage(files[index], options);
    result.push(image);
    onProgress(Math.round(((index + 1) / files.length) * 100));
  }

  return result;
}
