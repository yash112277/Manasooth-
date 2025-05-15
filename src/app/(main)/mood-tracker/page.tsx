
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Smile, ListChecks, CalendarDays, StickyNote, Tag, Trash2 } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import type { MoodEntry, MoodLevelValue } from '@/lib/types';
import { MOOD_LABELS } from '@/lib/types';
import { MoodLogForm } from '@/components/mood/MoodLogForm';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
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
import Image from 'next/image';

export default function MoodTrackerPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    loadMoodEntries();
    setIsLoading(false);
  }, [isClient]);

  const loadMoodEntries = () => {
    const storedEntries = localStorage.getItem(LOCAL_STORAGE_KEYS.MOOD_ENTRIES);
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries) as MoodEntry[];
      // Sort by date descending (most recent first)
      parsedEntries.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
      setMoodEntries(parsedEntries);
    }
  };

  const saveMoodEntries = (updatedEntries: MoodEntry[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(updatedEntries));
    // Sort by date descending for display
    updatedEntries.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    setMoodEntries(updatedEntries);
  };

  const handleMoodAdd = (newMoodEntry: MoodEntry) => {
    const updatedEntries = [newMoodEntry, ...moodEntries];
    saveMoodEntries(updatedEntries);
  };

  const handleDeleteMoodEntry = (entryId: string) => {
    const updatedEntries = moodEntries.filter(entry => entry.id !== entryId);
    saveMoodEntries(updatedEntries);
    toast({
      title: "Mood Entry Deleted",
      description: "The selected mood entry has been removed.",
    });
  };
  
  const getMoodEmoji = (moodLevel: MoodLevelValue): string => {
    switch (moodLevel) {
      case 5: return "😄"; // Great
      case 4: return "😊"; // Good
      case 3: return "😐"; // Okay
      case 2: return "😟"; // Bad
      case 1: return "😢"; // Awful
      default: return "🤔";
    }
  };


  if (!isClient || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <p>Loading your mood journal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Smile className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Mood Tracker</h1>
            <p className="text-lg text-muted-foreground">Monitor your daily moods and gain insights.</p>
          </div>
        </div>
      </header>

      <MoodLogForm onMoodAdd={handleMoodAdd} isLoading={isLoading} />

      {moodEntries.length === 0 && !isLoading && (
        <Card className="shadow-xl border-dashed border-2 hover:border-primary transition-all mt-8">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ListChecks className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-semibold">No Moods Logged Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start by logging your current mood using the form above. Tracking your moods can help you understand patterns and triggers.
            </p>
             <div className="relative aspect-video max-w-xs mx-auto rounded-lg overflow-hidden shadow-md">
                 <Image 
                    src="https://placehold.co/300x200.png" 
                    alt="Person reflecting or journaling" 
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                    data-ai-hint="journal mood"
                />
            </div>
          </CardContent>
        </Card>
      )}

      {moodEntries.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center">
            <CalendarDays className="mr-3 h-7 w-7 text-primary" /> Your Mood History
          </h2>
          <div className="space-y-6">
            {moodEntries.map(entry => (
              <Card key={entry.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <span className="text-3xl">{getMoodEmoji(entry.moodLevel)}</span>
                       <CardTitle className="text-xl font-semibold">
                         {MOOD_LABELS[entry.moodLevel]}
                       </CardTitle>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Mood Entry?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this mood entry from {format(parseISO(entry.date), 'PPPp')}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMoodEntry(entry.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                   <p className="text-xs text-muted-foreground pt-1">
                      Logged on: {format(parseISO(entry.date), 'PPPp')}
                    </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {entry.notes && (
                    <div className="flex items-start gap-2">
                      <StickyNote className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 p-2 rounded-md flex-grow">{entry.notes}</p>
                    </div>
                  )}
                  {entry.activities && entry.activities.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex flex-wrap gap-2">
                        {entry.activities.map((activity, index) => (
                          <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!entry.notes && (!entry.activities || entry.activities.length === 0) && (
                     <p className="text-sm text-muted-foreground italic">No additional details logged for this entry.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Alert variant="default" className="bg-accent/10 border-accent/20 mt-10">
        <Smile className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent-foreground/90">Understanding Your Moods</AlertTitle>
        <AlertDescription className="text-accent-foreground/80">
          Regularly tracking your mood can help you identify patterns, understand triggers, and see how different activities or events affect your wellbeing. Over time, this journal can be a valuable tool for self-reflection and discussion with a professional if needed.
        </AlertDescription>
      </Alert>
    </div>
  );
}
