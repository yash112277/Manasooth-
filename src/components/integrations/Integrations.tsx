"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Music, Activity } from 'lucide-react';

export function Integrations() {
  return (
    <div className="space-y-6">
      <Card className="bg-card/80 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Music className="mr-2 h-5 w-5 text-green-500" />
            Spotify Relaxation Playlists
          </CardTitle>
           {/* <Button variant="outline" size="sm" disabled>Connect (Coming Soon)</Button> */}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect your Spotify account to access curated playlists designed for relaxation, focus, and sleep.
          </p>
          <Button variant="outline" size="sm" disabled className="mt-4">Connect Spotify (Coming Soon)</Button>
        </CardContent>
      </Card>

      <Card className="bg-card/80 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
             <Activity className="mr-2 h-5 w-5 text-blue-500" />
            Fitness & Sleep Tracker
          </CardTitle>
          {/* <Button variant="outline" size="sm" disabled>Connect (Coming Soon)</Button> */}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sync data from your favorite fitness tracker (e.g., Fitbit, Apple Health, Google Fit) to incorporate activity levels and sleep patterns (like sleep schedule and duration) into your wellbeing insights.
          </p>
          <Button variant="outline" size="sm" disabled className="mt-4">Connect Tracker (Coming Soon)</Button>
        </CardContent>
      </Card>
       <Card className="bg-accent/10 border-accent/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Smartphone className="mr-2 h-5 w-5 text-primary" />
            Manasooth Mobile App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Our dedicated mobile app for iOS and Android is under development! Enjoy seamless access, personalized reminders, and more, all on the go.
          </p>
          <Button variant="link" size="sm" disabled className="mt-2 p-0 h-auto text-primary">Learn More (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}

