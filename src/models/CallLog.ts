import { Schema, model } from 'mongoose'

const CallLogSchema = new Schema(
  {
    callId:       { type: String, required: true, unique: true },
    phone:        { type: String, default: 'unknown' },
    durationSecs: { type: Number, default: 0 },
    summary:      { type: String },
    transcript:   { type: Schema.Types.Mixed }, // Raw Vapi transcript array
    sentiment: {
      type: String,
      enum: ['interested', 'not_interested', 'emergency', 'unknown'],
      default: 'unknown',
    },
    status: { type: String },
    endedAt: { type: Date },
  },
  { timestamps: true }
)

export const CallLog = model('CallLog', CallLogSchema)
