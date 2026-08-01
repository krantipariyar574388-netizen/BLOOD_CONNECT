import { Request, Response, NextFunction } from "express";
import { BloodRequest } from "../models/bloodRequest.model";
import { RequestUrgency, RequestStatus } from "../@types/enum.types";
import { AppError } from "../utils/customError.util";
import { cathAsync } from "../utils/catchAsync.util";
import { sendResponse } from "../utils/sendResponse.util";
import { upload } from "../utils/cloudinary.util";

export const createBloodRequest = cathAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      patient,
      bloodGroup,
      units,
      hospital,
      district,
      phone,
      requiredDate,
      urgency,
      requester,
    } = req.body;

    const file = req.file;
    console.log(file);

    if (!patient) throw new AppError("Patient name is required", 400);
    if (!bloodGroup) throw new AppError("Blood group is required", 400);
    if (!units) throw new AppError("Units required is required", 400);
    if (!hospital) throw new AppError("Hospital name is required", 400);
    if (!district) throw new AppError("District is required", 400);
    if (!phone) throw new AppError("Contact phone number is required", 400);
    if (!requester) throw new AppError("Requester ID is required", 400);

    if (!file) {
      throw new AppError("Medical document / prescription image is required", 400);
    }

    const existingPendingRequest = await BloodRequest.findOne({
      requester,
      patient: patient.trim(),
      hospital: hospital.trim(),
      status: RequestStatus.PENDING,
    });

    if (existingPendingRequest) {
      throw new AppError(
        "A pending blood request for this patient at this hospital already exists!",
        400
      );
    }

    const newRequest = new BloodRequest({
      patient,
      bloodGroup: bloodGroup.trim().toUpperCase(),
      units: Number(units),
      hospital,
      district,
      phone,
      requiredDate: requiredDate ? new Date(requiredDate) : new Date(),
      urgency: urgency || RequestUrgency.MEDIUM,
      requester,
      status: RequestStatus.PENDING,
      medicalDocument: {
        path : "",
        public_id : ""
      },
    });

    if (file) {
      const { path, public_id } = await upload(file, "/medical_document");
      newRequest.medicalDocument = {
        path : path,
        public_id : public_id,
      };
    }

    await newRequest.save();

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Blood request created successfully with medical document!",
      data: newRequest,
    });
  }
);

export const getAllBloodRequests = cathAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bloodGroup, district, status, urgency } = req.query;

    let filter: any = {};

    if (bloodGroup) {
      filter.bloodGroup = String(bloodGroup).trim().toUpperCase();
    }

    if (district) {
      filter.district = new RegExp(String(district).trim(), "i");
    }

    if (status) {
      filter.status = status;
    } else {
      filter.status = RequestStatus.PENDING; 
    }

    if (urgency) {
      filter.urgency = urgency;
    }

    const requests = await BloodRequest.find(filter)
      .populate("requester", "name email phone")
      .sort({ createdAt: -1 });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: requests.length > 0
        ? "Blood requests fetched successfully"
        : "No blood requests found",
      data: requests,
    });
  }
);

export const getBloodRequestById = cathAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const request = await BloodRequest.findById(id).populate(
      "requester",
      "name email phone"
    );

    if (!request) {
      throw new AppError("Blood request not found", 404);
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Blood request details fetched successfully",
      data: request,
    });
  }
);

export const updateBloodRequestStatus = cathAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) throw new AppError("Status is required to update", 400);

    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      throw new AppError("Blood request not found", 404);
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Blood request status updated to ${status}!`,
      data: updatedRequest,
    });
  }
);

export const deleteBloodRequest = cathAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedRequest = await BloodRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      throw new AppError("Blood request not found", 404);
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Blood request deleted successfully!",
      data: null,
    });
  }
);