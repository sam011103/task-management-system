import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SquarePen } from "lucide-react"

export default function EditIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SquarePen
            size={24}
            className="p-1 rounded cursor-pointer"
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}