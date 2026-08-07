"use client";

import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Camera, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { RegistrationSchemaType } from "@/lib/validations/registration.schema";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<RegistrationSchemaType>;
}

export function PersonalInformation({ form }: Props) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const gender = watch("gender");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La photo ne doit pas dépasser 5 Mo");
      return;
    }

    setValue("photo", file as any, { shouldValidate: true });
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const removePhoto = () => {
    setValue("photo", null as any, { shouldValidate: true });
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="form-section"
    >
      <div className="section-title">
        <span className="section-title-icon bg-gradient-to-br from-royal-600 to-royal-800">
          <User className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Informations personnelles</h2>
          <p className="text-xs text-gray-500 font-normal">Vos informations d'identité</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Photo */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              onClick={() => fileRef.current?.click()}
              className={cn(
                "w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden",
                "hover:border-royal-400 hover:bg-royal-50 transition-colors",
                photoPreview
                  ? "border-royal-400"
                  : errors.photo
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50",
              )}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px]">Photo</span>
                </div>
              )}
            </div>
            {photoPreview && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Photo <span className="required-star">*</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">JPG, PNG · Max 5 Mo</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs text-royal-600 hover:text-royal-800 font-medium mt-1"
            >
              Choisir une photo
            </button>
            {errors.photo && (
              <p className="text-xs text-red-500 mt-1">{errors.photo?.message as string}</p>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lastName" className="field-label">
              Nom <span className="required-star">*</span>
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Ex : Dupont"
              error={!!errors.lastName}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName?.message as string}</p>
            )}
          </div>
          <div>
            <Label htmlFor="firstName" className="field-label">
              Prénom <span className="required-star">*</span>
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Ex : Jean"
              error={!!errors.firstName}
              autoComplete="given-name"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName?.message as string}</p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div>
          <Label className="field-label">
            Sexe <span className="required-star">*</span>
          </Label>
          <RadioGroup
            value={gender}
            onValueChange={(v) => setValue("gender", v as "male" | "female")}
            className="flex gap-4 mt-2"
          >
            {[
              { value: "male", label: "Homme", emoji: "👨" },
              { value: "female", label: "Femme", emoji: "👩" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex-1",
                  gender === opt.value
                    ? "border-royal-500 bg-royal-50 text-royal-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600",
                )}
              >
                <RadioGroupItem value={opt.value} id={`gender-${opt.value}`} />
                <span className="text-lg">{opt.emoji}</span>
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
          {errors.gender && (
            <p className="text-xs text-red-500 mt-1">{errors.gender?.message as string}</p>
          )}
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="field-label">
              Téléphone <span className="required-star">*</span>
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+229 97 00 00 00"
              error={!!errors.phone}
              type="tel"
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone?.message as string}</p>
            )}
          </div>
          <div>
            <Label htmlFor="whatsapp" className="field-label">
              WhatsApp <span className="required-star">*</span>
            </Label>
            <Input
              id="whatsapp"
              {...register("whatsapp")}
              placeholder="+229 97 00 00 00"
              error={!!errors.whatsapp}
              type="tel"
            />
            {errors.whatsapp && (
              <p className="text-xs text-red-500 mt-1">{errors.whatsapp?.message as string}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="field-label">
            Adresse email <span className="required-star">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="jean.dupont@example.com"
            error={!!errors.email}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email?.message as string}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
