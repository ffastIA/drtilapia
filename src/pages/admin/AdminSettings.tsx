import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground mt-1">Configurações gerais do painel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Administrador atual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Gerencie usuários e seus planos na aba <strong>Usuários</strong>.</p>
          <p>• Crie, edite e exclua planos na aba <strong>Planos</strong>.</p>
          <p>• Cada plano pode ter funcionalidades específicas habilitadas.</p>
          <p>• Novos usuários recebem automaticamente o plano Gratuito.</p>
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link to="/welcome" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Voltar ao app
        </Link>
      </Button>
    </div>
  );
};

export default AdminSettings;
