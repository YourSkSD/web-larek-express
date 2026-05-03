export const config = {
  port: process.env.PORT || '3000',
  dbAddress: process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek',
  allowedOrigins: process.env.ORIGIN_ALLOW?.split(',') || [
    'http://localhost:5173',
  ],
  uploadPath: process.env.UPLOAD_PATH || 'images',
  uploadPathTemp: process.env.UPLOAD_PATH_TEMP || 'temp',
};

export default { config };
