import { notFound } from 'next/navigation';

import { prisma } from '@/lib/db';
import { PublicWebsite } from '@/components/builder/PublicWebsite';
import { WebsiteLayout } from '@/lib/types/layout';

export default async function PublicWebsitePage({
  params,
}: {
  params: { id: string };
}) {
  const website = await prisma.website.findUnique({
    where: { id: params.id },
  });

  if (!website || !website.isPublic) {
    notFound();
  }

  const layout = website.layout as unknown as WebsiteLayout;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <PublicWebsite layout={layout} />
    </div>
  );
}
