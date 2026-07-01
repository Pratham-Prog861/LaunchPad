import { auth } from "@clerk/nextjs/server";
import { getCmsAdapter } from "@/lib/adapters";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PagesTable, type PageData } from "@/components/pages/pages-table";

export default async function PagesPage() {
  const { orgId } = await auth();
  const adapter = getCmsAdapter(orgId || undefined);
  const allPages = await adapter.listPages();

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#151C27] tracking-[-0.02em]">
            Pages
          </h2>
          <p className="text-text-secondary text-base">
            Manage your content pages. Create, edit, and publish.
          </p>
        </div>
        <Link href="/studio/new">
          <Button className="bg-indigo hover:bg-[#4338CA] text-white px-8 py-5 rounded-lg font-medium text-sm flex items-center gap-2 ambient-shadow">
            <Plus className="w-4 h-4" />
            Create New Page
          </Button>
        </Link>
      </div>

      <PagesTable initialPages={allPages as PageData[]} />
    </>
  );
}
