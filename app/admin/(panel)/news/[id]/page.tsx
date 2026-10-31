import { notFound } from "next/navigation";
import { sessionClient } from "@/lib/supabase/clients";
import type { News } from "@/lib/types";
import NewsForm from "../NewsForm";

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await sessionClient();
  const { data } = await db.from("news").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <NewsForm news={data as News} />;
}
