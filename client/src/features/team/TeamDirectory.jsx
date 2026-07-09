import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Users, Mail, ShieldCheck, ShieldOff, Trash2, UserPlus } from "lucide-react";
import Table from "../../shared/ui/Table.jsx";
import Avatar from "../../shared/ui/Avatar.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import Button from "../../shared/ui/Button.jsx";
import TeamMemberCard from "./TeamMemberCard.jsx";
import AddMemberModal from "./AddMemberModal.jsx";
import MemberDetailModal from "./MemberDetailModal.jsx";
import { TableSkeleton } from "../../shared/ui/Skeleton.jsx";
import EmptyState from "../../shared/ui/EmptyState.jsx";
import { getTeamMembers, promoteMember, demoteMember, removeMember } from "../../services/teamService.js";
import useAuthStore from "../../core/store/authStore.js";
import { toast } from "../../core/store/toastStore.js";

const FALLBACK = [
  { _id: "1", name: "Alex Chen",    role: "member", department: "Engineering", isOnline: true,  email: "alex@company.com" },
  { _id: "2", name: "Sarah Park",   role: "member", department: "Engineering", isOnline: true,  email: "sarah@company.com" },
  { _id: "3", name: "Rahul Kumar",  role: "admin",  department: "Product",     isOnline: false, email: "rahul@company.com" },
  { _id: "4", name: "Ananya Singh", role: "member", department: "Design",      isOnline: true,  email: "ananya@company.com" },
  { _id: "5", name: "John Miller",  role: "member", department: "Engineering", isOnline: false, email: "john@company.com" },
  { _id: "6", name: "Priya Patel",  role: "member", department: "Product",     isOnline: true,  email: "priya@company.com" },
];

export default function TeamDirectory() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["team"], queryFn: getTeamMembers });
  const members = (data?.members ?? data ?? FALLBACK).filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.department?.toLowerCase().includes(search.toLowerCase())
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["team"] });

  const promoteMutation = useMutation({
    mutationFn: promoteMember,
    onSuccess: (_d, id) => { invalidate(); toast({ type: "success", title: "Promoted", message: "Member promoted to admin." }); },
    onError: (e) => toast({ type: "error", title: "Couldn't promote", message: e?.response?.data?.message || "Try again." }),
  });
  const demoteMutation = useMutation({
    mutationFn: demoteMember,
    onSuccess: () => { invalidate(); toast({ type: "success", title: "Demoted", message: "Admin moved to member." }); },
    onError: (e) => toast({ type: "error", title: "Couldn't demote", message: e?.response?.data?.message || "Try again." }),
  });
  const removeMutation = useMutation({
    mutationFn: removeMember,
    onSuccess: () => { invalidate(); toast({ type: "success", title: "Removed", message: "Member removed from workspace." }); },
    onError: (e) => toast({ type: "error", title: "Couldn't remove", message: e?.response?.data?.message || "Try again." }),
  });

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members…"
            aria-label="Search team members"
            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] py-2 pl-9 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
          />
        </div>
        {isAdmin && (
          <Button size="sm" icon={UserPlus} onClick={() => setShowAdd(true)}>
            Add member
          </Button>
        )}
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
                  <Table.HeadCell>Access</Table.HeadCell>
                  <Table.HeadCell>Department</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell align="right" className="w-px">Action</Table.HeadCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {members.map((m) => {
                  const id = m._id || m.id;
                  const isOnline = m.isOnline || m.status === "online";
                  const isSelf = id === (user?._id || user?.id);
                  const memberIsAdmin = m.role === "admin";
                  return (
                    <Table.Row key={id}>
                      <Table.Cell>
                        <button
                          onClick={() => setSelectedMember(m)}
                          className="flex items-center gap-2.5 text-left hover:underline"
                          title="View profile"
                        >
                          <Avatar name={m.name || "U"} size="sm" showStatus online={isOnline} />
                          <span className="font-medium text-[var(--text)]">{m.name}</span>
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        {memberIsAdmin ? (
                          <Badge variant="brand" dot>Admin</Badge>
                        ) : (
                          <Badge variant="neutral" dot>Member</Badge>
                        )}
                        {m.isVerified === false && (
                          <span className="ml-2 text-xs text-[var(--text-muted)]">(pending)</span>
                        )}
                      </Table.Cell>
                      <Table.Cell className="text-[var(--text-secondary)]">{m.department || "—"}</Table.Cell>
                      <Table.Cell>
                        {isOnline ? (
                          <Badge variant="success" dot>Online</Badge>
                        ) : (
                          <Badge variant="neutral" dot>Offline</Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell align="right">
                        <div className="flex items-center justify-end gap-1">
                          {m.email && (
                            <a
                              href={`mailto:${m.email}`}
                              aria-label={`Email ${m.name}`}
                              className="inline-flex rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
                            >
                              <Mail size={14} />
                            </a>
                          )}
                          {isAdmin && !isSelf && (
                            <>
                              {memberIsAdmin ? (
                                <button
                                  aria-label={`Demote ${m.name}`}
                                  title="Demote to member"
                                  onClick={() => demoteMutation.mutate(id)}
                                  className="inline-flex rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--warning)]"
                                >
                                  <ShieldOff size={14} />
                                </button>
                              ) : (
                                <button
                                  aria-label={`Promote ${m.name}`}
                                  title="Promote to admin"
                                  onClick={() => promoteMutation.mutate(id)}
                                  className="inline-flex rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--brand)]"
                                >
                                  <ShieldCheck size={14} />
                                </button>
                              )}
                              <button
                                aria-label={`Remove ${m.name}`}
                                title="Remove from workspace"
                                onClick={() => { if (window.confirm(`Remove ${m.name} from the workspace?`)) removeMutation.mutate(id); }}
                                className="inline-flex rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--error)]"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
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
              <TeamMemberCard key={m._id || m.id} member={m} onClick={() => setSelectedMember(m)} />
            ))}
          </div>
        </>
      )}

      <AddMemberModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
      <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
}
