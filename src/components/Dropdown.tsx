"use client";

import { useEffect, useRef, useState } from "react";
import { dropdownMap } from "../utils/dropdownUtils";
import { SessionData } from "../api/authAPI";
import { useTheme } from "@teispace/next-themes";
import { useRouter } from "nextjs-toploader/app";

export default function Dropdown(props: {
  itemsId: string;
  session: SessionData;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme();

  const [isOpened, setDropdown] = useState(false);
  const items = dropdownMap[props.itemsId];

  useEffect(() =>
    document.addEventListener("click", (event) => {
      if (!dropdownRef.current?.parentElement?.contains(event.target as Node)) {
        setDropdown(false);
      }
    }),
  );
  return (
    <div className="relative">
      <button className="triggerBtn" onClick={() => setDropdown(!isOpened)}>
        {props.session.username}
      </button>
      <div
        className={`${isOpened ? "" : "hidden"} absolute z-10 border dark:border-secondary border-dark p-2 rounded-sm dark:bg-dark bg-lightest w-35 mt-1 -left-25`}
        ref={dropdownRef}
      >
        {items.map(
          (item) =>
            (!item.adminOnly || props.session.isAdmin) && (
              <div key={item.name}>
                {item.divider ? (
                  <hr className="dark:text-lightest text-dark my-1" />
                ) : (
                  <button
                    onClick={() =>
                      item.onClick ? item.onClick(router, theme) : ""
                    }
                    className="mb-1 text-lg border-0! p-0!"
                  >
                    {item.icon ? (
                      <p className="flex items-center gap-1">
                        {item.icon} {item.name}
                      </p>
                    ) : (
                      item.name
                    )}
                  </button>
                )}
              </div>
            ),
        )}
      </div>
    </div>
  );
}
