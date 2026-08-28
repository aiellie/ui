/** Example data. The people a message can be addressed to. */
export interface User {
  id: string
  name: string
  handle: string
  role: string
  /** What the avatar falls back to, which is all this demo needs it to be. */
  initials: string
}

export const users: User[] = [
  {
    id: "marta",
    name: "Marta Oyelaran",
    handle: "marta",
    role: "Engineering",
    initials: "MO",
  },
  {
    id: "ines",
    name: "Inés Bonilla",
    handle: "ines",
    role: "Design",
    initials: "IB",
  },
  {
    id: "sam",
    name: "Sam Whitfield",
    handle: "sam",
    role: "Product",
    initials: "SW",
  },
  {
    id: "kenji",
    name: "Kenji Watanabe",
    handle: "kenji",
    role: "Engineering",
    initials: "KW",
  },
  {
    id: "aoife",
    name: "Aoife Brennan",
    handle: "aoife",
    role: "Support",
    initials: "AB",
  },
  {
    id: "dmitri",
    name: "Dmitri Sokolov",
    handle: "dmitri",
    role: "Data",
    initials: "DS",
  },
]
