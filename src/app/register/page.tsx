"use client";

import { register as registerUser } from "@/src/api/authAPI";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import ProfileDropzone from "@/src/components/ProfileDropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { PFP_ACCEPTED_TYPES } from "../profile/page";
import { upload } from "@/src/api/adminAPI";

export default function Register() {
  const router = useRouter();
  const buttonRef = useRef<LoadingButtonElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({
    username,
    name,
    password,
    image,
    imageUrl,
  }: RegisterFormData) => {
    buttonRef.current?.setLoading(true);

    if (image?.[0]) {
      const formData = new FormData();
      formData.append("file", image[0]);
      await toast
        .promise(upload(formData), {
          loading: "Uploading...",
          success: (data) => {
            imageUrl = data?.url;
            return {
              type: data.error ? "error" : "success",
              message: data.error
                ? data.error
                : "Uploaded your Profile Picture!",
            };
          },
        })
        .unwrap();
    }
    const result = await registerUser(username, name, password, imageUrl);
    buttonRef.current?.setLoading(false);

    if (result.status == 200) {
      toast.success(result.message + ", Please wait a second...");
      window.location.href = "/";
      router.replace("/");
      return;
    }
    toast.error(result.message);
  };

  const onPreview = async () => {
    setValue("image", null);
    const image_url = getValues("imageUrl");
    setImageUrl(image_url);
  };

  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center px-4">
        <h1 className="text-5xl font-bold mb-10">Register</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:p-10 p-6 border border-secondary rounded-2xl lg:w-[50%] w-full mb-5"
        >
          <div className="flex md:flex-row flex-col md:justify-between justify-center items-start gap-5">
            <div className="flex flex-col md:w-[60%] w-full">
              <label htmlFor="username" className="text-lg font-semibold mb-2">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                id="username"
                placeholder="Choose a username"
                autoComplete="username"
              />
              <p className="error-msg">{errors.username?.message}</p>

              <label htmlFor="name" className="text-lg font-semibold mt-5 mb-2">
                Display Name
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                placeholder="Choose a display name"
                autoComplete="name"
              />
              <p className="error-msg">{errors.name?.message}</p>
            </div>
            <div className="flex flex-col md:w-[40%] w-full justify-center items-center px-5 text-center">
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange } }) => (
                  <ProfileDropzone
                    src={imageUrl || "/default-user.png"}
                    sectionClass="mt-5"
                    size={175}
                    accept={PFP_ACCEPTED_TYPES.join(",")}
                    editMode={true}
                    onChange={async (e) => {
                      setValue("imageUrl", "");
                      onChange(e.target.files);
                      await trigger("image");
                    }}
                  />
                )}
              />
              <div className="flex gap-1 items-center [&_hr]:w-full [&_hr]:text-secondary my-2">
                <hr /> or <hr />
              </div>

              <div className="flex gap-2">
                <input
                  {...register("imageUrl")}
                  placeholder="Enter a Image Url"
                />
                <button
                  className="px-2 py-0"
                  type="button"
                  onClick={onPreview}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          <label htmlFor="password" className="text-lg font-semibold mt-5 mb-2">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            placeholder="Set your password"
            autoComplete="current-password"
            onBlur={() => trigger(["confirmPassword", "password"])}
          />
          <p className="error-msg">{errors.password?.message}</p>

          <label
            htmlFor="confirmPassword"
            className="text-lg font-semibold mt-5 mb-2"
          >
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            autoComplete="current-password"
            onBlur={() => trigger(["confirmPassword", "password"])}
          />
          <p className="error-msg">{errors.confirmPassword?.message}</p>

          <LoadingButton ref={buttonRef} disabled={!isValid} />
          <a
            className="dark:text-light text-dark text-center mt-2"
            href="/login"
          >
            Already have an account? Login!
          </a>
          <p className="text-center error-msg mt-5">{errors.image?.message}</p>
        </form>
      </div>
    </>
  );
}

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, "username has to be atleast 4 chars!")
      .max(15, "username should be less then 15 chars!"),
    name: z
      .string()
      .min(4, "display name has to be atleast 4 chars!")
      .max(15, "display name should be less then 15 chars!"),
    password: z.string().min(8, "password has to be atleast 8 chars!"),
    confirmPassword: z.string(),
    imageUrl: z.string(),
    image: z
      .custom<FileList | null | undefined>()
      .refine(
        (files) =>
          !files ||
          !(files[0] instanceof File) ||
          files[0].size <= 10 * 1024 * 1024,
        { message: "max file size is 10 MB!" },
      )
      .refine(
        (files) =>
          !files ||
          !(files[0] instanceof File) ||
          PFP_ACCEPTED_TYPES.includes(files[0].type),
        { message: "only .jpeg, .png and .webp files are allowed!" },
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "passwords should match!",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
