import BottomTabs from "@/components/BottomTabs"
import { Outlet } from "react-router-dom"

const ActionLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <Outlet />
            </main>
            <BottomTabs />
        </div>
    )
}

export default ActionLayout