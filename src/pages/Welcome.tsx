import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Bot, GraduationCap, Newspaper, BarChart3, LayoutDashboard, Lock } from "lucide-react";
import { useUserFeatures, type AppFeature } from "@/hooks/useUserFeatures";
import logoImg from "@/assets/logo-tilapia.png";

interface SectionCard {
  feature: AppFeature;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

const sections: SectionCard[] = [
  {
    feature: "consultoria_ia",
    title: "Consultoria por IA",
    description: "Tire dúvidas sobre tilapicultura com inteligência artificial especializada.",
    icon: <Bot className="h-7 w-7" />,
    color: "bg-primary/10 text-primary",
    href: "/consultoria",
  },
  {
    feature: "minicursos",
    title: "Minicursos",
    description: "Assista a vídeos e treinamentos práticos sobre criação de tilápias.",
    icon: <GraduationCap className="h-7 w-7" />,
    color: "bg-accent/20 text-accent-foreground",
    href: "/cursos",
  },
  {
    feature: "noticias",
    title: "Notícias e Artigos",
    description: "Fique por dentro das últimas novidades e pesquisas do setor.",
    icon: <Newspaper className="h-7 w-7" />,
    color: "bg-secondary text-secondary-foreground",
    href: "/noticias",
  },
  {
    feature: "negocios",
    title: "Negócios",
    description: "Cotações, mercado e oportunidades comerciais para produtores.",
    icon: <BarChart3 className="h-7 w-7" />,
    color: "bg-primary/10 text-primary",
    href: "/negocios",
  },
  {
    feature: "workspace",
    title: "Workspace",
    description: "Gerencie seus lotes, ração, crescimento e relatórios em um só lugar.",
    icon: <LayoutDashboard className="h-7 w-7" />,
    color: "bg-accent/20 text-accent-foreground",
    href: "/dashboard",
  },
];

const Welcome = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { features, displayName, loading: planLoading } = useUserFeatures();

  if (authLoading || planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const hasAccess = (feature: AppFeature) => features.includes(feature);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Dr. Tiláp-IA" className="h-8 w-8" />
            <span className="font-display text-lg text-foreground">Dr. Tiláp-IA</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              Plano {displayName}
            </span>
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-12 lg:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-display text-foreground mb-3" style={{ lineHeight: "1.1" }}>
            Bem-vindo ao Dr. Tiláp-IA
          </h1>
          <p className="text-muted-foreground text-lg">
            Selecione a área que deseja acessar
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {sections.map((section, i) => {
            const locked = !hasAccess(section.feature);
            return (
              <button
                key={section.feature}
                disabled={locked}
                onClick={() => {
                  if (!locked) window.location.href = section.href;
                }}
                className={`group relative text-left rounded-xl border p-6 transition-all duration-300 opacity-0 animate-fade-up ${
                  locked
                    ? "bg-muted/50 border-border cursor-not-allowed"
                    : "bg-card border-border hover:border-primary/30 hover:shadow-lg active:scale-[0.97] cursor-pointer"
                }`}
                style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: "forwards" }}
              >
                {locked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                )}

                <div className={`inline-flex items-center justify-center rounded-lg p-2.5 mb-4 ${
                  locked ? "bg-muted text-muted-foreground/50" : section.color
                }`}>
                  {section.icon}
                </div>

                <h3 className={`text-base font-semibold mb-1.5 ${
                  locked ? "text-muted-foreground/60" : "text-card-foreground"
                }`}>
                  {section.title}
                </h3>

                <p className={`text-sm leading-relaxed ${
                  locked ? "text-muted-foreground/40" : "text-muted-foreground"
                }`}>
                  {section.description}
                </p>

                {locked && (
                  <p className="text-xs text-muted-foreground/50 mt-3 font-medium">
                    Disponível em planos superiores
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Welcome;
