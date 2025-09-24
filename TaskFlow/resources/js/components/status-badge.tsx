import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle2, Timer, PauseCircle, XCircle } from "lucide-react"

export function StatusBadge({status}: {status: string}) {
    const config: Record<
        string,
        { color: string; icon: React.ElementType }
    > = {
        "late": {
            color: "bg-red-500 text-white",
            icon: XCircle,
        },
        "overdue": {
            color: "bg-orange-500 text-white",
            icon: AlertTriangle,
        },
        "urgent": {
            color: "bg-yellow-500 text-black",
            icon: Timer,
        },
        "in progress": {
            color: "bg-blue-500 text-white",
            icon: Clock,
        },
        "in time": {
            color: "bg-green-500 text-white",
            icon: CheckCircle2,
        },
        "not started": {
            color: "bg-gray-500 text-white",
            icon: PauseCircle,
        },
    }

    const { color, icon: Icon } = config[status] ?? {
        color: "bg-gray-300 text-black",
        icon: Clock,
    }

    return (
        <Badge className={`flex items-center gap-1 ${color}`}>
            <Icon className="w-3 h-3" />
            <span className="capitalize">{status}</span>
        </Badge>
    )
}