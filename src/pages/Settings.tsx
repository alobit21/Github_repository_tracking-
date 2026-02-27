import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Mail, Shield, Palette, Database, Menu } from "lucide-react";

interface UserSettings {
  notifications: boolean;
  emailAlerts: boolean;
  theme: 'dark' | 'light';
  language: string;
  timezone: string;
  dataRetention: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    emailAlerts: true,
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    dataRetention: 30
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          activeItem="settings"
          onItemClick={(item) => {
            console.log('Navigate to:', item.id);
            setIsSidebarOpen(false);
          }}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border">
          <Header />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden sticky top-16 z-20 bg-background border-b border-border px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Settings</h1>
              <p className="text-secondary text-sm sm:text-base">Manage your account preferences and notification settings.</p>
            </div>

            <div className="space-y-6">
              {/* Profile Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Display Name</label>
                      <input 
                        type="text" 
                        defaultValue="John Doe"
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Email</label>
                      <input 
                        type="email" 
                        defaultValue="john.doe@example.com"
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-medium text-primary">Push Notifications</p>
                        <p className="text-sm text-secondary">Receive browser notifications for important alerts</p>
                      </div>
                      <Button
                        variant={settings.notifications ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSetting('notifications', !settings.notifications)}
                        className="w-full sm:w-auto"
                      >
                        {settings.notifications ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-medium text-primary">Email Alerts</p>
                        <p className="text-sm text-secondary">Get daily digest and critical alerts via email</p>
                      </div>
                      <Button
                        variant={settings.emailAlerts ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSetting('emailAlerts', !settings.emailAlerts)}
                        className="w-full sm:w-auto"
                      >
                        {settings.emailAlerts ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Theme</label>
                      <select 
                        value={settings.theme}
                        onChange={(e) => updateSetting('theme', e.target.value as 'dark' | 'light')}
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-primary"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Language</label>
                      <select 
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-primary"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data & Privacy Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Data Retention</label>
                      <select 
                        value={settings.dataRetention}
                        onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))}
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-primary"
                      >
                        <option value={7}>7 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                        <option value={365}>1 year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">Timezone</label>
                      <select 
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-primary"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="CET">Central European</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Download Email History
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red">
                      <Shield className="w-4 h-4 mr-2" />
                      Delete My Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-start sm:justify-end">
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-w-32 w-full sm:w-auto"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
