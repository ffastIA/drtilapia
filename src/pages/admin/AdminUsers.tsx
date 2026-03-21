import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  plan_name?: string;
  plan_id?: string;
  subscription_id?: string;
  is_admin?: boolean;
}

interface Plan {
  id: string;
  display_name: string;
  name: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: usersData }, { data: plansData }, { data: subsData }, { data: rolesData }] = await Promise.all([
      supabase.rpc("admin_list_users"),
      supabase.from("plans").select("id, display_name, name").order("sort_order"),
      supabase.from("user_subscriptions").select("id, user_id, plan_id, status").eq("status", "active"),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    const subs = subsData ?? [];
    const roles = rolesData ?? [];
    const pList = plansData ?? [];

    const merged: UserRow[] = (usersData ?? []).map((u: { id: string; email: string; created_at: string }) => {
      const sub = subs.find((s) => s.user_id === u.id);
      const plan = sub ? pList.find((p) => p.id === sub.plan_id) : null;
      const admin = roles.some((r) => r.user_id === u.id && r.role === "admin");
      return {
        ...u,
        plan_name: plan?.display_name ?? "Sem plano",
        plan_id: sub?.plan_id,
        subscription_id: sub?.id,
        is_admin: admin,
      };
    });

    setUsers(merged);
    setPlans(pList);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChangePlan = async (userId: string, newPlanId: string, subscriptionId?: string) => {
    if (subscriptionId) {
      const { error } = await supabase
        .from("user_subscriptions")
        .update({ plan_id: newPlanId, updated_at: new Date().toISOString() })
        .eq("id", subscriptionId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase
        .from("user_subscriptions")
        .insert({ user_id: userId, plan_id: newPlanId, status: "active" });
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Plano atualizado!");
    fetchData();
  };

  const handleToggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    if (currentlyAdmin) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) { toast.error(error.message); return; }
    }
    toast.success(currentlyAdmin ? "Admin removido" : "Admin adicionado");
    fetchData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação é irreversível.")) return;

    // Delete subscription and roles first (cascade should handle, but be explicit)
    await supabase.from("user_subscriptions").delete().eq("user_id", userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);

    // We can't delete from auth.users via client. We'd need an edge function.
    toast.info("Assinatura e roles removidos. Para excluir o usuário completamente, use o painel do backend.");
    fetchData();
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-foreground">Gestão de Usuários</h2>
        <p className="text-sm text-muted-foreground mt-1">{users.length} usuários cadastrados</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-mail</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.plan_id ?? ""}
                    onValueChange={(val) => handleChangePlan(user.id, val, user.subscription_id)}
                  >
                    <SelectTrigger className="w-[160px] h-8 text-sm">
                      <SelectValue placeholder="Sem plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.display_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant={user.is_admin ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => handleToggleAdmin(user.id, !!user.is_admin)}
                  >
                    <Shield className="h-3 w-3" />
                    {user.is_admin ? "Admin" : "Usuário"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
