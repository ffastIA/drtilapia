import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppFeature = Database["public"]["Enums"]["app_feature"];

const ALL_FEATURES: { value: AppFeature; label: string }[] = [
  { value: "consultoria_ia", label: "Consultoria por IA" },
  { value: "minicursos", label: "Minicursos" },
  { value: "noticias", label: "Notícias e Artigos" },
  { value: "negocios", label: "Negócios" },
  { value: "workspace", label: "Workspace" },
];

interface PlanRow {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  price_cents: number;
  is_active: boolean;
  sort_order: number;
  features: AppFeature[];
}

const emptyForm = {
  name: "",
  display_name: "",
  description: "",
  price_cents: 0,
  is_active: true,
  sort_order: 0,
  features: [] as AppFeature[],
};

const AdminPlans = () => {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PlanRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    const [{ data: plansData }, { data: featuresData }] = await Promise.all([
      supabase.from("plans").select("*").order("sort_order"),
      supabase.from("plan_features").select("plan_id, feature"),
    ]);

    const featureMap: Record<string, AppFeature[]> = {};
    (featuresData ?? []).forEach((f) => {
      if (!featureMap[f.plan_id]) featureMap[f.plan_id] = [];
      featureMap[f.plan_id].push(f.feature);
    });

    setPlans(
      (plansData ?? []).map((p) => ({
        ...p,
        features: featureMap[p.id] ?? [],
      }))
    );
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (plan: PlanRow) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      display_name: plan.display_name,
      description: plan.description ?? "",
      price_cents: plan.price_cents,
      is_active: plan.is_active,
      sort_order: plan.sort_order,
      features: plan.features,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.display_name) {
      toast.error("Preencha nome e nome de exibição.");
      return;
    }
    setSaving(true);

    let planId = editing?.id;

    if (editing) {
      const { error } = await supabase
        .from("plans")
        .update({
          name: form.name,
          display_name: form.display_name,
          description: form.description || null,
          price_cents: form.price_cents,
          is_active: form.is_active,
          sort_order: form.sort_order,
        })
        .eq("id", editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase
        .from("plans")
        .insert({
          name: form.name,
          display_name: form.display_name,
          description: form.description || null,
          price_cents: form.price_cents,
          is_active: form.is_active,
          sort_order: form.sort_order,
        })
        .select("id")
        .single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      planId = data.id;
    }

    // Sync features: delete all then insert
    if (planId) {
      await supabase.from("plan_features").delete().eq("plan_id", planId);
      if (form.features.length > 0) {
        await supabase.from("plan_features").insert(
          form.features.map((f) => ({ plan_id: planId!, feature: f }))
        );
      }
    }

    toast.success(editing ? "Plano atualizado!" : "Plano criado!");
    setDialogOpen(false);
    setSaving(false);
    fetchPlans();
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Excluir este plano? Usuários associados perderão o plano.")) return;
    await supabase.from("plan_features").delete().eq("plan_id", planId);
    await supabase.from("user_subscriptions").delete().eq("plan_id", planId);
    const { error } = await supabase.from("plans").delete().eq("id", planId);
    if (error) { toast.error(error.message); return; }
    toast.success("Plano excluído.");
    fetchPlans();
  };

  const toggleFeature = (feature: AppFeature) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-foreground">Gestão de Planos</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure planos e funcionalidades</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Plano" : "Novo Plano"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Identificador</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="pro" />
                </div>
                <div className="space-y-1.5">
                  <Label>Nome de exibição</Label>
                  <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Profissional" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Descrição</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Acesso completo..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Preço (centavos)</Label>
                  <Input type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Ordem</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(val) => setForm({ ...form, is_active: val })} />
                <Label>Ativo</Label>
              </div>
              <div className="space-y-2">
                <Label>Funcionalidades incluídas</Label>
                <div className="space-y-2">
                  {ALL_FEATURES.map((f) => (
                    <label key={f.value} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={form.features.includes(f.value)} onCheckedChange={() => toggleFeature(f.value)} />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className={`${!plan.is_active ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.display_name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(plan)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-foreground mb-2">
                R$ {(plan.price_cents / 100).toFixed(2)}/mês
              </p>
              <div className="flex flex-wrap gap-1">
                {plan.features.length === 0 && (
                  <span className="text-xs text-muted-foreground">Nenhuma funcionalidade</span>
                )}
                {plan.features.map((f) => (
                  <span key={f} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {ALL_FEATURES.find((af) => af.value === f)?.label ?? f}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPlans;
