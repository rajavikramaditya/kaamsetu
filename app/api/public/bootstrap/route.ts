import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [categoriesRes, localitiesRes] = await Promise.all([
      supabase
        .from("service_categories")
        .select("slug, name_en, name_hi, pricing_type_default, standard_visit_charge, requires_shift_fields, sort_order")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("localities")
        .select("id, name, city, state, is_serviceable")
        .eq("is_active", true)
        .eq("is_serviceable", true)
        .order("sort_order"),
    ]);

    if (categoriesRes.error) {
      return NextResponse.json(
        { error: "bootstrap_failed", message: categoriesRes.error.message },
        { status: 503 },
      );
    }

    if (localitiesRes.error) {
      return NextResponse.json(
        { error: "bootstrap_failed", message: localitiesRes.error.message },
        { status: 503 },
      );
    }

    return NextResponse.json({
      app: "kaamsetu",
      city: "Orai",
      state: "Uttar Pradesh",
      service_categories: categoriesRes.data,
      localities: localitiesRes.data,
      beta_paused: false,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bootstrap unavailable";
    return NextResponse.json(
      { error: "bootstrap_failed", message },
      { status: 503 },
    );
  }
}
