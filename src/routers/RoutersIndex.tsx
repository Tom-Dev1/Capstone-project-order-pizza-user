import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import ActionLayout from "@/pages/Layouts/ActionLayout"
import NotFound from "@/pages/Layouts/NotFound"

const ViewActionPage = lazy(() => import("../pages/ViewActionPage"))
const OrderHome = lazy(() => import("../pages/Foods/OrderHome"))
const Drinks = lazy(() => import("@/pages/Drinks/Drinks"))
const Orders = lazy(() => import("@/pages/Orders/Orders"))
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