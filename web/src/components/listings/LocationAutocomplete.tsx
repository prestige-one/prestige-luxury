"use client";

import { useId, useMemo, useState } from "react";
import { locationSuggestions } from "@/lib/location-suggestions";

/** Location suggestions enhance the free-text query; addresses and property IDs still work. */
export default function LocationAutocomplete({ options, initial = "", className }: { options: string[]; initial?: string; className: string }) {
  const id = `pl-location-${useId()}`;
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const suggestions = useMemo(() => locationSuggestions(options, value), [options, value]);
  const expanded = open && suggestions.length > 0;

  function choose(location: string) {
    setValue(location);
    setOpen(false);
    setActive(-1);
  }

  return (
    <div className="pl-location-autocomplete relative col-span-2 min-w-0 md:col-span-1" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <label htmlFor={id} className="sr-only">Location or property keyword</label>
      <input id={id} name="q" type="text" role="combobox" aria-autocomplete="list" aria-expanded={expanded}
        aria-controls={expanded ? `${id}-options` : undefined} aria-activedescendant={expanded && active >= 0 ? `${id}-option-${active}` : undefined}
        value={value} autoComplete="off" spellCheck={false}
        placeholder="Enter a location, address or property ID" className={className}
        onFocus={() => setOpen(true)}
        onChange={(event) => { setValue(event.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && suggestions.length) {
            event.preventDefault(); setOpen(true); setActive((index) => expanded ? (index + 1) % suggestions.length : 0);
          } else if (event.key === "ArrowUp" && suggestions.length) {
            event.preventDefault(); setOpen(true); setActive((index) => expanded && index > 0 ? index - 1 : suggestions.length - 1);
          } else if (event.key === "Enter" && expanded && active >= 0) {
            event.preventDefault(); choose(suggestions[active]);
          } else if (event.key === "Escape") {
            event.preventDefault(); setOpen(false); setActive(-1);
          }
        }}
      />
      {expanded && (
        <ul id={`${id}-options`} role="listbox" aria-label="Suggested locations" className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-[2px] border border-line bg-white py-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          {suggestions.map((location, index) => (
            <li key={location} role="presentation">
              <button type="button" role="option" id={`${id}-option-${index}`} aria-selected={active === index} tabIndex={-1}
                className={`block w-full px-3 py-2.5 text-left text-[13px] leading-snug text-ink hover:bg-smoke ${active === index ? "bg-smoke" : ""}`}
                onMouseDown={(event) => event.preventDefault()} onClick={() => choose(location)}>
                {location}
              </button>
            </li>
          ))}
        </ul>
      )}
      <span className="sr-only" role="status">{expanded ? `${suggestions.length} location suggestions. Use the arrow keys to choose.` : ""}</span>
    </div>
  );
}
