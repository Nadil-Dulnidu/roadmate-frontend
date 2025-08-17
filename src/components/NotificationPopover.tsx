import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from "lucide-react"

export function NotificationPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost"><Bell className="size-6" /></Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-80 overflow-auto">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium text-lg">Notifications</h4>
            <p className="text-muted-foreground text-sm">
              You have new notifications.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
