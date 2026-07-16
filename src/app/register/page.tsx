"use client";

import { register as registerUser } from "@/src/api/authAPI";
import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Register() {
  const router = useRouter();
  const buttonRef = useRef<LoadingButtonElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ username, password }: RegisterFormData) => {
    buttonRef.current?.setLoading(true);
    const result = await registerUser(username, password);
    buttonRef.current?.setLoading(false);

    if (result.status == 200) {
      toast.success(result.message + ", Please wait a second...");
      window.location.href = "/";
      router.replace("/");
      return;
    }
    toast.error(result.message);
  };

  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center px-4">
        <h1 className="text-5xl font-bold mb-10">Register</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:p-10 p-6 border border-secondary rounded-2xl lg:w-[40%] w-full mb-5"
        >
          <label htmlFor="username" className="text-lg font-semibold mb-2">
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            placeholder="Choose a username"
            autoComplete="username"
            min="4"
          />
          <p className="error-msg">{errors.username?.message}</p>

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
          <p className="text-center mt-2">{errors.form?.message}</p>
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
    password: z.string().min(8, "password has to be atleast 8 chars!"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "passwords should match!",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
