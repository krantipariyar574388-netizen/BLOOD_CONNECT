import cloudinary from "../config/cloudinary.config";

export const upload = async (file : Express.Multer.File, dir = "/") => {
    try {
        const folder = "blood_connect" + dir;
        const { secure_url : path, public_id } = await cloudinary.uploader.upload(
            file.path,
            {
                resource_type : "auto",
                unique_filename : true,
                folder,
            },
        );
        return {
            path,
            public_id,
        };
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
};