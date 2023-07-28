// Contact.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  phoneNumber: string;
  email: string;
  linkedId: string | null;
  linkPrecedence: "primary" | "secondary";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const ContactSchema = new Schema<IContact>({
  phoneNumber: { type: String, required: false },
  email: { type: String, required: false },
  linkedId: { type: String, required: false, default: null },
  linkPrecedence: {
    type: String,
    enum: ["primary", "secondary"],
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  deletedAt: { type: Date, required: false, default: null },
});

const Contact = mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
