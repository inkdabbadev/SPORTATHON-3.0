import { Schema, model, models } from "mongoose";
import {
  BATSMAN_STYLES,
  BOWLER_STYLES,
  PLAYER_CATEGORIES,
  PLAYER_GENDERS,
  PLAYER_STATUSES,
  REGISTRATION_TYPES
} from "../types/domain";

const PlayerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    age: { type: Number, required: true, min: 10, max: 100 },
    gender: { type: String, required: true, enum: PLAYER_GENDERS },
    registeringAs: { type: String, required: true, enum: REGISTRATION_TYPES },
    reference: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, required: true, enum: PLAYER_CATEGORIES },
    batsmanStyle: { type: String, enum: ["", ...BATSMAN_STYLES], default: "" },
    bowlerStyle: { type: String, enum: ["", ...BOWLER_STYLES], default: "" },
    contact: { type: String, required: true, trim: true, maxlength: 30 },
    photo: {
      data: { type: Buffer, default: null },
      contentType: { type: String, default: "" }
    },
    status: { type: String, required: true, enum: PLAYER_STATUSES, default: "unsold" },
    soldTo: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    soldPrice: { type: Number, min: 0, default: null },
    basePrice: { type: Number, min: 0, default: 100 }
  },
  { timestamps: true }
);

PlayerSchema.index({ name: 1 });
PlayerSchema.index({ category: 1 });
PlayerSchema.index({ status: 1 });

export const Player = models.Player || model("Player", PlayerSchema);
