import Footer from "./Footer"
import Header from "./Header"

export default function PageLayout({ children }) {
  return <><Header /><main>{children}</main><Footer /></>
}
