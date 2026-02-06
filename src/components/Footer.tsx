const Footer = () => {
  return (
    <footer className="py-8 text-center border-t border-border">
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} John Doe. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
