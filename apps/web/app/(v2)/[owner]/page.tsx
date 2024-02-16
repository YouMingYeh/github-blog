import { HoverEffect } from "@/components/ui/card-hover-effect";

interface PageProps {
  readonly params: { readonly owner: string };
}

export default async function Page({ params }: PageProps) {
  const { owner } = params;

  const repos = await fetch(`https://api.github.com/users/${owner}/repos`);
  const data = await repos.json();

  const items = data?.map((r) => ({
    title: r.name,
    description: r.description,
    link: `/${r.owner.login}/${r.name}`,
  }));

  return (
    <div className="z-0 p-3">
      <h1 className="text-center text-3xl font-bold">Repos</h1>
      <HoverEffect items={items} />
    </div>
  );
}
