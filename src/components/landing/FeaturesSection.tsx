import { Bot, BarChart3, GraduationCap, Newspaper } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Consultoria com IA",
    description:
      "Tire dúvidas sobre manejo, nutrição e sanidade com um assistente treinado em tilapicultura. Respostas precisas baseadas em pesquisa científica.",
  },
  {
    icon: BarChart3,
    title: "Workspace do Criador",
    description:
      "Registre seus lotes, acompanhe crescimento, consumo de ração e qualidade da água com gráficos e históricos automatizados.",
  },
  {
    icon: GraduationCap,
    title: "Cursos e Formação",
    description:
      "Mini cursos gravados por especialistas sobre manejo, genética, alimentação, qualidade de água e boas práticas de produção.",
  },
  {
    icon: Newspaper,
    title: "Mercado e Tendências",
    description:
      "Cotação atualizada do kg do filé, notícias do setor, tendências de mercado e oportunidades para o tilapicultor brasileiro.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Funcionalidades
          </p>
          <h2 className="text-3xl lg:text-4xl text-foreground mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-muted-foreground text-lg">
            Da consultoria técnica ao controle financeiro, a TilápiaPro reúne as ferramentas essenciais para o tilapicultor moderno.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border opacity-0 animate-fade-up"
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
