import { createWriteStream } from "fs";
import * as mkdirp from "mkdirp";
import shortid from "shortid";

const uploadDir = "./public";
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }): Promise<any> => {
  const id = shortid.generate();
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ id, path }))
      .on("error", reject)
  );
};

const processUpload = async upload => {
  const { stream, filename } = await upload;
  const { path } = await storeUpload({ stream, filename });

  return path;
};

export default processUpload;
