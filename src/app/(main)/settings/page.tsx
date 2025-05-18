
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { Trash2, Settings as SettingsIcon, Bell, Palette, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
// useAuth import removed
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Integrations } from '@/components/integrations/Integrations';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  // const { user } = useAuth(); // user removed
  const [isClient, setIsClient] = useState(false);
  const [isClearDataAlertOpen, setIsClearDataAlertOpen] = useState(false);

  const [assessmentReminders, setAssessmentReminders] = useState(true);
  const [goalCheckInReminders, setGoalCheckInReminders] = useState(true);
  const [consultationReminders, setConsultationReminders] = useState(true);
  const [newFeaturesUpdates, setNewFeaturesUpdates] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClearLocalData = () => {
    if (!isClient) return;
    let clearedSomething = false;
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_ASSESSMENT_SCORES)) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_ASSESSMENT_SCORES);
        clearedSomething = true;
      }
      if (localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS_DATA)) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.PROGRESS_DATA);
        clearedSomething = true;
      }
      if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS)) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_GOALS);
        clearedSomething = true;
      }
      if (localStorage.getItem(LOCAL_STORAGE_KEYS.MOOD_ENTRIES)) { // Also clear mood entries
        localStorage.removeItem(LOCAL_STORAGE_KEYS.MOOD_ENTRIES);
        clearedSomething = true;
      }
      if (localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW)) { // Also clear selected flow
        localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW);
        clearedSomething = true;
      }


      if (clearedSomething) {
        toast({
          title: "Local Data Cleared",
          description: "All Manasooth data has been cleared from this browser.",
          className: "bg-primary text-primary-foreground",
        });
      } else {
         toast({
          title: "No Local Data Found",
          description: "There was no Manasooth-specific data found in your browser's local storage to clear.",
        });
      }
    } catch (error) {
      console.error("Failed to clear data from localStorage", error);
      toast({
        title: "Error",
        description: "Could not clear local data. Please try again.",
        variant: "destructive",
      });
    }
    setIsClearDataAlertOpen(false);
  };

  if (!isClient) {
    return null; 
  }

  return (
    <>
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        </header>

        <Card className="shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Data Management</CardTitle>
            <CardDescription>
              Manage application data cached in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Auth-specific alert removed */}
            <p className="text-sm text-muted-foreground">
              This action will remove all Manasooth data (like unfinished assessments, completed assessments, progress history, goals, mood entries, or local settings)
              stored in this browser. This action cannot be undone.
            </p>
            <AlertDialog open={isClearDataAlertOpen} onOpenChange={setIsClearDataAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto shadow-md hover:shadow-lg">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Local Browser Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all Manasooth data cached in this browser. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearLocalData} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Yes, clear local data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
        
        <Card className="shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Bell className="mr-2 h-6 w-6 text-primary" /> Notification Preferences
            </CardTitle>
            <CardDescription>
              Manage how you receive reminders and updates from Manasooth. (UI only for demonstration)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <Label htmlFor="assessment-reminders" className="text-base font-medium">Assessment Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive notifications to complete your periodic wellbeing assessments.</p>
              </div>
              <Switch
                id="assessment-reminders"
                checked={assessmentReminders}
                onCheckedChange={setAssessmentReminders}
                aria-label="Toggle assessment reminders"
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <Label htmlFor="goal-reminders" className="text-base font-medium">Goal Check-in Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminders to check in on your active wellbeing goals.</p>
              </div>
              <Switch
                id="goal-reminders"
                checked={goalCheckInReminders}
                onCheckedChange={setGoalCheckInReminders}
                aria-label="Toggle goal check-in reminders"
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <Label htmlFor="consultation-reminders" className="text-base font-medium">Consultation Reminders</Label>
                <p className="text-sm text-muted-foreground">If you book a consultation, receive reminders about your appointment.</p>
              </div>
              <Switch
                id="consultation-reminders"
                checked={consultationReminders}
                onCheckedChange={setConsultationReminders}
                aria-label="Toggle consultation reminders"
              />
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <Label htmlFor="updates-reminders" className="text-base font-medium">New Features & Updates</Label>
                <p className="text-sm text-muted-foreground">Be notified about new Manasooth features and important updates.</p>
              </div>
              <Switch
                id="updates-reminders"
                checked={newFeaturesUpdates}
                onCheckedChange={setNewFeaturesUpdates}
                aria-label="Toggle new features and updates notifications"
              />
            </div>
            <Alert variant="default" className="bg-accent/10 border-accent/20">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <AlertTitle className="font-semibold text-accent-foreground/90">Work in Progress</AlertTitle>
                <AlertDescription className="text-accent-foreground/80">
                    Actual push notifications and email reminders are planned for a future update. These settings currently only reflect UI preferences.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
                <Palette className="mr-2 h-6 w-6 text-primary"/> Theme Settings (Coming Soon)
            </CardTitle>
            <CardDescription>
              Customize the look and feel of Manasooth.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Theme customization options (e.g., light/dark mode toggle, color accents) will be available in a future update. Stay tuned!</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Integrations</CardTitle>
            <CardDescription>
              Connect with your favorite services like Spotify or fitness trackers to incorporate music, activity levels, and sleep patterns into your wellbeing insights. (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Integrations />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
