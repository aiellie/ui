/** Example data. The people a message can be addressed to. */
export interface User {
  id: string
  name: string
  handle: string
  role: string
  /** What stands in for the avatar until it loads, and if it never does. */
  initials: string
  /** A picture, served from elsewhere — hence the initials underneath it. */
  avatar: string
}

export const users: User[] = [
  {
    id: "marta",
    name: "Marta Oyelaran",
    handle: "marta",
    role: "Engineering",
    initials: "MO",
    avatar: "https://avatar.aiellie.dev/marta.svg?",
  },
  {
    id: "ines",
    name: "Inés Bonilla",
    handle: "ines",
    role: "Design",
    initials: "IB",
    avatar: "https://avatar.aiellie.dev/ines.svg?",
  },
  {
    id: "sam",
    name: "Sam Whitfield",
    handle: "sam",
    role: "Product",
    initials: "SW",
    avatar: "https://avatar.aiellie.dev/sam.svg?",
  },
  {
    id: "kenji",
    name: "Kenji Watanabe",
    handle: "kenji",
    role: "Engineering",
    initials: "KW",
    avatar: "https://avatar.aiellie.dev/kenji.svg?",
  },
  {
    id: "aoife",
    name: "Aoife Brennan",
    handle: "aoife",
    role: "Support",
    initials: "AB",
    avatar: "https://avatar.aiellie.dev/aoife.svg?",
  },
  {
    id: "dmitri",
    name: "Dmitri Sokolov",
    handle: "dmitri",
    role: "Data",
    initials: "DS",
    avatar: "https://avatar.aiellie.dev/dmitri.svg?",
  },
]
