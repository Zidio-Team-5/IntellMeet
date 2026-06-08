import {
  LayoutDashboard,
  Video,
  CheckSquare,
  BarChart3,
  Sparkles,
  Search,
  Users,
  User,
  Settings,
  History,
} from "lucide-react";

export const NAV_LINKS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    description: "Overview & insights",
  },
  {
    icon: Video,
    label: "Meetings",
    path: "/meetings",
    description: "Create & manage meetings",
  },
  {
    icon: History,
    label: "History",
    path: "/history",
    description: "Past meetings & summaries",
  },
  {
    icon: CheckSquare,
    label: "Tasks",
    path: "/tasks",
    description: "Kanban & task tracking",
  },
  {
    icon: Sparkles,
    label: "AI Workspace",
    path: "/ai",
    description: "AI assistant & summaries",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/analytics",
    description: "Performance & insights",
  },
  {
    icon: Search,
    label: "Search",
    path: "/search",
    description: "Global search",
  },
  {
    icon: Users,
    label: "Team",
    path: "/team",
    description: "Directory & presence",
  },
  {
    icon: User,
    label: "Profile",
    path: "/profile",
    description: "Account settings",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    description: "Preferences",
  },
];
