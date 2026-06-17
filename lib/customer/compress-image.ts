const MAX_WIDTH = 1280;
const QUALITY = 0.7;

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("COMPRESS_FAILED"))),
      type,
      quality,
    );
  });
}

/** Client-side image compression for issue photos. Falls back to original on failure. */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let blob: Blob;
    let mime = "image/webp";
    try {
      blob = await canvasToBlob(canvas, "image/webp", QUALITY);
    } catch {
      blob = await canvasToBlob(canvas, "image/jpeg", QUALITY);
      mime = "image/jpeg";
    }

    if (blob.size >= file.size && file.size <= 512 * 1024) {
      return file;
    }

    const ext = mime === "image/webp" ? "webp" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.${ext}`, { type: mime });
  } catch {
    return file;
  }
}

export async function compressImageFiles(files: File[]): Promise<File[]> {
  return Promise.all(files.map((file) => compressImageFile(file)));
}
