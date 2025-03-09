"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [themeIcon , setThemeIcon] = useState()

  useEffect(() => {
    setThemeIcon(() => HandleShowIcon())
  },[theme])

  function Handletheme() {
    if (theme == "dark") setTheme("light");
    else setTheme("dark");
  }

  function HandleShowIcon() {
    if (theme == "dark") {
      return (
        <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-100 "/>
      )
    }
    else {
      return (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-100 "/>
      )
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={() => Handletheme()}>
      {themeIcon}
    </Button>
  );
}
