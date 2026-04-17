import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/features/profile/profileApi";
import { ProfileForm } from "@/features/profile/ProfileForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: profileApi.getMe,
  });

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account settings</p>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : user ? (
        <ProfileForm user={user} />
      ) : (
        <p className="text-muted-foreground">Failed to load profile.</p>
      )}
    </main>
  );
}
