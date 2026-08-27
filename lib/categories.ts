import {
    AiElementsIcon,
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
      name: "UI",
      slug: "ui",
      hidden: false,
      icon: AiElementsIcon,
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