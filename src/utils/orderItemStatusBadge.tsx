import { Badge } from "@/src/components/ui/badge"


export const getOrderItemStatusBadge = (status: string) => {
    switch (status) {
        case "Pending":
            return (
                <Badge className="bg-amber-100 hover:bg-amber-300 border-amber-500 text-xs px-1">
                    <div className="text-amber-600 text-center w-[98px] py-0.4">Đang chờ</div>
                </Badge>
            )
        case "Cancelled":
            return (
                <Badge className="bg-red-100 hover:bg-red-300 border-red-500 text-xs px-1">
                    <div className="text-red-600 text-center w-[98px] py-0.4">Đã hủy</div>
                </Badge>
            )
        case "Serving":
            return (
                <Badge className="bg-blue-100 hover:bg-blue-300 border-blue-500 text-xs px-1">
                    <div className="text-blue-600 text-center w-[98px] py-0.4">Đang phục vụ</div>
                </Badge>
            )
        case "Done":
            return (
                <Badge className="bg-green-100 hover:bg-green-300 border-green-500 text-xs px-1">
                    <div className="text-green-600 text-center w-[98px] py-0.4">Hoàn thành</div>
                </Badge>
            )
        case "Cooking":
            return (
                <Badge className="bg-orange-100 hover:bg-orange-300 border-orange-500 text-xs px-1">
                    <div className="text-orange-600 text-center w-[98px] py-0.4">Đang nấu</div>
                </Badge>
            )
        default:
            return null
    }
}
