// import mongoose, { Schema, model, Document, Types } from 'mongoose';
// import { BloodGroup, RequestStatus } from '../@types/enum.types';

// export interface IBloodRequest extends Document {
//     requester : Types.ObjectId;
//     patientName  : string;
//     bloodGroup : BloodGroup;
//     unitsNeeded : number;
//     hospitalName : string;
//     district  : string;
//     contact : string;
//     profile_image? : string;
//     status : RequestStatus;
//     fulfilledBy? : Types.ObjectId | null;
// }

// const bloodRequestSchema = new mongoose.Schema<IBloodRequest>({
//     requester : {
//         type : Schema.Types.ObjectId,
//         ref : 'User',
//         required : true,
//     },
//     patientName: {
//         type: String,
//         required: true
//     },
//     bloodGroup: {
//       type: String,
//       enum: Object.values(BloodGroup),
//       required: true,
//     },
//     unitsNeeded: {
//         type: Number,
//         required: true,
//         min: 1
//     },
//     hospitalName: {
//         type: String,
//         required: true
//     },
//     district: {
//         type: String,
//         required: true,
//         index: true
//     },
//     contact: {
//         type: String,
//         required: true
//     },
//     profile_image: {
//       type: String,
//       default: "",
//     },
//     status: {
//       type: String,
//       enum: Object.values(RequestStatus),
//       default: RequestStatus.PENDING,
//     },
//     fulfilledBy: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         default: null
//     },
//   },
//   { timestamps: true }
// );

// export const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', bloodRequestSchema);