import ReactS3Client from "react-aws-s3-typescript";

const S3_BUCKET = "test-ruby-2023";
const REGION = "ap-northeast-1";
const ACCESS_KEY = "AKIAYRLGAIWP4H7ZOXWG";
const SECRET_ACCESS_KEY = "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";

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};
export async function uploadFile(file: File) {
  const s3 = new ReactS3Client(config);

  try {
    const res = await s3.uploadFile(file, file.name);

    return res.location;
  } catch (exception) {
    console.log(exception);
  }
}
