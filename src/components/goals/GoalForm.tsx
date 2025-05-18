
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ASSESSMENT_NAMES, ASSESSMENT_TYPES, LOCAL_STORAGE_KEYS, type AssessmentTypeValue } from '@/lib/constants';
import { GOAL_DEFINITION_TYPES, type UserGoal, type GoalDefinitionType } from '@/lib/types';
import type { CompletedAssessmentSet, CurrentScores } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Create an array of valid AssessmentTypeValue from ASSESSMENT_TYPES
const validAssessmentTypes = Object.values(ASSESSMENT_TYPES) as [AssessmentTypeValue, ...AssessmentTypeValue[]];

const goalFormSchema = z.object({
  assessmentType: z.enum(validAssessmentTypes), // Use z.enum with the array of valid types
  goalDefinitionType: z.nativeEnum(GOAL_DEFINITION_TYPES),
  targetValue: z.coerce.number().min(0, "Target value must be positive."),
  targetDate: z.date().optional(),
  notes: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  onGoalAdd: (newGoal: UserGoal) => void;
  existingGoal?: UserGoal | null;
  closeDialog?: () => void;
}

export function GoalForm({ onGoalAdd, existingGoal = null, closeDialog }: GoalFormProps) {
  const [currentScores, setCurrentScores] = useState<Partial<Record<AssessmentTypeValue, number | undefined>>>({
    [ASSESSMENT_TYPES.WHO5]: undefined,
    [ASSESSMENT_TYPES.GAD7]: undefined,
    [ASSESSMENT_TYPES.PHQ9]: undefined,
  });
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      assessmentType: existingGoal?.assessmentType || ASSESSMENT_TYPES.GAD7,
      goalDefinitionType: existingGoal?.goalDefinitionType || GOAL_DEFINITION_TYPES.REACH_SPECIFIC_SCORE,
      targetValue: existingGoal?.targetValue || 0,
      targetDate: existingGoal?.targetDate ? parseISO(existingGoal.targetDate) : undefined,
      notes: existingGoal?.notes || '',
    },
  });

  const watchedAssessmentType = form.watch('assessmentType');

  useEffect(() => {
    setIsLoadingScores(true);
    const progressDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS_DATA);
    if (progressDataString) {
      try {
        const allProgress = JSON.parse(progressDataString) as CompletedAssessmentSet[];
        if (allProgress.length > 0) {
          const latestProgress = allProgress.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())[0];
          setCurrentScores({
            [ASSESSMENT_TYPES.WHO5]: latestProgress.who5Score,
            [ASSESSMENT_TYPES.GAD7]: latestProgress.gad7Score,
            [ASSESSMENT_TYPES.PHQ9]: latestProgress.phq9Score,
          });
        }
      } catch (e) {
        console.error("Error parsing progress data for goal form:", e);
        // Keep currentScores as initially set (all undefined)
      }
    }
    setIsLoadingScores(false);
  }, []);

  const onSubmit = (data: GoalFormValues) => {
    setFormError(null);
    const startScore = currentScores[data.assessmentType];

    if (startScore === undefined && data.goalDefinitionType === GOAL_DEFINITION_TYPES.IMPROVE_CURRENT_SCORE) {
      setFormError(`You need to complete a ${ASSESSMENT_NAMES[data.assessmentType]} assessment first to set an improvement goal.`);
      return;
    }
    
    let description = "";
    if (data.goalDefinitionType === GOAL_DEFINITION_TYPES.REACH_SPECIFIC_SCORE) {
      description = `Reach a score of ${data.targetValue} for ${ASSESSMENT_NAMES[data.assessmentType]}.`;
    } else {
      const improvementDirection = (data.assessmentType === ASSESSMENT_TYPES.WHO5) ? "increase" : "decrease";
      description = `Improve ${ASSESSMENT_NAMES[data.assessmentType]} score by ${data.targetValue} points (current goal: ${improvementDirection} score).`;
    }
    if (data.targetDate) {
        description += ` By ${format(data.targetDate, "PPP")}.`;
    }


    const newGoal: UserGoal = {
      id: existingGoal?.id || crypto.randomUUID(),
      assessmentType: data.assessmentType,
      goalDefinitionType: data.goalDefinitionType,
      targetValue: data.targetValue,
      targetDate: data.targetDate?.toISOString(),
      startDate: existingGoal?.startDate || new Date().toISOString(),
      status: existingGoal?.status || 'active',
      startScore: startScore === undefined ? 0 : startScore, 
      notes: data.notes,
      description: description,
    };

    onGoalAdd(newGoal);
    if (closeDialog) closeDialog();
  };

  const currentSelectedScore = currentScores[watchedAssessmentType];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="assessmentType">Assessment Type</Label>
        <Controller
          name="assessmentType"
          control={form.control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="assessmentType">
                <SelectValue placeholder="Select assessment" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ASSESSMENT_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {ASSESSMENT_NAMES[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
         {isLoadingScores && <Loader2 className="h-4 w-4 animate-spin mt-1" />}
         {!isLoadingScores && currentSelectedScore !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">Your current score: {currentSelectedScore}</p>
         )}
         {!isLoadingScores && currentSelectedScore === undefined && (
            <p className="text-sm text-destructive mt-1">No current score found for {ASSESSMENT_NAMES[watchedAssessmentType]}. Please complete an assessment.</p>
         )}
      </div>

      <div>
        <Label htmlFor="goalDefinitionType">Goal Type</Label>
        <Controller
          name="goalDefinitionType"
          control={form.control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="goalDefinitionType">
                <SelectValue placeholder="Select goal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GOAL_DEFINITION_TYPES.REACH_SPECIFIC_SCORE}>
                  Reach a Specific Score
                </SelectItem>
                <SelectItem value={GOAL_DEFINITION_TYPES.IMPROVE_CURRENT_SCORE} disabled={currentSelectedScore === undefined}>
                  Improve Current Score by X points
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      
      <div>
        <Label htmlFor="targetValue">Target Value</Label>
        <Input
          id="targetValue"
          type="number"
          {...form.register('targetValue')}
          placeholder={
            form.watch('goalDefinitionType') === GOAL_DEFINITION_TYPES.REACH_SPECIFIC_SCORE 
            ? "Enter target score" 
            : "Enter points to improve by"
          }
        />
        {form.formState.errors.targetValue && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.targetValue.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="targetDate">Target Date (Optional)</Label>
        <Controller
          name="targetDate"
          control={form.control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          {...form.register('notes')}
          placeholder="Any personal notes about this goal..."
        />
      </div>

      <div className="flex justify-end gap-2">
        {closeDialog && <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>}
        <Button type="submit" disabled={form.formState.isSubmitting || (form.watch('goalDefinitionType') === GOAL_DEFINITION_TYPES.IMPROVE_CURRENT_SCORE && currentSelectedScore === undefined)}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {existingGoal ? 'Update Goal' : 'Set Goal'}
        </Button>
      </div>
    </form>
  );
}
