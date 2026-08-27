import {
    ColorsIcon,
    AiContentGenerator02Icon,
    SquareTerminalIcon,
    MessageSquareDotIcon,
  } from "@hugeicons/core-free-icons";
  import type { IconSvgElement } from "@hugeicons/react";
  
  export interface RegistryCategory {
    name: string;
    slug: string;
    hidden: boolean;
    icon: IconSvgElement;
  }
  
  export const registryCategories: RegistryCategory[] = [
    {
      name: "Colors",
      slug: "colors",
      hidden: false,
      icon: ColorsIcon,
    },
    {
      name: "Typography",
      slug: "typography",
      hidden: false,
      icon: AiContentGenerator02Icon,
    },
    {
      name: "Coding",
      slug: "coding",
      hidden: false,
      icon: SquareTerminalIcon,
    },
    {
      name: "Messages",
      slug: "messages",
      hidden: false,
      icon: MessageSquareDotIcon,
    }
  ];