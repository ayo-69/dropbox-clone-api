const Minio = require("minio");

function createMinioClient() {
    // Create a MinIO client instance
  const client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  });

  // Check if the bucket exists, and create it if it doesn't
  client.bucketExists(process.env.MINIO_BUCKET)
  .then((exists) => {
    if (!exists) {
      return client.makeBucket(process.env.MINIO_BUCKET, "us-east-1");
    }
  })
  .catch((err) => {
    console.error("Error checking or creating bucket:", err);
  });
  
  return client;
}

module.exports = createMinioClient;