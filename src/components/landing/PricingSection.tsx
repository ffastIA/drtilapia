import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "47",
    description: "Para quem está começando na tilapicultura",
    features: [
      "Acesso a notícias e cotações",
      "5 consultas/mês com IA",
      "1 curso introdutório",
      "Suporte por e-mail",
    ],
    cta: "Começar Básico",
    popular: false,
  },
  {
    name: "Profissional",
    price: "97",
    description: "Para criadores que querem controle total",
    features: [
      "Tudo do plano Básico",
      "Consultas ilimitadas com IA",
      "Workspace completo com gráficos",
      "Todos os cursos disponíveis",
      "Histórico completo de lotes",
      "Suporte prioritário",
    ],
    cta: "Começar Profissional",
    popular: true,
  },
  {
    name: "Premium",
    price: "197",
    description: "Para operações de grande escala",
    features: [
      "Tudo do plano Profissional",
      "Consultoria prioritária com IA",
      "Relatórios avançados em PDF",
      "Múltiplos workspaces",
      "API de integração",
      "Gerente de conta dedicado",
    ],
    cta: "Começar Premium",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-muted/50">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Planos
          </p>
          <h2 className="text-3xl lg:text-4xl text-foreground mb-4">
            Escolha o plano ideal para sua produção
          </h2>
          <p className="text-muted-foreground text-lg">
            Todos os planos incluem 7 dias grátis. Cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-xl p-8 border opacity-0 animate-fade-up flex flex-col ${
                plan.popular
                  ? "shadow-lg ring-2 ring-primary scale-[1.02]"
                  : "shadow-sm"
              }`}
              style={{ animationDelay: `${200 + i * 120}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Mais Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-card-foreground tabular-nums">
                  R${plan.price}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
