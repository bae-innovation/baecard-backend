import { NotFoundPage } from '@/features/errors/components/not-found-page';

type NotFoundProps = {
  message?: string | null;
};

export default function NotFound({ message = null }: NotFoundProps) {
  return <NotFoundPage message={message} />;
}
