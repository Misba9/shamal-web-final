import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOGS_UPLOAD = path.join(__dirname, '../../uploads/blogs');

if (!fs.existsSync(BLOGS_UPLOAD)) {
  fs.mkdirSync(BLOGS_UPLOAD, { recursive: true });
}

const ALLOWED = /^image\/(jpeg|jpg|png|webp)$/i;
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, BLOGS_UPLOAD),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    const safe = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60);
    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED.test(file.mimetype)) return cb(null, true);
  cb(new Error('Only jpg, png, jpeg, and webp images are allowed'));
};

export const uploadBlogImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
}).single('image');
