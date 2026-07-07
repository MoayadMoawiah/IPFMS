"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { organization, fiscalYears } from "@/lib/mock-data/users";

export default function SettingsPage() {
  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Organization settings updated successfully." });
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure organization profile and system preferences"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings" },
        ]}
        actions={<Button onClick={handleSave}>Save Changes</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>Basic organization information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input defaultValue={organization.name} />
            </div>
            <div className="space-y-2">
              <Label>Arabic Name</Label>
              <Input defaultValue={organization.nameAr} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>System Tagline</Label>
              <Input defaultValue={organization.tagline} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fiscal Year Configuration</CardTitle>
            <CardDescription>Financial period settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Fiscal Year</Label>
              <Select defaultValue="2025">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fiscalYears.map((fy) => (
                    <SelectItem key={fy} value={fy}>FY {fy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fiscal Year Start</Label>
              <Input type="text" defaultValue="January 1" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage email and in-app notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "PR Approval Notifications", defaultChecked: true },
              { label: "Payment Status Updates", defaultChecked: true },
              { label: "Budget Alert Thresholds", defaultChecked: true },
              { label: "Grant Report Reminders", defaultChecked: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between rounded-xl border p-4">
                <Label htmlFor={pref.label}>{pref.label}</Label>
                <Switch id={pref.label} defaultChecked={pref.defaultChecked} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
