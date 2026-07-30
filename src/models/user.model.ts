import mongoose, { Document } from "mongoose";
import { BloodGroup, UserRole } from "../@types/enum.types";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  bloodGroup: BloodGroup;
  district: string;
  role: UserRole;
  profile_image?: string;
  lastDonationDate?: Date | null;
  isAvailable: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: Object.values(BloodGroup),
      required: true,
    },
    district: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.DONOR,
    },
    profile_image: {
      type: String,
      default: "",
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", userSchema);
