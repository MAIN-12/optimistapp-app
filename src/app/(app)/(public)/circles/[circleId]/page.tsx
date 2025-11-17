import { CircleDetail } from '@/components/circles';

interface CirclePageProps {
  params: Promise<{
    circleId: string;
  }>;
}

export default async function CirclePage({ params }: CirclePageProps) {
  const { circleId } = await params;
  
  return <CircleDetail circleId={circleId} />;
}