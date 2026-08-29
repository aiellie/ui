import { Home } from "./components/home"

/**
 * The route stays a Server Component so the metadata machinery has a server
 * file to hang off; everything visible lives in `components/home.tsx`, on the
 * client side of the boundary with the demo components it renders.
 */
export default function Page() {
  return <Home />
}
