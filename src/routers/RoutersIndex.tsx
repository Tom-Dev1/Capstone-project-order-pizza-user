import { Route, Routes } from "react-router-dom";
import { LoginPage, ViewActionPage } from "../pages";




const RouterIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/action" element={<ViewActionPage />} />
    </Routes>
  )
}

export default RouterIndex