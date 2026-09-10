"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  BATSMAN_STYLES,
  BOWLER_STYLES,
  PACE_BOWLER_STYLES,
  PLAYER_CATEGORIES,
  PLAYER_GENDERS,
  REGISTRATION_TYPES,
  SPIN_BOWLER_STYLES,
  type PlayerCategory
} from "@/types/domain";

type FormState = {
  ok?: string;
  error?: string;
};

function resizeImageFile(file: File, maxDim: number, quality: number) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width >= height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = String(event.target?.result || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function RegisterPlayerForm() {
  const [category, setCategory] = useState<PlayerCategory | "">("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [state, setState] = useState<FormState>({});
  const [submitting, setSubmitting] = useState(false);

  const showBatsmanStyle = category === "Batsman" || category === "All Rounder";
  const showBowlerStyle = category === "Fast Bowler" || category === "Spinner" || category === "All Rounder";

  const bowlerOptions = useMemo(() => {
    if (category === "Fast Bowler") return PACE_BOWLER_STYLES;
    if (category === "Spinner") return SPIN_BOWLER_STYLES;
    if (category === "All Rounder") return BOWLER_STYLES;
    return [];
  }, [category]);

  async function handlePhoto(file?: File) {
    setState({});
    if (!file) {
      setPhotoPreview("");
      setPhotoDataUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setState({ error: "Please upload an image file." });
      return;
    }

    const resized = await resizeImageFile(file, 360, 0.72);
    setPhotoPreview(resized);
    setPhotoDataUrl(resized);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setState({});

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      age: data.get("age"),
      gender: data.get("gender"),
      registeringAs: data.get("registeringAs"),
      reference: data.get("reference"),
      category: data.get("category"),
      batsmanStyle: showBatsmanStyle ? data.get("batsmanStyle") : "",
      bowlerStyle: showBowlerStyle ? data.get("bowlerStyle") : "",
      contact: data.get("contact"),
      photoDataUrl
    };

    const response = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setState({ error: result.error || "Could not register right now." });
      return;
    }

    form.reset();
    setCategory("");
    setPhotoPreview("");
    setPhotoDataUrl("");
    setState({ ok: `${result.player.name} is registered.` });
  }

  return (
    <form onSubmit={submit}>
      {state.ok ? <div className="msg ok">{state.ok}</div> : null}
      {state.error ? <div className="msg err">{state.error}</div> : null}

      <div className="row2">
        <div className="field">
          <label htmlFor="name">Full name *</label>
          <input id="name" name="name" required maxLength={80} type="text" />
        </div>
        <div className="field">
          <label htmlFor="age">Age *</label>
          <input id="age" name="age" max={100} min={10} required type="number" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="gender">Gender *</label>
          <select id="gender" name="gender" required>
            <option value="">Select gender</option>
            {PLAYER_GENDERS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <span className="field-label">Registering as a: *</span>
          <div className="choice-row" role="radiogroup" aria-label="Registering as a">
            {REGISTRATION_TYPES.map((item) => (
              <label className="choice-option" key={item}>
                <input name="registeringAs" required type="radio" value={item} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          onChange={(event) => setCategory(event.target.value as PlayerCategory | "")}
          required
          value={category}
        >
          <option value="">Select category</option>
          {PLAYER_CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className={`field conditional-field ${showBatsmanStyle ? "" : "is-hidden"}`}>
        <label htmlFor="batsmanStyle">Batsman style *</label>
        <select disabled={!showBatsmanStyle} id="batsmanStyle" name="batsmanStyle" required={showBatsmanStyle}>
          <option value="">-</option>
          {BATSMAN_STYLES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className={`field conditional-field ${showBowlerStyle ? "" : "is-hidden"}`}>
        <label htmlFor="bowlerStyle">Fast Bowler / Spinner style *</label>
        <select disabled={!showBowlerStyle} id="bowlerStyle" key={category} name="bowlerStyle" required={showBowlerStyle}>
          <option value="">-</option>
          {bowlerOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="contact">Contact number *</label>
          <input id="contact" name="contact" required maxLength={30} type="tel" />
        </div>
        <div className="field">
          <label htmlFor="reference">Reference *</label>
          <input id="reference" name="reference" required maxLength={80} type="text" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="photo">Player photo (optional)</label>
        <div className="photo-picker">
          <div className="photo-preview">
            {photoPreview ? <img src={photoPreview} alt="" /> : <span className="hint">No photo</span>}
          </div>
          <div>
            <input id="photo" accept="image/*" type="file" onChange={(event) => handlePhoto(event.target.files?.[0])} />
            <div className="hint">Shown on your player profile.</div>
          </div>
        </div>
      </div>

      <button className="btn" disabled={submitting} type="submit">
        {submitting ? "Registering..." : "Register player"}
      </button>
    </form>
  );
}
