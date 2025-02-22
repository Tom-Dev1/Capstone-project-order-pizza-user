import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/stores/store"

export const useAppDispatch = () => useDispatch<AppDispatch>()

