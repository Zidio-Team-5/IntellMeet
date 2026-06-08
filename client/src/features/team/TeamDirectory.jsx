import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, Mail } from "lucide-react";
import Table from "../../shared/ui/Table.jsx";
import Avatar from "../../shared/ui/Avatar.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import TeamMemberCard from "./TeamMemberCard.jsx";
import { TableSkeleton } from "../../shared/ui/Skeleton.jsx";
import EmptyState from "../../shared/ui/EmptyState.jsx";
import { getTeamMembers } from "../../services/teamService.js";

const FALLBACK = [
  { _id: "1", name: "Alex Chen",    role: "Frontend Engineer", department: "Engineering", isOnline: true,  email: "alex@company.com" },
  { _id: "2", name: "Sarah Park",   role: "Backend Engineer",  department: "Engineering", isOnline: true,  email: "sarah@company.com" },
  { _id: "3", name: "Rahul Kumar",  role: "Product Manager",   department: "Product",     isOnline: false, email: "rahul@company.com" },
  { _id: "4", name: "Ananya Singh", role: "UX Designer",       department: "Design",      isOnline: true,  email: "ananya@company.com" },
  { _id: "5", name: "John Miller",  role: "QA Engineer",       department: "Engineering", isOnline: false, email: "john@company.com" },
  { _id: "6", name: "Priya Patel",  role: "Data Analyst",      department: "Product",     isOnline: true,  email: "priya@company.com" },
];

export default function TeamDirectory() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["team"], queryFn: getTeamMembers });
  const members = (data?.members ?? data ?? FALLBACK).filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search team members…"
          aria-label="Search team members"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={4} />
      ) : members.length === 0 ? (
        <div className="rounded-[10px] border border-[var(--border)]">
          <EmptyState icon={Users} title="No members found" description="Try a different search term." />
        </div>
      ) : (
        <>
          {/* Desktop: directory table */}
          <div className="hidden md:block">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.HeadCell>Member</Table.HeadCell>
                  <Table.HeadCell>Role</Table.HeadCell>
                  <Table.HeadCell>Department</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell align="right" className="w-px">Action</Table.HeadCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {members.map((m) => {
                  const isOnline = m.isOnline || m.status === "online";
                  return (
                    <Table.Row key={m._id || m.id}>
                      <Table.Cell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={m.name || "U"} size="sm" showStatus online={isOnline} />
                          <span className="font-medium text-[var(--text)]">{m.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-[var(--text-secondary)]">{m.role || "—"}</Table.Cell>
                      <Table.Cell className="text-[var(--text-secondary)]">{m.department || "—"}</Table.Cell>
                      <Table.Cell>
                        {isOnline ? (
                          <Badge variant="success" dot>Online</Badge>
                        ) : (
                          <Badge variant="neutral" dot>Offline</Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell align="right">
                        {m.email && (
                          <a
                            href={`mailto:${m.email}`}
                            aria-label={`Email ${m.name}`}
                            className="inline-flex rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
                          >
                            <Mail size={14} />
                          </a>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>

          {/* Mobile: member cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
            {members.map((m) => (
              <TeamMemberCard key={m._id || m.id} member={m} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}