type StatusMessageProps = {
  children?: string;
  tone: 'error' | 'success';
};

export default function StatusMessage({ children, tone }: StatusMessageProps) {
  if (!children) {
    return null;
  }

  return <p className={`status ${tone}`}>{children}</p>;
}
