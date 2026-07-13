"use client";
import { useRef } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "nextjs-toploader/app";

import LoadingButton, {
  LoadingButtonElement,
} from "@/src/components/LoadingButton";
import { login } from "../../api/authAPI";

export default function Login() {
  const router = useRouter();
  const buttonRef = useRef<LoadingButtonElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ username, password }: LoginFormData) => {
    buttonRef.current?.setLoading(true);
    const result = await login(username, password);
    buttonRef.current?.setLoading(false);
    setError("form", { message: result.message });

    if (result.status == 200) {
      setError("form", {
        message: result.message + ", Please wait a second...",
      });
      window.location.href = "/";
      router.replace("/");
    }
  };

  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center px-4">
        <h1 className="text-5xl font-bold mb-10">Login</h1>
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
            placeholder="Enter your username"
            autoComplete="username"
          />
          <p className="error-msg">{errors.username?.message}</p>

          <label htmlFor="password" className="text-lg font-semibold mt-5 mb-2">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <p className="error-msg">{errors.password?.message}</p>

          <LoadingButton ref={buttonRef} disabled={!isValid} />
          <p className="text-center mt-2">{errors.form?.message}</p>
        </form>
      </div>
    </>
  );
}

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, "username has to be atleast 4 chars!")
    .max(15, "username should be less then 15 chars!"),
  password: z.string().min(8, "password has to be atleast 8 chars!"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
