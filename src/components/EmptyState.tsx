type EmptyStateProps = {
  action?: React.ReactNode;
  children: React.ReactNode;
  title: string;
};

export default function EmptyState({ action, children, title }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <h1>{title}</h1>
      <p className="muted">{children}</p>
      {action}
    </section>
  );
}
