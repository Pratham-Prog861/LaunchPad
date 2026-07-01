"use client";

import { useOrganization } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit2, Rocket, UserCheck, AlertCircle } from "lucide-react";

interface ClerkMember {
  id: string;
  role: string;
  publicUserData?: {
    firstName?: string | null;
    lastName?: string | null;
    identifier: string;
  } | null;
}

export default function RolesPage() {
  const { organization, isLoaded, memberships } = useOrganization({
    memberships: {},
  });

  // Role permissions definitions
  const roleInfo = [
    {
      role: "org:viewer",
      name: "Viewer",
      icon: Eye,
      color: "bg-blue-50 text-blue-700 border-blue-100",
      desc: "Can view pages, live preview, and release history. Cannot edit draft pages or publish releases.",
    },
    {
      role: "org:editor",
      name: "Editor",
      icon: Edit2,
      color: "bg-amber-50 text-amber-700 border-amber-100",
      desc: "Can view all resources, edit drafts, add/remove/reorder sections, and save drafts. Cannot publish releases.",
    },
    {
      role: "org:publisher",
      name: "Publisher",
      icon: Rocket,
      color: "bg-indigo-50 text-indigo border-indigo-100",
      desc: "Full access. Can view, edit drafts, manage configuration, and publish drafts as immutable SemVer releases.",
    },
  ];

  const members = memberships?.data
    ? (memberships.data as unknown as ClerkMember[]).map((mem) => ({
        id: mem.id,
        name: mem.publicUserData?.firstName
          ? `${mem.publicUserData.firstName} ${mem.publicUserData.lastName || ""}`.trim()
          : mem.publicUserData?.identifier || "Unnamed User",
        email: mem.publicUserData?.identifier || "",
        role: mem.role,
      }))
    : [];

  return (
    <>
      <div>
        <h2 className="text-[30px] leading-[38px] font-semibold text-[#151C27] tracking-[-0.02em]">
          Role Management
        </h2>
        <p className="text-text-secondary text-base">
          Define access permissions and audit organization roles.
        </p>
      </div>

      {/* Role Definitions Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roleInfo.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.role} className="border-border-subtle ambient-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-[#151C27]">
                  {r.name}
                </CardTitle>
                <div className="p-1.5 bg-surface-container-low rounded-lg text-indigo">
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <Badge className={`${r.color} font-mono font-normal border text-xs`}>
                  {r.role}
                </Badge>
                <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                  {r.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Members Directory */}
      <Card className="border-border-subtle ambient-shadow">
        <CardHeader className="border-b border-border-subtle">
          <CardTitle className="text-lg font-semibold text-[#151C27]">
            Directory & Assignments
          </CardTitle>
          <CardDescription>
            {organization
              ? `Current members in the "${organization.name}" organization`
              : "Clerk organization members directory."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!isLoaded ? (
            <div className="py-10 text-center text-text-secondary">
              Loading directory...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                  <TableHead className="font-medium text-text-secondary">Name</TableHead>
                  <TableHead className="font-medium text-text-secondary">Email</TableHead>
                  <TableHead className="font-medium text-text-secondary">Role</TableHead>
                  <TableHead className="font-medium text-text-secondary">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id} className="hover:bg-[#F9F9FF]">
                    <TableCell className="font-medium text-[#151C27]">
                      {m.name}
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">
                      {m.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          m.role === "org:admin" || m.role === "admin" || m.role === "org:publisher"
                            ? "bg-indigo-50 text-indigo border border-indigo-100 font-mono font-normal"
                            : m.role === "org:member" || m.role === "member" || m.role === "org:editor"
                            ? "bg-amber-50 text-amber-700 border border-amber-100 font-mono font-normal"
                            : "bg-blue-50 text-blue-700 border border-blue-100 font-mono font-normal"
                        }
                      >
                        {m.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-success font-medium">
                        <UserCheck className="w-3.5 h-3.5" />
                        Active
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-text-secondary">
                      No active organization members found. Please select or join a Clerk Organization to manage members.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!organization && (
        <div className="p-4 bg-warning-bg rounded-lg border border-warning/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-warning">
              Clerk Organizations Setup
            </h4>
            <p className="text-xs text-warning mt-1 leading-relaxed">
              To use real member listing and enforce actual RBAC checks, enable
              Organizations in your Clerk Dashboard and create the custom roles
              (<code className="font-mono bg-white/50 px-1 rounded">org:viewer</code>,{" "}
              <code className="font-mono bg-white/50 px-1 rounded">org:editor</code>,{" "}
              <code className="font-mono bg-white/50 px-1 rounded">org:publisher</code>).
            </p>
          </div>
        </div>
      )}
    </>
  );
}
