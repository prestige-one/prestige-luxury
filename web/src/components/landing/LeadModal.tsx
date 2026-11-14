"use client";

import { useRef, useState } from "react";
import LeadForm, { type LeadField } from "@/components/LeadForm";

/**
 * A button that opens the project enquiry form in a pop-up
 * (replaces the Elementor pop-ups behind "Request Brochure", "Learn More", "Take a 3D Tour"...).
 */
export default function LeadModal({
  label,
  className,
  title,
  form,
  fields,
  submitLabel,
  redirectTo,
  extra,
  dir,
}: {
  label: React.ReactNode;
  className: string;
  title: string;
  form: string;
  fields: LeadField[];
  submitLabel?: string;
  redirectTo?: string;
  extra?: Record<string, string>;
  dir?: "rtl" | "ltr";
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  // The form (with its long country list) is only rendered once the pop-up has been opened
  const [opened, setOpened] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`pl-lp-modal-trigger ${className}`}
        onClick={() => {
          setOpened(true);
          dialog.current?.showModal();
        }}
      >
        {label}
      </button>
      <dialog
        ref={dialog}
        dir={dir}
        aria-label={title}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto w-[calc(100%-32px)] max-w-[560px] rounded-[15px] border-[3px] border-white bg-black p-0 text-white backdrop:bg-black/80"
      >
        <div className="relative p-6 sm:p-10">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 p-2 text-white/70 hover:text-white rtl:left-3 rtl:right-auto"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <h2 className="mb-6 pe-8 font-medium leading-tight text-section">{title}</h2>
          {opened && <LeadForm form={form} fields={fields} submitLabel={submitLabel} redirectTo={redirectTo} extra={extra} dark />}
        </div>
      </dialog>
    </>
  );
}
