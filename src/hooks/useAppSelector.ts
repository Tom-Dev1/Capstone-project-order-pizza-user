import { useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import type { RootState } from "@/redux/stores/store"

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

