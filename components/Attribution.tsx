"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

export default function Attribution() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
