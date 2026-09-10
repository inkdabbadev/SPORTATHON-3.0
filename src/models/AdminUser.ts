import { Schema, model, models } from "mongoose";

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true, default: "Admin" }
  },
  { timestamps: true }
);

export const AdminUser = models.AdminUser || model("AdminUser", AdminUserSchema);
