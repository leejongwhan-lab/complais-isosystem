import { supabase } from "@/lib/supabase";

export async function getActiveSubscriptionPlans() {
  const planMap: Record<string, string> = {};

  try {
    const { data } = await supabase
      .from("subscriptions")
      .select("company_id, plan")
      .eq("status", "active");

    data?.forEach((subscription) => {
      planMap[subscription.company_id] = subscription.plan;
    });
  } catch {}

  return planMap;
}

export function formatPlanLabel(plan: string) {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}
