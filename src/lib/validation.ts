import { z } from "zod";
import {
  BATSMAN_STYLES,
  BOWLER_STYLES,
  PLAYER_CATEGORIES,
  PLAYER_GENDERS,
  PLAYER_STATUSES,
  REGISTRATION_TYPES
} from "@/types/domain";

const requiredText = (label: string, max = 120) =>
  z.string().trim().min(1, `${label} is required.`).max(max);

const requiredNumber = (label: string, min: number, max: number) =>
  z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z
      .number({
        required_error: `${label} is required.`,
        invalid_type_error: `${label} must be a valid number.`
      })
      .min(min, `${label} must be at least ${min}.`)
      .max(max, `${label} must be ${max} or less.`)
  );

const optionalText = (max = 120) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || "");

const optionalId = z
  .string()
  .trim()
  .max(40)
  .optional()
  .transform((value) => value || undefined);

const photoDataUrl = z
  .string()
  .max(750_000, "Photo is too large.")
  .refine(
    (value) => !value || /^data:image\/(jpeg|jpg|png|webp);base64,/.test(value),
    "Photo must be a jpeg, png, or webp data URL."
  )
  .optional()
  .transform((value) => value || "");

export const playerSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required.").max(80),
    age: requiredNumber("Age", 10, 100),
    gender: z.enum(PLAYER_GENDERS, {
      required_error: "Gender is required.",
      invalid_type_error: "Gender is required."
    }),
    registeringAs: z.enum(REGISTRATION_TYPES, {
      required_error: "Registering as is required.",
      invalid_type_error: "Registering as is required."
    }),
    reference: requiredText("Reference", 80),
    category: z.enum(PLAYER_CATEGORIES),
    batsmanStyle: z.enum(["", ...BATSMAN_STYLES]).optional().default(""),
    bowlerStyle: z.enum(["", ...BOWLER_STYLES]).optional().default(""),
    contact: z.string().trim().min(5, "Contact number is required.").max(30),
    photoDataUrl,
    status: z.enum(PLAYER_STATUSES).optional().default("unsold"),
    soldTo: optionalId,
    soldPrice: z.coerce
      .number()
      .min(0)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    basePrice: z.coerce.number().min(0).optional().default(100)
  })
  .superRefine((data, ctx) => {
    const needsBatting = data.category === "Batsman" || data.category === "All Rounder";
    const needsBowling =
      data.category === "Fast Bowler" ||
      data.category === "Spinner" ||
      data.category === "All Rounder";

    if (!needsBatting) data.batsmanStyle = "";
    if (!needsBowling) data.bowlerStyle = "";

    if (needsBatting && !data.batsmanStyle) {
      ctx.addIssue({
        code: "custom",
        path: ["batsmanStyle"],
        message: "Batsman style is required."
      });
    }

    if (needsBowling && !data.bowlerStyle) {
      ctx.addIssue({
        code: "custom",
        path: ["bowlerStyle"],
        message: "Bowling style is required."
      });
    }

    if (data.category === "Fast Bowler" && data.bowlerStyle?.includes("spin")) {
      ctx.addIssue({
        code: "custom",
        path: ["bowlerStyle"],
        message: "Fast bowlers must use a pace style."
      });
    }

    if (data.category === "Spinner" && data.bowlerStyle?.includes("pace")) {
      ctx.addIssue({
        code: "custom",
        path: ["bowlerStyle"],
        message: "Spinners must use a spin style."
      });
    }
  });

export const teamSchema = z.object({
  name: z.string().trim().min(2, "Team name is required.").max(80),
  owner: z.string().trim().min(2, "Owner/captain is required.").max(80),
  city: optionalText(80),
  contact: optionalText(30),
  email: z.string().trim().email().optional().or(z.literal("").transform(() => "")),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Choose a valid color.").default("#19388A"),
  purse: z.coerce.number().min(0).default(10000),
  photoDataUrl,
  active: z.coerce.boolean().optional().default(true)
});

export const eventSettingsSchema = z.object({
  name: z.string().trim().min(2).max(80).default("SPORTATHON 3.0"),
  tagline: z.string().trim().min(2).max(120).default("Player registration"),
  logoPath: z.string().trim().min(1).max(200).default("/logo.png"),
  defaultPurse: z.coerce.number().min(0).default(10000)
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});
