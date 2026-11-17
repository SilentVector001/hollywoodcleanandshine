"use client";

import { useEffect } from "react";

/** Remembers this visitor's lead in their browser so a later chat links to it. */
export function RememberLead({ id }: { id: string }) {
  useEffect(() => {
    localStorage.setItem("hl_lead", id);
  }, [id]);
  return null;
}
