import { Request, Response, Router } from 'express';
import { upload } from '~/middlewares';

const routerUpload: Router = Router();

// Upload images
routerUpload.post('/images', upload.array('image', 12), (req: Request, res: Response) => {
  try {
    if (!Array.isArray(req.files)) {
      throw new Error('No file uploaded');
    }

    const uploadedFiles = req.files.map((file: Express.Multer.File) => {
      return {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      };
    });

    res.status(200).json({ message: 'Files uploaded successfully', files: uploadedFiles });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Error uploading files' });
  }
});

export default routerUpload;
