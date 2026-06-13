type SectionCardProps = {
  children: React.ReactNode;
  description?: string;
  title: string;
};

export default function SectionCard({ children, description, title }: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-title">
        <h2>{title}</h2>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
