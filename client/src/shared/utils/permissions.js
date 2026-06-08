import { USER_ROLES } from "./constants.js";

export function isAdmin(user) {
  return user?.role === USER_ROLES.ADMIN;
}

export function isMember(user) {
  return user?.role === USER_ROLES.MEMBER;
}

export function canManageMeeting(user, meeting) {
  if (!user || !meeting) return false;
  return isAdmin(user) || String(meeting.host) === String(user._id || user.id);
}

export function canAssignTask(user) {
  return isAdmin(user);
}

export function canViewAnalytics(user) {
  return !!user;
}
