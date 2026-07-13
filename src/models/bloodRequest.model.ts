import mongoose, { Schema, model, Document, Types } from 'mongoose';
import { BloodGroup, RequestUrgency, RequestStatus } from '../@types/enum.types';

export interface IBloodRequest extends Document {
    requester : Types.ObjectId;
    patient  : string;
    bloodGroup : BloodGroup;
    units : number;
    hospital : string;
    district  : string;
    phone : string;
    profile_image? : string;
    urgency: RequestUrgency;
    status : RequestStatus;
    fulfilledBy? : Types.ObjectId | null;
}

const bloodRequestSchema = new mongoose.Schema<IBloodRequest>({
    requester : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    patient: {
        type: String,
        required: true
    },
    bloodGroup: {
      type: String,
      enum: Object.values(BloodGroup),
      required: true,
    },
    units: {
        type: Number,
        required: true,
        min: 1
    },
    hospital: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true,
        index: true
    },
    phone: {
        type: String,
        required: true
    },
    profile_image: {
      type: String,
      default: "",
    },
    urgency: {
      type: String,
      enum: Object.values(RequestUrgency),
      default: RequestUrgency.MEDIUM, 
    },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING,
    },
    fulfilledBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
  },
  { timestamps: true }
);

export const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', bloodRequestSchema);