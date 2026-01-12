// Mengimpor diskStorage dari multer untuk penyimpanan file
import { diskStorage } from 'multer';
// Mengimpor extname untuk mengambil ekstensi file
import { extname } from 'path';

// Konfigurasi Multer
export const multerConfig = {
  // Pengaturan penyimpanan
  storage: diskStorage({
    // Folder tujuan upload
    destination: './uploads',
    // Fungsi penamaan file custom
    filename: (req, file, callback) => {
      // Membuat suffix unik menggunakan timestamp dan angka acak
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // Mengambil ekstensi asli file
      const ext = extname(file.originalname);
      // Menyusun nama file baru: fieldname-uniqueSuffix.ext
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  // Filter jenis file yang diizinkan
  fileFilter: (req, file, callback) => {
    // Memeriksa apakah file adalah gambar (jpg, jpeg, png, gif)
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      // Menolak file jika bukan gambar
      return callback(new Error('Only image files are allowed!'), false);
    }
    // Menerima file
    callback(null, true);
  },
  // Batasan upload
  limits: {
    fileSize: 1024 * 1024 * 5, // Maksimal ukuran file 5MB
  },
};
