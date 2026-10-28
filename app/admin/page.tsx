import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidAdminToken } from "@/lib/scenario";
import { AdminLab } from "./security-lab";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cg_demo_admin")?.value;
  if (!isValidAdminToken(token)) redirect("/admin/login");
  return <AdminLab />;
}
