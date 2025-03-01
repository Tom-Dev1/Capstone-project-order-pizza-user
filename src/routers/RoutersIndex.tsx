import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import ActionLayout from "@/pages/Layouts/ActionLayout"
import NotFound from "@/pages/Layouts/NotFound"

const ViewActionPage = lazy(() => import("../pages/ViewActionPage"))
const FoodsHome = lazy(() => import("@/pages/Foods/FoodsHome"))
const Drinks = lazy(() => import("@/pages/Drinks/Drinks"))
const Orders = lazy(() => import("@/pages/Orders/Orders"))
const WelcomePage = lazy(() => import("@/pages/WellComePage"))
const ClosedPage = lazy(() => import("@/pages/ClosedPage"))
const CheckStatusAndRedirect = lazy(() => import("@/hooks/status-check"))
const Loading = lazy(() => import("@/pages/Layouts/LoadingFallBack"))
const RouterIndex = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route index path="/:id" element={<CheckStatusAndRedirect />} />
        <Route path="/closed" element={<ClosedPage />} />
        <Route path="/get-started" element={<WelcomePage />} />
        <Route path="/action" element={<ViewActionPage />} />
        <Route path="/action" element={<ActionLayout />}>
          <Route path="foods" element={<FoodsHome />} />
          <Route path="drinks" element={<Drinks />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default RouterIndex