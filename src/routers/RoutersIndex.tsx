import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ActionLayout from '@/pages/Layouts/ActionLayout'
import NotFound from '@/pages/Layouts/NotFound'
import QRScannerPage from '@/pages/QRScanPage'

const ViewActionPage = lazy(() => import('../pages/ViewActionPage'))
const FoodsHome = lazy(() => import('@/pages/Foods/FoodsHome'))
const Orders = lazy(() => import('@/pages/Orders/TabOrders'))
const LoginPage = lazy(() => import('@/pages/WellComePage'))
const ClosedPage = lazy(() => import('@/pages/ClosedPage'))
const CheckStatusAndRedirect = lazy(() => import('@/hooks/status-check'))
const Loading = lazy(() => import('@/pages/Layouts/LoadingFallBack'))
const RouterIndex = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route index={true} path='/:id' element={<CheckStatusAndRedirect />} />
        <Route path='/closed' element={<ClosedPage />} />
        <Route path='/get-started/:id' element={<LoginPage />} />
        <Route path='/action' element={<ViewActionPage />} />
        <Route path='/qr-scanner' element={<QRScannerPage />} />
        <Route path='/action' element={<ActionLayout />}>
          <Route path='foods' element={<FoodsHome />} />
          <Route path='orders' element={<Orders />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default RouterIndex
