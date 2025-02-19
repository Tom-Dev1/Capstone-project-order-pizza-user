import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import ActionLayout from "@/pages/ActionLayout"
import NotFound from "@/pages/NotFound"

const ViewActionPage = lazy(() => import("../pages/ViewActionPage"))
const OrderHome = lazy(() => import("../pages/OrderHome"))
const Drinks = lazy(() => import("@/pages/Drinks"))
const Orders = lazy(() => import("@/pages/Orders"))
const WelcomePage = lazy(() => import("@/pages/WellComePage"))

const RouterIndex = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/action" element={<ViewActionPage />} />
        <Route path="/action" element={<ActionLayout />}>
          <Route path="foods" element={<OrderHome />} />
          <Route path="drinks" element={<Drinks />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default RouterIndex