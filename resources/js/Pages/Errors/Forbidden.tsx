import { ForbiddenPage } from '@/features/errors/components/forbidden-page';

type ForbiddenProps = {
  message?: string | null;
};

export default function Forbidden({ message = null }: ForbiddenProps) {
  return <ForbiddenPage message={message} />;
}
