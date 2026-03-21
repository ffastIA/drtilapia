import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppFeature = "consultoria_ia" | "minicursos" | "noticias" | "negocios" | "workspace";

interface UserPlan {
  planName: string;
  displayName: string;
  features: AppFeature[];
  loading: boolean;
}

export const useUserFeatures = (): UserPlan => {
  const { user } = useAuth();
  const [state, setState] = useState<Omit<UserPlan, "loading">>({
    planName: "",
    displayName: "",
    features: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      // Get user subscription with plan info
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan_id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (!sub) {
        setLoading(false);
        return;
      }

      const [{ data: plan }, { data: features }] = await Promise.all([
        supabase.from("plans").select("name, display_name").eq("id", sub.plan_id).single(),
        supabase.from("plan_features").select("feature").eq("plan_id", sub.plan_id),
      ]);

      setState({
        planName: plan?.name ?? "",
        displayName: plan?.display_name ?? "",
        features: (features?.map((f) => f.feature) ?? []) as AppFeature[],
      });
      setLoading(false);
    };

    fetch();
  }, [user]);

  return { ...state, loading };
};
