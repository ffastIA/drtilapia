import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import logoImg from "@/assets/logo-tilapia.png";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="TilápiaPro" className="h-8 w-8" />
            <span className="font-display text-lg text-foreground">TilápiaPro</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-12">
        <h1 className="text-3xl font-display text-foreground mb-2">Olá, bem-vindo!</h1>
        <p className="text-muted-foreground">Seu workspace será construído aqui em breve.</p>
      </main>
    </div>
  );
};

export default Dashboard;
