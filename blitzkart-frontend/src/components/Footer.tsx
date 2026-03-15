const Footer = () => {
  return (
    <footer className="bg-brand-dark border-t border-brand-charcoal mt-12">
      <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-1 mb-4">
            <span className="font-heading text-xl font-bold text-primary">Blitz</span>
            <span className="font-heading text-xl font-bold text-brand-lime">Kart</span>
            <span className="text-brand-lime">⚡</span>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            Groceries delivered in minutes. Because life doesn't wait.
          </p>
        </div>

        {[
          { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
          { title: "Help", links: ["FAQ", "Contact", "Returns", "Delivery Info"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-heading font-bold text-primary-foreground mb-3 text-sm">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary font-body transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container pb-6">
        <p className="text-xs text-muted-foreground text-center font-body">
          © 2026 BlitzKart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
