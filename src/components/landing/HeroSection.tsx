import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImg from "@/assets/hero-tilapia.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Fazenda de tilápia moderna"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 ocean-gradient opacity-80" />
      </div>

      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-2xl space-y-6">
          <p
            className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/70 opacity-0 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Plataforma inteligente para aquicultura
          </p>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl text-primary-foreground leading-[1.1] opacity-0 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Gerencie sua criação de tilápias com tecnologia
          </h1>

          <p
            className="text-lg text-primary-foreground/80 max-w-lg leading-relaxed opacity-0 animate-fade-up"
            style={{ animationDelay: "350ms" }}
          >
            Consultoria com IA, controle de lotes, cursos especializados e análise de mercado — tudo em uma única plataforma feita para o tilapicultor.
          </p>

          <div
            className="flex flex-wrap gap-4 pt-2 opacity-0 animate-fade-up"
            style={{ animationDelay: "500ms" }}
          >
            <Button variant="hero" size="xl">
              Testar Grátis por 7 Dias
              <ArrowRight className="ml-1" />
            </Button>
            <Button variant="hero-outline" size="xl">
              <Play className="mr-1" size={18} />
              Ver Demonstração
            </Button>
          </div>

          <div
            className="flex items-center gap-8 pt-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "650ms" }}
          >
            {[
              { value: "2.400+", label: "Criadores ativos" },
              { value: "98%", label: "Satisfação" },
              { value: "R$47", label: "A partir de/mês" },
            ].map((stat) => (
              <div key={stat.label} className="text-primary-foreground">
                <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                <div className="text-xs text-primary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
