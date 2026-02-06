const AboutSection = () => {
  return (
    <section className="section-container fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 className="section-title">About Me</h2>
      <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
        <p className="text-foreground leading-relaxed">
          Hi there! I'm a passionate developer who loves creating beautiful and 
          functional websites. I enjoy turning complex problems into simple, 
          elegant solutions. When I'm not coding, you can find me exploring new 
          technologies and learning new skills.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
