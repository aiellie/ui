import {
    AiElementsIcon,
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
      name: "Messages",
      slug: "messages",
      hidden: false,
      icon: MessageSquareDotIcon,
    }
  ];