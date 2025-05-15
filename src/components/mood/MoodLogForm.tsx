
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MOOD_LEVELS, MOOD_LABELS, type MoodEntry, type MoodLevelValue } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, SmilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const moodLogSchema = z.object({
  moodLevel: z.coerce.number().min(1).max(5) as z.ZodType<MoodLevelValue>, // Ensure it maps to MoodLevelValue
  notes: z.string().optional(),
  activities: z.string().optional(), // Comma-separated string for now
});

type MoodLogFormValues = z.infer<typeof moodLogSchema>;

interface MoodLogFormProps {
  onMoodAdd: (newMood: MoodEntry) => void;
  isLoading?: boolean;
}

const moodOptions = Object.entries(MOOD_LABELS)
  .map(([value, label]) => ({
    value: parseInt(value) as MoodLevelValue,
    label,
  }))
  .sort((a, b) => b.value - a.value); // Display from Great to Awful

export function MoodLogForm({ onMoodAdd, isLoading = false }: MoodLogFormProps) {
  const { toast } = useToast();
  const form = useForm<MoodLogFormValues>({
    resolver: zodResolver(moodLogSchema),
    defaultValues: {
      moodLevel: MOOD_LEVELS.OKAY,
      notes: '',
      activities: '',
    },
  });

  const onSubmit = (data: MoodLogFormValues) => {
    const activitiesArray = data.activities?.split(',').map(activity => activity.trim()).filter(activity => activity) || [];
    
    const newMoodEntry: MoodEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      moodLevel: data.moodLevel,
      notes: data.notes,
      activities: activitiesArray,
    };
    onMoodAdd(newMoodEntry);
    form.reset(); // Reset form after submission
    toast({
      title: "Mood Logged",
      description: `You've successfully logged your mood as "${MOOD_LABELS[data.moodLevel]}".`,
      className: "bg-primary text-primary-foreground",
    });
  };

  return (
    <Card className="shadow-xl w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <SmilePlus className="mr-2 h-7 w-7 text-primary" /> How are you feeling?
        </CardTitle>
        <CardDescription>Log your current mood, add some notes or activities if you like.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-semibold">Select your mood:</Label>
            <Controller
              name="moodLevel"
              control={form.control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => field.onChange(parseInt(value) as MoodLevelValue)}
                  value={field.value?.toString()}
                  className="mt-2 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3"
                >
                  {moodOptions.map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={`mood-${option.value}`}
                      className={`flex flex-col items-center justify-center p-3 rounded-md border cursor-pointer transition-all text-sm hover:shadow-md
                        ${field.value === option.value
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                          : 'bg-card hover:bg-accent hover:text-accent-foreground'
                        }`}
                    >
                      <RadioGroupItem value={option.value.toString()} id={`mood-${option.value}`} className="sr-only" />
                      <span>{option.label}</span>
                      {/* Consider adding icons for moods here */}
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
            {form.formState.errors.moodLevel && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.moodLevel.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes" className="text-base font-semibold">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Any thoughts or details about your mood..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="activities" className="text-base font-semibold">Activities/Tags (Optional)</Label>
            <Input
              id="activities"
              {...form.register('activities')}
              placeholder="e.g., work, exercise, social (comma-separated)"
              className="mt-1"
            />
             <p className="text-xs text-muted-foreground mt-1">Separate activities with a comma.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className={cn("w-full sm:w-auto btn-neumorphic")} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SmilePlus className="mr-2 h-4 w-4" />}
            Log Mood
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
