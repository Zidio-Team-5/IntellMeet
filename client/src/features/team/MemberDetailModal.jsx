import { Mail, Phone, MapPin, Briefcase, Clock, Linkedin, Github, Twitter, Globe } from "lucide-react";
import Modal from "../../shared/ui/Modal.jsx";
import Avatar from "../../shared/ui/Avatar.jsx";
import Badge from "../../shared/ui/Badge.jsx";
import { formatDate } from "../../shared/utils/formatters.js";

const SOCIAL_ICONS = { linkedin: Linkedin, github: Github, twitter: Twitter, website: Globe };

export default function MemberDetailModal({ member, onClose }) {
  if (!member) return null;
  const socials = Object.entries(member.socialLinks || {}).filter(([, url]) => url);

  return (
    <Modal isOpen={!!member} onClose={onClose} title="Team member" size="sm">
      <div className="text-center">
        <Avatar name={member.name || "U"} size="xl" className="mx-auto" />
        <h2 className="mt-3 font-display text-lg font-semibold text-[var(--text)]">{member.name}</h2>
        {member.jobTitle && <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{member.jobTitle}</p>}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          <Badge variant={member.role === "admin" ? "brand" : "neutral"}>{member.role}</Badge>
          {member.department && <Badge variant="neutral">{member.department}</Badge>}
          {member.isVerified === false && <Badge variant="warning">Pending signup</Badge>}
        </div>
      </div>

      <div className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-4">
        <a href={`mailto:${member.email}`} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]">
          <Mail size={14} className="text-[var(--text-muted)]" /> {member.email}
        </a>
        {member.phone && (
          <p className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
            <Phone size={14} className="text-[var(--text-muted)]" /> {member.phone}
          </p>
        )}
        {member.location && (
          <p className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
            <MapPin size={14} className="text-[var(--text-muted)]" /> {member.location}
          </p>
        )}
        {member.timezone && (
          <p className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
            <Clock size={14} className="text-[var(--text-muted)]" /> {member.timezone}
          </p>
        )}
        {member.createdAt && (
          <p className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
            <Briefcase size={14} className="text-[var(--text-muted)]" /> Joined {formatDate(member.createdAt)}
          </p>
        )}
      </div>

      {member.bio && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{member.bio}</p>
        </div>
      )}

      {member.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-4">
          {member.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
        </div>
      )}

      {socials.length > 0 && (
        <div className="mt-4 flex justify-center gap-2 border-t border-[var(--border)] pt-4">
          {socials.map(([key, url]) => {
            const Icon = SOCIAL_ICONS[key] || Globe;
            return (
              <a
                key={key} href={url} target="_blank" rel="noopener noreferrer"
                aria-label={key}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--text)]"
              >
                <Icon size={14} />
              </a>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
