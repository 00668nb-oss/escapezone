type LoadingProps = {
  message?: string;
};

export function Loading({ message = "טוען..." }: LoadingProps) {
  return <div role="status">{message}</div>;
}
