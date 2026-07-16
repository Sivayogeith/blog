"use client";

import { editProfile, getMe, SessionData } from "@/src/api/authAPI";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export default function EditProfile() {
  const [session, setSession] = useState<SessionData>();
  const buttonRef = useRef<LoadingButtonElement>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ username }: EditProfileFormData) => {
    buttonRef.current?.setLoading(true);
    const result = await editProfile(username);
    buttonRef.current?.setLoading(false);

    if (result.status == 200) {
      toast.success(result.message + ", Please wait a second...",);
      window.location.href = "/";
      router.replace("/");
      return;
    }
    toast.error(result.message);
  };

  useEffect(() => {
    getMe().then((s) => {
      setValue("username", s.username, { shouldValidate: true });
      setSession(s);
    });
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-4">
      <h1 className="text-4xl font-bold mb-5">Edit Profile</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:p-10 p-6 h-full border border-secondary rounded-2xl flex justify-between flex-col lg:w-[40%] w-full"
      >
        <label htmlFor="username" className="text-lg font-semibold">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          id="username"
          disabled={!session?.username}
          placeholder={
            session?.username ? "Choose a username" : "Please wait a second.."
          }
        />
        <p className="error-msg">{errors.username?.message}</p>
        <LoadingButton ref={buttonRef} disabled={!isValid} />
        <p className="text-center mt-1">{errors.form?.message}</p>
      </form>
    </div>
  );
}

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(4, "username has to be atleast 4 chars!")
    .max(15, "username should be less then 15 chars!"),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
