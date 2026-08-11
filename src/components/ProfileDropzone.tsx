import { ChangeEventHandler, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import EditIcon from "./icons/EditIcon";
import Image from "next/image";

export default function ProfileDropzone({
  onChange,
  src,
  accept,
  editMode = false,
  size = 128,
  sectionClass,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  src: string;
  editMode?: boolean;
  accept?: string;
  size?: number;
  sectionClass?: string;
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

  useEffect(() => {
    if (src !== image) {
      setUploaded(true);
      setImage(src);
    }
  }, [src]);

  return (
    <section className={`relative ${sectionClass}`}>
      <div
        {...getRootProps({
          className: `absolute z-10 rounded-full border border-secondary text-center cursor-pointer flex justify-center items-center group peer ${!editMode && "pointer-events-none"}`,
          style: { width: size, height: size },
        })}
      >
        <input {...getInputProps({ onChange, accept })} />

        {isDragActive ? (
          <p className="text-sm">Drop the files here...</p>
        ) : (
          <EditIcon
            className={`size-10  ${uploaded && editMode && "group-hover:opacity-100 opacity-0"} ${!editMode && "opacity-0"}`}
          />
        )}
      </div>
      <Image
        src={image}
        alt={`Your Profile Picture`}
        width={size}
        height={size}
        loading="eager"
        unoptimized
        className={`rounded-full border dark:border-lighter border-dark ${(!uploaded || isDragActive) && editMode && "brightness-30"} ${editMode && "peer-hover:brightness-30"}`}
      />
    </section>
  );
}
