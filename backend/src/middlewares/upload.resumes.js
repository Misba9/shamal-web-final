import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESUMES_UPLOAD = path.join(__dirname, '../../uploads/resumes');

if (!fs.existsSync(RESUMES_UPLOAD)) {
  fs.mkdirSync(RESUMES_UPLOAD, { recursive: true });
}

const ALLOWED = /^application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/i;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, RESUMES_UPLOAD),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.pdf').toLowerCase();
    const safe = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60);
    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED.test(file.mimetype)) return cb(null, true);
  cb(new Error('Only PDF and DOC/DOCX files are allowed'));
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
}).single('resume');
