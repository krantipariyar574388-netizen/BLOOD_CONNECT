import mongoose from "mongoose";
export const ImageSchema  =new mongoose.Schema(
    {
        path : {
            type : String,
            required : [true, "Image path is requires!!"],
        },
        public_id : {
            type : String,
            required : [true, "Image public_id is requires!!"],
        },
    },
    { _id : false },
);