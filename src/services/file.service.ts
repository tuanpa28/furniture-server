import fs from 'fs';
import path from 'path';

export const deleteImage = (fileName: string) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);

    // Kiểm tra xem file có tồn tại không
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // Nếu không tìm thấy file
        reject(new Error('File not found'));
      } else {
        // Xoá file từ hệ thống file
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve('File deleted successfully');
          }
        });
      }
    });
  });
};
