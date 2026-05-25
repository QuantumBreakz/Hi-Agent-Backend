import { Schema, model } from 'mongoose'

const ContactFormSchema = new Schema(
  {
    name:         { type: String, required: true },
    businessName: { type: String },
    email:        { type: String, required: true },
    phone:        { type: String },
    message:      { type: String },
  },
  { timestamps: true }
)

export const ContactForm = model('ContactForm', ContactFormSchema)
