import { ChangeEventHandler, useState } from "react";
import { useDropzone } from "react-dropzone";
import EditIcon from "./icons/EditIcon";
import Image from "next/image";

export default function ProfileDropzone({
  onChange,
  src,
  accept,
  editMode = false,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  src: string;
  editMode?: boolean;
  accept?: string;
}) {
  const [image, setImage] = useState(src || "/default-user.png");
  const [uploaded, setUploaded] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false, 
    onDrop: (files) => {
      setUploaded(true);
      setImage(URL.createObjectURL(files[0]));
    },
  });

  return (
    <section className="relative">
      <div
        {...getRootProps({
          className:
            `absolute inset-0 z-10 rounded-full border border-secondary text-center cursor-pointer size-25 flex justify-center items-center group peer ${!editMode && "pointer-events-none"}`,
        })}
      >
        <input {...getInputProps({ onChange, accept })} />

        {isDragActive ? (
          <p className="text-sm">Drop the files here...</p>
        ) : (
          <EditIcon
            className={`size-10  ${(uploaded && editMode) && "group-hover:opacity-100 opacity-0"} ${!editMode && "opacity-0"}`}
          />
        )}
      </div>
      <Image
        src={image}
        alt={`Your Profile Picture`}
        width={128}
        height={128}
        loading="eager"
        unoptimized
        className={`rounded-full border dark:border-lighter border-dark size-25 ${(!uploaded || isDragActive) && editMode && "brightness-30"} ${editMode && "peer-hover:brightness-30"}`}
      />
    </section>
  );
}
