import ClientStorefront from './ClientStorefront';

export default async function Page({
  params
}: {
  params?: Promise<{ slug?: string[] }>
}) {
  const resolved = params ? await params : undefined;
  return <ClientStorefront initialSlug={resolved?.slug} />;
}
