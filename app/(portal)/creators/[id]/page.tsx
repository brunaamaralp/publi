import { redirect } from "next/navigation";

type CreatorsRedirectPageProps = {
  params: { id: string };
};

/** Compat: Prompt 16 usava /creators/[id] — agora o portfólio público é /influenciador/[id]. */
export default function CreatorsRedirectPage({
  params,
}: CreatorsRedirectPageProps) {
  redirect(`/influenciador/${params.id}`);
}
