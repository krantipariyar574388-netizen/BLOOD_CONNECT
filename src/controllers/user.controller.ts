import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { AppError } from "../utils/customError.util";
import { cathAsync } from "../utils/catchAsync.util";
import { upload } from "../utils/cloudinary.util";
import { sendResponse } from "../utils/sendResponse.util";

export const register = cathAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      email,
      password,
      phone,
      bloodGroup,
      district,
      role,
      lastDonationDate,
    } = req.body;

    const file = req.file;

    if (!name) throw new AppError("Name is required", 400);
    if (!email) throw new AppError("Email is required", 400);
    if (!password) throw new AppError("Password is required", 400);
    if (!phone) throw new AppError("Phone number is required", 400);
    if (!bloodGroup) throw new AppError("Blood group is required", 400);
    if (!district) throw new AppError("District is required", 400);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const formattedDonationDate = lastDonationDate
      ? new Date(lastDonationDate)
      : null;

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      bloodGroup: bloodGroup.trim().toUpperCase(),
      district,
      role: role || "donor",
      lastDonationDate: formattedDonationDate,
    });

    if (file) {
      const {path, public_id} = await upload(file,"/profile_images");
      newUser.profile_image = {
        path : path,
        public_id : public_id,
      };
    }

    await newUser.save();

    sendResponse(res, {
      statusCode: 201,
      message: "User registered successfully!",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        bloodGroup: newUser.bloodGroup,
        district: newUser.district,
        role: newUser.role,
        profile_image: newUser.profile_image,
        lastDonationDate: newUser.lastDonationDate,
        isAvailable: newUser.isAvailable,
      },
    });
  }
);

export const login = cathAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email) throw new AppError("Email is required", 400);
    if (!password) throw new AppError("Password is required", 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new AppError("Invalid credentials", 400);

    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) throw new AppError("Invalid credentials", 400);

    sendResponse(res, {
      statusCode: 200,
      message: "Logged in successfully!",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        district: user.district,
        role: user.role,
        profile_image: user.profile_image,
        isAvailable: user.isAvailable,
      },
    });
  }
);

export const getEligibleDonors = cathAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bloodGroup, district } = req.query;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    let filter: any = {
      role: "donor",
      isAvailable: true,
      $or: [
        { lastDonationDate: { $exists: false } },
        { lastDonationDate: null },
        { lastDonationDate: { $lte: ninetyDaysAgo } },
      ],
    };

    if (bloodGroup) {
      filter.bloodGroup = String(bloodGroup).trim().toUpperCase();
    }

    if (district) {
      filter.district = new RegExp(String(district).trim(), "i");
    }

    const donors = await User.find(filter).select("-password");

    sendResponse(res, {
      statusCode: 200,
      message: donors.length > 0 
        ? "Eligible donors fetched successfully" 
        : "No eligible donors found matching your criteria",
      data: donors,
    });
  }
);