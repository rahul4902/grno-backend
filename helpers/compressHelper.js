const path = require("path");
const sharp = require("sharp");
const fs = require("fs").promises;
const ffmpeg = require("fluent-ffmpeg");

const compressImage = async (
  file,
  maxSizeKB,
  maxWidthToConvert,
  uploadPath,
  fileName
) => {
  const image = sharp(file.data);
  const metadata = await image.metadata();
  const { format, width, height } = metadata;
  const sizeInBytes =
    (width *
      height *
      metadata.channels *
      (metadata.depth === "uchar" ? 8 : 1)) /
    8;
    if (width > maxWidthToConvert) {
      const newHeight = Math.round((maxWidthToConvert / width) * height);
      await image.resize({ width: maxWidthToConvert, height: newHeight });
    }

    await image
      .jpeg({
        quality: 50,
        progressive: true,
        chromaSubsampling: "4:2:0",
      })
      .webp({ quality: 50 });

    image.toFile(uploadPath + fileName, (error) => {
      if (error) {
        return { status: 400, message: error };
      }
    });

    return { status: 200 };

};

const compressVideo = async (file, filePath, fileName) => {
  try {
    const tempInputPath = `${filePath}_temp${path.extname(fileName)}`;
    await fs.writeFile(tempInputPath, file.data);

    return new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .outputOptions([
          "-vf scale=640:-1", 
          "-b:v 500k", 
          "-crf 35", 
          "-preset veryslow", 
        ])
        .on("start", (cmdline) => {
          console.log("Started FFmpeg with command: " + cmdline);
        })
        .on("progress", (progress) => {
          console.log("Processing: " + progress.percent + "% done");
        })
        .on("end", async () => {
          await fs.unlink(tempInputPath); 
          resolve({ status: 200 });
        })
        .on("error", async (err) => {
          await fs.unlink(tempInputPath); 
          console.error("FFmpeg error:", err);
          reject({ status: 400, message: err.message });
        })
        .save(filePath + fileName);
    });
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

const generateThumbnail = async (
  inputFilePath,
  thumbnailName,
  thumbnailPath
) => {
  try {
    const thumbnailFullPath = path.join(thumbnailPath);

    const videoMetadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata);
        }
      });
    });

    const videoWidth = videoMetadata.streams[0].width;
    const videoHeight = videoMetadata.streams[0].height;
    const aspectRatio = videoWidth / videoHeight;

    const targetWidth = 480;
    const targetHeight = Math.round(targetWidth / aspectRatio);

    await new Promise((resolve, reject) => {
      ffmpeg(inputFilePath)
        .screenshots({
          timestamps: ["50%"],
          filename: `${thumbnailName}`,
          folder: thumbnailFullPath,
          size: `${targetWidth}x${targetHeight}`,
        })
        .on("end", async () => {
          resolve({ status: 200, thumbnailFullPath });
        })
        .on("error", async (err) => {
          console.error("FFmpeg thumbnail error:", err);
          reject({ status: 400, message: err.message });
        });
    });

    const thumbnailBuffer = await fs.readFile(thumbnailFullPath+thumbnailName);
    console.log('thumbnailBuffer',thumbnailBuffer)
    await sharp(thumbnailBuffer)
      .jpeg({
        quality: 50,
        progressive: true,
        chromaSubsampling: "4:2:0",
      })
      .webp({ quality: 50 })
      .toFile(thumbnailFullPath+thumbnailName);
    return { status: 200, thumbnailPath: thumbnailFullPath+thumbnailName };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};

module.exports = { compressImage, compressVideo, generateThumbnail };
