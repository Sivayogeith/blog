"use client";

import { editProfile, getMe } from "@/src/api/authAPI";
import { User } from "@/src/api/helper";
import { getUser, upload } from "@/src/api/userAPI";
import EditIcon from "@/src/components/icons/EditIcon";
import Spinner from "@/src/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import ProfileDropzone from "@/src/components/ProfileDropzone";
import z from "zod";

export default function Profile() {
  const [user, setUser] = useState(
    {} as Omit<Omit<User, "isAdmin">, "isOwner">,
  );
  const [edit, setEdit] = useState(false);

  const {
    register,
    getValues,
    control,
    setValues,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onTouched",
  });

  const onSubmit = async () => {
    let { username, name, image, imageUrl }: EditProfileFormData = getValues();
    trigger();

    if (!isValid) {
      console.log(errors);
      toast.error(
        String(
          (Object.values(errors).find((e: any) => e?.message != null) as any)
            ?.message ?? "Something went wrong....",
        ),
      );
      return;
    }

    if (image?.[0]) {
      const formData = new FormData();
      formData.append("file", image[0]);
      await toast
        .promise(upload(formData), {
          loading: "Uploading Image...",
          success: (data) => {
            if (data.error) {
              return { type: "error", message: data.error };
            }
            imageUrl = data.url;
            return { type: "success", message: "Successfully uploaded!" };
          },
        })
        .unwrap();
    }

    toast.promise(editProfile(username, name, imageUrl), {
      loading: "Saving...",
      success: ({ message, status }) => {
        return { type: status == 200 ? "success" : "error", message };
      },
    });

    setEdit(false);
    setUser({ username, name, image: user.image });
  };

  const onPreview = async () => {
    setUser({ ...user, image: getValues("imageUrl")})
    setValue("image", null)
  }

  useEffect(() => {
    getMe().then((s) =>
      getUser(s.username).then((u) => {
        setUser(u);
        setValues({ username: u.username, name: u.name, imageUrl: u.image });
      }),
    );
  }, []);

  return (
    <div className="flex justify-center px-2">
      <div
        className={`border-[0.5] border-secondary md:w-[70%] w-full h-[88dvh] pt-10 mt-6 md:px-15 px-5 rounded-sm flex flex-col items-center lg:block ${!user.username && "flex! justify-center items-center pt-0"}`}
      >
        {user.username ? (
          <>
            <div className="flex lg:flex-row flex-col pb-8 w-full justify-between">
              <form className="flex gap-5 lg:flex-row flex-col text-center">
                <div className="flex flex-col gap-2 items-center">
                  <Controller
                    control={control}
                    name="image"
                    render={({ field: { onChange } }) => (
                      <ProfileDropzone
                        onChange={async (e) => {
                          setUser({...user, image: ""})
                          onChange(e.target.files);
                          await trigger("image");
                        }}
                        src={user.image || "/default-user.png"}
                        editMode={edit}
                        accept={PFP_ACCEPTED_TYPES.join(",")}
                        sectionClass="lg:contents flex justify-center"
                      />
                    )}
                  />
                  {edit && (
                    <>
                      or
                      <div className="flex gap-1">
                        <input
                          {...register("imageUrl")}
                          className="py-0!"
                          placeholder="Enter a Image Url"
                        />
                        <button className="p-1" onClick={onPreview} type="button">
                          Preview
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2 flex flex-col text-start">
                  {edit ? (
                    <>
                      <input
                        {...register("name")}
                        className="py-0! mb-2 text-3xl"
                      />
                      <input
                        {...register("username")}
                        className="py-0! text-xl"
                      />
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl">{user.name}</h1>
                      <p className="text-xl opacity-75">@{user.username}</p>
                    </>
                  )}
                </div>
              </form>
              <button
                className="opacity-85 lg:pt-2 flex gap-1 items-center h-min hover:dark:text-lightest hover:text-dark text-lg lg:w-auto w-full mt-6 p-2 lg:border-0 justify-center"
                onClick={() => (edit ? onSubmit() : setEdit(true))}
              >
                {edit ? (
                  "save"
                ) : (
                  <>
                    <EditIcon /> edit
                  </>
                )}
              </button>
            </div>
            <div className="border-[0.5] border-secondary w-full flex h-20 rounded-sm justify-between px-5 items-center">
              <div className="flex gap-2 items-center">
                <img
                  src="https://assets.hackclub.com/icon-square.svg"
                  className="size-10 rounded-sm"
                />
                <div>
                  <p className="text-lg">Hack Club Auth</p>
                  <p className="text-sm opacity-80">Not Connected</p>
                </div>
              </div>
              <button
                className="p-1"
                onClick={() =>
                  alert(
                    "sorry! hackclub auth is WIP - check for updates: #sage-meows",
                  )
                }
              >
                Connect
              </button>
            </div>
          </>
        ) : (
          <Spinner size={128} />
        )}
      </div>
    </div>
  );
}

export const PFP_ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(4, "username has to be atleast 4 chars!")
    .max(15, "username should be less then 15 chars!"),
  name: z
    .string()
    .min(4, "display name has to be atleast 4 chars!")
    .max(15, "display name should be less then 15 chars!"),
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
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;