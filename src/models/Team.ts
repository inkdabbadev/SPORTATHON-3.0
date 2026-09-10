import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    owner: { type: String, required: true, trim: true, maxlength: 80 },
    city: { type: String, trim: true, maxlength: 80, default: "" },
    contact: { type: String, trim: true, maxlength: 30, default: "" },
    email: { type: String, trim: true, lowercase: true, maxlength: 120, default: "" },
    color: { type: String, required: true, default: "#19388A" },
    purse: { type: Number, required: true, min: 0, default: 10000 },
    photo: {
      data: { type: Buffer, default: null },
      contentType: { type: String, default: "" }
    },
    active: { type: Boolean, required: true, default: true }
  },
  { timestamps: true }
);

TeamSchema.index({ name: 1 }, { unique: true });
TeamSchema.index({ active: 1 });

export const Team = models.Team || model("Team", TeamSchema);
