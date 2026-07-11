import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { catchAsync } from '../utils/catchAsync.util';
import { sendResponse } from '../utils/sendResponse.util';
import { CustomError } from '../utils/customError.util';
import { User } from '../models/user.model';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, phone, bloodGroup, district, role, lastDonationDate } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError('User with this email already exists', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const formattedDonationDate = lastDonationDate ? new Date(lastDonationDate) : null;

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    bloodGroup,
    district,
    role,
    lastDonationDate: formattedDonationDate,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      bloodGroup: newUser.bloodGroup,
      district: newUser.district,
      role: newUser.role,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new CustomError('Invalid email or password', 401);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful!',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodGroup: user.bloodGroup,
      district: user.district,
      phone: user.phone,
    },
  });
});

export const getEligibleDonors = catchAsync(async (req: Request, res: Response) => {
  const { bloodGroup, district } = req.query;

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  let filter: any = {
    role: 'donor',
    $or: [
      { lastDonationDate: { $exists: false } },
      { lastDonationDate: null },
      { lastDonationDate: { $lte: ninetyDaysAgo } }
    ]
  };

  if (bloodGroup) {
    filter.bloodGroup = String(bloodGroup).trim().toUpperCase();
  }

  if (district) {
    filter.district = String(district).trim();
  }

  const donors = await User.find(filter).select('-password');

  const hasDonors = donors.length > 0;
  
  let dynamicMessage = 'Eligible donors fetched successfully';
  if (!hasDonors) {
    dynamicMessage = district 
      ? `No eligible donors found in ${district}` 
      : 'No eligible donors found matching your criteria';
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: dynamicMessage,
    data: donors,
  });
});