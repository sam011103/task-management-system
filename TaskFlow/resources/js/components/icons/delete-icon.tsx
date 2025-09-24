import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Trash2 } from "lucide-react"
import { useForm} from "@inertiajs/react"

export default function DeleteIcon({action}: {action: string}) {
  const { delete: destroy } = useForm() // ✅ top level

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this?")) {
      destroy(action,{
        preserveScroll: true,
      })
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Trash2
            size={24}
            className="p-1 rounded cursor-pointer"
            onClick={handleDelete}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}