import { Code, Palette, Lightbulb } from "lucide-react";

const skills = [
  {
    icon: Code,
    title: "Web Development",
    description: "Building responsive websites with modern technologies",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Creating beautiful and user-friendly interfaces",
  },
  {
    icon: Lightbulb,
    title: "Problem Solving",
    description: "Finding creative solutions to complex challenges",
  },
];

const SkillsSection = () => {
  return (
    <section className="section-container fade-in" style={{ animationDelay: '0.2s' }}>
      <h2 className="section-title">My Skills</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div key={index} className="skill-card">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <skill.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {skill.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {skill.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
