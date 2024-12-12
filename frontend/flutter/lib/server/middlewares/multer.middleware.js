import multer from "multer";
const storage = new multer.memoryStorage();
const upload = multer({
    storage, limits: {
        fileSize: 10 * 1024 * 1024,
    }
});

export { upload };