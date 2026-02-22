'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/contexts/app-context";
import { useNotifications } from "@/components/infralith/NotificationBell";
import { useToast } from "@/hooks/use-toast";
import {
  Settings, Sun, Moon, Monitor, Bell, BellOff, Shield, Database,
  Palette, LogOut, Trash2, User, Key, Globe, ChevronRight,
  CheckCircle, Cloud, Cpu, ToggleLeft, AlertTriangle, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

type Section = 'appearance' | 'notifications' | 'security' | 'azure' | 'account';

export default function SettingsPage() {
  const { user, toggleTheme, theme, handleLogout } = useAppContext();
  const { addNotification, clearAll } = useNotifications();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<Section>('appearance');

  // Appearance
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(theme === 'dark' ? 'dark' : 'light');

  // Notifications
  const [notifSettings, setNotifSettings] = useState({
    blueprintComplete: true,
    teamMessages: true,
    complianceAlerts: true,
    systemUpdates: false,
  });

  // Security
  const [showKey, setShowKey] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');


  const navItems: { key: Section; label: string; icon: any; desc: string }[] = [
    { key: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme & display' },
    { key: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alerts & pings' },
    { key: 'security', label: 'Security', icon: Shield, desc: 'Auth & sessions' },
    { key: 'azure', label: 'Azure Services', icon: Cloud, desc: 'API configuration' },
    { key: 'account', label: 'Account', icon: User, desc: 'Manage your profile' },
  ];

  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    setSelectedTheme(t);
    if ((t === 'dark') !== (theme === 'dark')) toggleTheme();
    toast({ title: 'Theme Updated', description: `Switched to ${t} mode.` });
  };

  const saveNotifications = () => {
    toast({ title: 'Preferences Saved', description: 'Notification settings updated.' });
  };

  const sendTestNotif = () => {
    addNotification({
      type: 'success',
      title: 'Test Notification',
      body: 'Your notification system is working correctly.',
    });
    toast({ title: 'Test Sent', description: 'Check the bell icon for the test notification.' });
  };

  const azureServices = [
    { name: 'Azure OpenAI (GPT-4o)', status: 'configured', key: 'AZURE_OPENAI_KEY', endpoint: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || 'infralith.centralindia.openai.azure.com' },
    { name: 'Azure Document Intelligence', status: 'configured', key: 'AZURE_DOCUMENT_INTELLIGENCE_KEY', endpoint: 'infralith.cognitiveservices.azure.com' },
    { name: 'Azure Cosmos DB', status: 'configured', key: 'AZURE_COSMOS_CONNECTION_STRING', endpoint: 'Cosmos DB (East US)' },
    { name: 'Microsoft Entra ID', status: 'configured', key: 'AZURE_AD_CLIENT_ID', endpoint: 'Azure Active Directory' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your workspace, appearance, and integrations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Nav */}
        <Card className="premium-glass md:col-span-1 h-fit">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                    activeSection === item.key
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none">{item.label}</p>
                    <p className="text-[10px] mt-0.5 opacity-70 hidden lg:block">{item.desc}</p>
                  </div>
                  <ChevronRight className={cn("h-3 w-3 shrink-0 transition-transform", activeSection === item.key ? "rotate-90 text-primary" : "opacity-30")} />
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Right Panel */}
        <div className="md:col-span-3 space-y-4">

          {/* APPEARANCE */}
          {activeSection === 'appearance' && (
            <Card className="premium-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Palette className="h-5 w-5 text-primary" /> Appearance</CardTitle>
                <CardDescription>Customize how Infralith looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'dark', 'system'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => applyTheme(t === 'system' ? 'dark' : t)}
                        className={cn(
                          "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                          selectedTheme === t ? "border-primary bg-primary/10" : "border-white/10 bg-muted/20 hover:border-white/30"
                        )}
                      >
                        {t === 'light' && <Sun className="h-6 w-6" />}
                        {t === 'dark' && <Moon className="h-6 w-6" />}
                        {t === 'system' && <Monitor className="h-6 w-6" />}
                        <span className="text-xs font-bold capitalize">{t}</span>
                        {selectedTheme === t && <CheckCircle className="h-3 w-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Dense Layout</p>
                    <p className="text-xs text-muted-foreground">Compact sidebar and smaller spacing</p>
                  </div>
                  <Switch onCheckedChange={() => toast({ title: 'Coming Soon', description: 'Dense layout will be available in v2.' })} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Reduce Motion</p>
                    <p className="text-xs text-muted-foreground">Disable animations for accessibility</p>
                  </div>
                  <Switch onCheckedChange={() => toast({ title: 'Coming Soon', description: 'This preference will be saved in v2.' })} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <Card className="premium-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Bell className="h-5 w-5 text-primary" /> Notifications</CardTitle>
                <CardDescription>Choose which alerts you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { key: 'blueprintComplete', label: 'Blueprint Analysis Complete', desc: 'Get notified when the AI pipeline finishes processing.' },
                  { key: 'teamMessages', label: 'Team Messages', desc: 'Ping when a colleague sends you a workspace message.' },
                  { key: 'complianceAlerts', label: 'Compliance Violations', desc: 'Alert when a critical compliance conflict is found.' },
                  { key: 'systemUpdates', label: 'System & Platform Updates', desc: 'Admin announcements and platform-level changes.' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifSettings[item.key as keyof typeof notifSettings]}
                      onCheckedChange={v => setNotifSettings(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}

                <Separator className="bg-white/10" />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={saveNotifications} className="flex-1 bg-primary font-bold shadow-lg shadow-primary/20">Save Preferences</Button>
                  <Button onClick={sendTestNotif} variant="outline" className="flex-1 border-primary/30 text-primary hover:bg-primary/10">Send Test Notification</Button>
                  <Button onClick={clearAll} variant="ghost" className="flex-1 text-muted-foreground hover:text-destructive">
                    <BellOff className="h-4 w-4 mr-2" /> Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SECURITY */}
          {activeSection === 'security' && (
            <Card className="premium-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Shield className="h-5 w-5 text-primary" /> Security</CardTitle>
                <CardDescription>Manage authentication and session settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-500">Microsoft Entra ID Active</p>
                    <p className="text-xs text-green-500/70">Your session is secured via Azure Active Directory enterprise authentication.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Enforced by your Azure AD tenant policy</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 border">Enforced</Badge>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={sessionTimeout}
                    onChange={e => setSessionTimeout(e.target.value)}
                    className="max-w-[120px] bg-muted/30 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">Your session will auto-expire after this duration of inactivity.</p>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Active Sessions</Label>
                  <div className="space-y-2">
                    {[
                      { device: 'Chrome on Windows 11', location: 'Mumbai, IN', time: 'Now' },
                      { device: 'Infralith Mobile App', location: 'Bangalore, IN', time: '2h ago' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-white/5">
                        <div>
                          <p className="text-xs font-semibold">{s.device}</p>
                          <p className="text-[10px] text-muted-foreground">{s.location} · {s.time}</p>
                        </div>
                        {i === 0 ? (
                          <Badge className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">Current</Badge>
                        ) : (
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:text-red-500 hover:bg-red-500/10">Revoke</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AZURE SERVICES */}
          {activeSection === 'azure' && (
            <Card className="premium-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Cloud className="h-5 w-5 text-primary" /> Azure Service Configuration</CardTitle>
                <CardDescription>View and verify your connected Azure AI services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {azureServices.map((svc, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/20 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">{svc.name}</span>
                      </div>
                      <Badge className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20 border flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        Configured
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{svc.endpoint}</p>
                  </div>
                ))}

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 mt-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-500/90">API keys are managed via <span className="font-bold">.env.local</span> and are never exposed to the client. Azure Key Vault integration is recommended for production deployment.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ACCOUNT */}
          {activeSection === 'account' && (
            <Card className="premium-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><User className="h-5 w-5 text-primary" /> Account</CardTitle>
                <CardDescription>Manage your profile and account actions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-white/5">
                  <div className="h-14 w-14 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-black text-2xl">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-base">{user?.name || 'Unknown User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || '—'}</p>
                    <Badge className="mt-1 text-[10px] bg-primary/10 text-primary border-primary/20 border">{user?.role || 'Engineer'}</Badge>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-3">
                  {[
                    { label: 'Edit Profile', icon: User, action: () => toast({ title: 'Navigate to Profile', description: 'Go to "My Profile" from the top-right menu.' }) },
                    { label: 'Change Language', icon: Globe, action: () => toast({ title: 'Coming Soon', description: 'Multi-language support coming in v2.' }) },
                    { label: 'Export My Data', icon: Database, action: () => toast({ title: 'Export Started', description: 'Your data export will be ready in a few minutes.' }) },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </button>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-border hover:border-muted-foreground justify-start gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive justify-start gap-2"
                    onClick={() => {
                      if (confirm('Are you sure? This action is permanent and cannot be undone.')) {
                        localStorage.clear();
                        sessionStorage.clear();
                        handleLogout();
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
