import { ChangeEventHandler } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({
  onChange, accept
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  accept: string
}) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({multiple: false});

  return (
    <section className="w-full">
      <div
        {...getRootProps({
          className:
            "w-full rounded-xl border-2 border-dashed border-secondary p-6 text-center cursor-pointer transition hover:bg-surface-secondary dark:bg-dark bg-lightest",
        })}
      >
        <input {...getInputProps({ onChange, accept })} />

        {isDragActive ? (
          <p className="text-sm">Drop the files here...</p>
        ) : acceptedFiles[0] ? (
          <p className="font-medium">Chosen File: {acceptedFiles[0].name}</p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium">Drag & drop files here</p>
            <p className="text-sm text-secondary">or click to select files</p>
          </div>
        )}
      </div>
    </section>
  );
}
