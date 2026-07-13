import { Dispatch, Ref, SetStateAction, useImperativeHandle, useState } from "react";

export interface LoadingButtonElement extends HTMLButtonElement {
    setLoading: Dispatch<SetStateAction<boolean>>
}

export default function LoadingButton({ref, ...props}: {ref: Ref<LoadingButtonElement>} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  const [isLoading, setLoading] = useState<boolean>(false);

  useImperativeHandle(ref, () => {
    return { setLoading } as LoadingButtonElement;
  });

  return (
    <>
      <button className="text-xl bg-linear-65 from-light to-deep-light disabled:opacity-50 mt-6 rounded-sm font-bold text-white flex flex-col items-stretch" {...props}>
        <div
          className={`w-full bg-pale-dark h-1 ${isLoading ? "" : "invisible"}`}
        >
          <div
            className={`h-full bg-secondary ${isLoading ? "animate-loading" : ""}`}
          ></div>
        </div>
        <span className="pt-1 pb-2">Submit</span>
      </button>
    </>
  );
}
