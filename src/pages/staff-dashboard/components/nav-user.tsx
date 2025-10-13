import { Avatar, AvatarFallback} from "@/components/ui/avatar";
import { UserButton, useUser } from "@clerk/clerk-react";

export function NavUser() {

  const {user} = useUser();

  return (
    <div className="flex justify-between align-middle items-centerS gap-4">
      <Avatar className="h-8 w-8 rounded-lg">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user?.firstName} {user?.lastName}</span>
        <span className="truncate text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
      </div>
    </div>
  );
}
