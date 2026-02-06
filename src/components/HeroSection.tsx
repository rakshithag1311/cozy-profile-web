const HeroSection = () => {
  return (
    <section className="section-container text-center pt-24 pb-12 fade-in">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
        <span className="text-4xl">👋</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        John Doe
      </h1>
      <p className="text-lg text-muted-foreground">
        Web Developer & Designer
      </p>
    </section>
  );
};

export default HeroSection;
