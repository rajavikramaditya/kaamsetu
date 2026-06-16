import { NextResponse } from "next/server";

import { getAppBaseUrl, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const base = {
    status: "ok" as const,
    app: "kaamsetu",
    env: process.env.APP_ENV ?? "development",
    baseUrl: getAppBaseUrl(),
    supabase: {
      configured: isSupabaseConfigured(),
      connected: false as boolean,
    },
    timestamp: new Date().toISOString(),
  };

  if (!base.supabase.configured) {
    return NextResponse.json(
      {
        ...base,
        status: "degraded",
        supabase: { ...base.supabase, error: "Missing Supabase env vars" },
      },
      { status: 503 },
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();
    base.supabase.connected = !error;
    if (error) {
      return NextResponse.json(
        {
          ...base,
          status: "degraded",
          supabase: { ...base.supabase, error: error.message },
        },
        { status: 503 },
      );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Supabase connection failed";
    return NextResponse.json(
      {
        ...base,
        status: "degraded",
        supabase: { ...base.supabase, connected: false, error: message },
      },
      { status: 503 },
    );
  }

  return NextResponse.json(base);
}
