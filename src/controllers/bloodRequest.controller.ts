import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.util';
import { sendResponse } from '../utils/sendResponse.util';
import { CustomError } from '../utils/customError.util';
import { BloodRequest } from '../models/bloodRequest.model';
import { User } from '../models/user.model';
import { RequestStatus } from '../@types/enum.types';

export const createBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const { patientName, bloodGroup, unitsNeeded, hospitalName, district, contactNumber, requesterId } = req.body;

  const newRequest = await BloodRequest.create({
    requester: requesterId,
    patientName,
    bloodGroup,
    unitsNeeded,
    hospitalName,
    district,
    contact: contactNumber,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Urgent Blood Request posted successfully!',
    data: newRequest,
  });
});

export const getActiveRequests = catchAsync(async (req: Request, res: Response) => {
  const { bloodGroup, district, status } = req.query;

  let filter: any = { };

  if (status) {
    filter.status = new RegExp(`^${status}$`, 'i'); // Case-insensitive exact match
  }

  if (bloodGroup) filter.bloodGroup = bloodGroup;
  
  if (district) {
    filter.district = new RegExp(district as string, 'i');
  }

  const request = await BloodRequest.find(filter)
    .populate('requester', 'name phone email')
    .sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Active blood requests fetched successfully',
    data: request,
  });
});

export const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, donorId } = req.body;

  const request = await BloodRequest.findById(id);

  if (!request) {
    throw new CustomError('Blood Request not found', 404);
  }

  request.status = status;

  if (status === RequestStatus.FULFILLED && donorId) {
    request.fulfilledBy = donorId;
    
    await User.findByIdAndUpdate(donorId, {
      lastDonationDate: new Date(),
    });
  }

  await request.save();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Request status successfully updated to ${status}`,
    data: request,
  });
});