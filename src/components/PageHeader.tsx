type PageHeaderProps = {
  action?: React.ReactNode;
  compact?: boolean;
  eyebrow: string;
  subtitle?: React.ReactNode;
  title: string;
};

export default function PageHeader({ action, compact = false, eyebrow, subtitle, title }: PageHeaderProps) {
  return (
    <header className={`page-header${compact ? ' compact' : ''}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {subtitle}
      </div>
      {action}
    </header>
  );
}
