
import { LoadingLogo } from "./loading-logo";

interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
}

export const LoadingState = ({ loading, children }: LoadingStateProps) => {
  if (loading) {
    return <LoadingLogo />;
  }

  return <>{children}</>;
};
