import logoImg from "@/assets/logo-tilapia.png";

const Footer = () => {
  return (
    <footer className="bg-ocean-deep text-ocean-deep-foreground py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="Dr. Tiláp-IA" className="h-8 w-8 brightness-0 invert" />
              <span className="font-display text-lg">Dr. Tiláp-IA</span>
            </div>
            <p className="text-sm text-ocean-deep-foreground/60 leading-relaxed">
              A plataforma inteligente para o tilapicultor brasileiro.
            </p>
          </div>

          {[
            {
              title: "Produto",
              links: ["Funcionalidades", "Planos", "Cursos", "API"],
            },
            {
              title: "Suporte",
              links: ["Central de Ajuda", "Contato", "Comunidade", "Status"],
            },
            {
              title: "Legal",
              links: ["Termos de Uso", "Privacidade", "Cookies"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ocean-deep-foreground/60 hover:text-ocean-deep-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ocean-deep-foreground/10 pt-8 text-center">
          <p className="text-xs text-ocean-deep-foreground/40">
            © {new Date().getFullYear()} TilápiaPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
