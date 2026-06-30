"use client";

import { useEffect, useRef, useState } from "react";
import { dropdownMap } from "../utils/dropdownUtils";
import { SessionData } from "../api/authAPI";
import { useTheme } from "@teispace/next-themes";

export default function Dropdown(props: {
  itemsId: string;
  session: SessionData;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpened, setDropdown] = useState(false);
  const items = dropdownMap[props.itemsId];
  const theme = useTheme();

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
        className={`${isOpened ? "" : "hidden"} absolute border dark:border-secondary border-dark p-2 rounded-sm dark:bg-dark bg-lightest w-35 mt-1 -left-25`}
        ref={dropdownRef}
      >
        {items.map((item) => (
          <div key={item.name}>
            {item.divider ? (
              <hr className="dark:text-lightest text-dark my-1" />
            ) : (
              <button
                onClick={() => (item.onClick ? item.onClick(theme) : "")}
                className="mb-1 text-lg"
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
        ))}
      </div>
    </div>
  );
}
