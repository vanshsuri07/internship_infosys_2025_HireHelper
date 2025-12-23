const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // Determine folder based on the route or fieldname
    const folder =
      file.fieldname === "picture" ? "task_images" : "profile_images";

    return {
      folder: folder, // Use task_images for task pictures
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `task_${Date.now()}`, // Unique filename
      resource_type: "image",
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB to match your frontend
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

module.exports = upload;
