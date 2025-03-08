"use client";
import * as React from "react";
import {
  CalendarDays,
  LogOut,
  PieChart,
  User,
  UsersRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FaRegAddressBook } from "react-icons/fa6";
import { NavStandard } from "./nav-standard";
import { Button } from "../ui/button";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  admin: [
    {
      name: "Finans",
      url: "/economy",
      icon: PieChart,
    },
    {
      name: "Medarbejdere",
      url: "/staff",
      icon: UsersRound,
    },
  ],
  projects: [
    {
      name: "Kalender",
      url: "/kalender",
      icon: CalendarDays,
    },
    {
      name: "Find patient",
      url: "/patient",
      icon: User,
    },
  ],
};
export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="w-full flex justify-center h-[30px]">
          <FaRegAddressBook className="h-full w-full" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavStandard sidelinks={data.admin} />
        <NavStandard sidelinks={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem >
            <Button className="w-full justify-center">
              <span>
                <LogOut className="ml-auto size-4" />
              </span>
              <span className="truncate font-semibold">Log ud</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
