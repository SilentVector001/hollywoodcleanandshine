"use client";

import { useEffect } from "react";

/** Remembers this visitor's lead in their browser so a later chat links to it. */
export function RememberLead({ id }: { id: string }) {
  useEffect(() => {
    try {
      localStorage.setItem("hl_lead", id);
    } catch {
      /* storage blocked: the chat just won't auto-link */
    }
  }, [id]);
  return null;
}
