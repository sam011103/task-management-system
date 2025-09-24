import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "@inertiajs/react"
import { SquarePen } from "lucide-react"

export default function EditIcon({
  action,
  disabled = false
}: {
  action: string
  disabled?: boolean
}) {
  return (
    <TooltipProvider>
    {!disabled ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={action} prefetch={true}>
            <SquarePen size={24} className="p-1 rounded cursor-pointer" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>
    ) : (
      <SquarePen size={24} className="p-1 rounded text-gray-400" />
    )}
  </TooltipProvider>
  
       
  )
}