import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-yellow-500 text-black text-sm font-medium px-4 py-2 rounded-full shadow-lg">
      <WifiOff className="w-4 h-4" />
      You are offline. Some content may be unavailable.
    </div>
  );
}
