import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { SkillTagInput } from "@/components/SkillTagInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { userService } from "@/services/userService";

export const Route = createFileRoute("/profile/edit")({
  head: () => ({
    meta: [
      { title: "Edit Profile — Skill Verse" },
      {
        name: "description",
        content: "Update your details and the skills you teach and want to learn.",
      },
      { property: "og:title", content: "Edit Profile — Skill Verse" },
      { property: "og:description", content: "Update your Skill Verse profile and skills." },
    ],
  }),
  component: EditProfilePage,
});

function EditProfilePage() {
  const { user } = useRequireAuth();
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    college: user?.college ?? "",
    branch: user?.branch ?? "",
    year: user?.year ?? "",
    bio: user?.bio ?? "",
    teachSkills: user?.teachSkills ?? [],
    learnSkills: user?.learnSkills ?? [],
  });

  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    setUploading(true);
    try {
      const updated = await userService.uploadPhoto(user.id, file);
      if (updated.profileImage) updateUser({ profileImage: updated.profileImage });
      toast.success("Photo updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload photo");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await userService.updateUser(user.id, form);
      updateUser(form);
      toast.success("Profile updated");
      navigate({ to: "/profile" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    }
  }

  return (
    <AppLayout title="Edit Profile" description="Keep your details and skills up to date.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-xl font-semibold text-muted-foreground">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="photo"
                  className="inline-flex h-9 cursor-pointer items-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent"
                >
                  {uploading ? "Uploading..." : "Change photo"}
                </Label>
                <input
                  id="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={uploading}
                  onChange={handlePhoto}
                />
                <p className="text-xs text-muted-foreground">JPG, PNG, WEBP or GIF, up to 5 MB.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <SkillTagInput
              label="Skills I Can Teach"
              skills={form.teachSkills}
              onChange={(teachSkills) => setForm({ ...form, teachSkills })}
            />
            <SkillTagInput
              label="Skills I Want To Learn"
              skills={form.learnSkills}
              onChange={(learnSkills) => setForm({ ...form, learnSkills })}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/profile" })}>
            Cancel
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
