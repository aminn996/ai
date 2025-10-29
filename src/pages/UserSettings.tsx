import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User, Bell, Shield, Activity } from "lucide-react";

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  bio: string;
  profile_picture_url: string;
  language_preference: string;
  timezone: string;
  theme_mode: string;
  notification_settings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy_level: string;
}

interface ActivityLog {
  id: string;
  action_type: string;
  details: any;
  created_at: string;
}

const UserSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    profile_picture_url: "",
    language_preference: "en",
    timezone: "UTC",
    theme_mode: "system",
    notification_settings: {
      email: true,
      push: true,
      sms: false,
    },
    privacy_level: "standard",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfile();
    fetchActivityLogs();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Failed to load profile");
      return;
    }

    if (data) {
      const notificationSettings = data.notification_settings as any;
      setProfile({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        profile_picture_url: data.profile_picture_url || "",
        language_preference: data.language_preference || "en",
        timezone: data.timezone || "UTC",
        theme_mode: data.theme_mode || "system",
        notification_settings: typeof notificationSettings === 'object' && notificationSettings !== null
          ? {
              email: notificationSettings.email ?? true,
              push: notificationSettings.push ?? true,
              sms: notificationSettings.sms ?? false,
            }
          : {
              email: true,
              push: true,
              sms: false,
            },
        privacy_level: data.privacy_level || "standard",
      });
    }
  };

  const fetchActivityLogs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setActivityLogs(data);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        bio: profile.bio,
        profile_picture_url: profile.profile_picture_url,
        language_preference: profile.language_preference,
        timezone: profile.timezone,
        theme_mode: profile.theme_mode,
        notification_settings: profile.notification_settings,
        privacy_level: profile.privacy_level,
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      toast.error("Failed to update profile");
      return;
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action_type: "profile_updated",
      details: { updated_fields: Object.keys(profile) },
    });

    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold">User Settings</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Bell className="mr-2 h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="mr-2 h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="mr-2 h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Read-only)</Label>
                    <Input id="email" value={profile.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile_picture_url">Profile Picture URL</Label>
                    <Input
                      id="profile_picture_url"
                      value={profile.profile_picture_url}
                      onChange={(e) =>
                        setProfile({ ...profile, profile_picture_url: e.target.value })
                      }
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your experience and notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={profile.language_preference}
                      onValueChange={(value) =>
                        setProfile({ ...profile, language_preference: value })
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                        <SelectItem value="es">Español (Spanish)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={profile.theme_mode}
                      onValueChange={(value) => setProfile({ ...profile, theme_mode: value })}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label>Notifications</Label>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notif">Email Notifications</Label>
                      <Switch
                        id="email-notif"
                        checked={profile.notification_settings.email}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            notification_settings: {
                              ...profile.notification_settings,
                              email: checked,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notif">Push Notifications</Label>
                      <Switch
                        id="push-notif"
                        checked={profile.notification_settings.push}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            notification_settings: {
                              ...profile.notification_settings,
                              push: checked,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notif">SMS Notifications</Label>
                      <Switch
                        id="sms-notif"
                        checked={profile.notification_settings.sms}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            notification_settings: {
                              ...profile.notification_settings,
                              sms: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control how your data is used and who can see your information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="privacy">Privacy Level</Label>
                    <Select
                      value={profile.privacy_level}
                      onValueChange={(value) => setProfile({ ...profile, privacy_level: value })}
                    >
                      <SelectTrigger id="privacy">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Everyone can see</SelectItem>
                        <SelectItem value="standard">Standard - Registered users</SelectItem>
                        <SelectItem value="private">Private - Only me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="mb-2 font-medium">Data Usage</p>
                    <p className="text-muted-foreground">
                      Your data is used to personalize your experience and improve AI
                      recommendations. We never share your personal information with third parties
                      without consent.
                    </p>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Privacy Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>
                    View your recent actions and activity on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground">No activity logs yet</p>
                  ) : (
                    <div className="space-y-4">
                      {activityLogs.map((log) => (
                        <div key={log.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {log.action_type.replace(/_/g, " ").toUpperCase()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserSettings;
