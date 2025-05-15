"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { UserGoal } from '@/lib/types';
import { ASSESSMENT_NAMES, ASSESSMENT_TYPES } from '@/lib/constants';
import { format, parseISO, differenceInDays, isPast } from 'date-fns';
import { Target, CalendarDays, Edit3, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: UserGoal;
  onDelete: (goalId: string) => void;
  onEdit: (goal: UserGoal) => void;
  onUpdateStatus: (goalId: string, status: UserGoal['status']) => void;
}

export function GoalCard({ goal, onDelete, onEdit, onUpdateStatus }: GoalCardProps) {
  const getStatusVariant = (status: UserGoal['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return 'default';
      case 'achieved': return 'secondary'; // Using secondary for "success" like color
      case 'missed': return 'destructive';
      case 'archived': return 'outline';
      default: return 'default';
    }
  };

  const getProgressPercentage = () => {
    if (goal.status === 'achieved') return 100;
    if (goal.status === 'missed' || goal.status === 'archived') return 0; // Or last known progress?
    if (goal.startScore === undefined || goal.currentScore === undefined) return 0;

    const { assessmentType, goalDefinitionType, targetValue, startScore, currentScore } = goal;
    
    let progress = 0;

    if (goalDefinitionType === 'reach_specific_score') {
      const totalRange = Math.abs(targetValue - startScore);
      if (totalRange === 0) return currentScore === targetValue ? 100: 0;
      const achievedRange = Math.abs(currentScore - startScore);
      
      if (assessmentType === ASSESSMENT_TYPES.WHO5) { // Higher is better
        progress = startScore >= targetValue ? 0 : (Math.min(Math.max(currentScore - startScore, 0), totalRange) / totalRange) * 100;
         if (currentScore >= targetValue) progress = 100;
      } else { // Lower is better (GAD7, PHQ9)
        progress = startScore <= targetValue ? 0 : (Math.min(Math.max(startScore - currentScore, 0), totalRange) / totalRange) * 100;
        if (currentScore <= targetValue) progress = 100;
      }
    } else if (goalDefinitionType === 'improve_current_score') {
        // targetValue is the desired change amount.
        // For WHO5, targetValue is positive. For GAD/PHQ, it's positive in form, but we should aim for negative change internally.
        // Let's assume targetValue represents the *magnitude* of desired change for simplicity here.
        // The `description` should clarify direction.

        const actualChange = currentScore - startScore;
        let desiredEffectChange = targetValue; // This is the absolute points to change
        
        if (assessmentType === ASSESSMENT_TYPES.WHO5) { // Increase
             if (targetValue === 0) return 0;
             progress = (Math.max(0, actualChange) / desiredEffectChange) * 100;
        } else { // Decrease (GAD7, PHQ9)
            if (targetValue === 0) return 0;
            // actualChange will be negative for improvement. We want positive progress.
            progress = (Math.max(0, -actualChange) / desiredEffectChange) * 100;
        }
    }
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
  };

  const progressPercentage = getProgressPercentage();
  
  const isOverdue = goal.targetDate && isPast(parseISO(goal.targetDate)) && goal.status === 'active';

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            {ASSESSMENT_NAMES[goal.assessmentType]} Goal
          </CardTitle>
          <Badge variant={getStatusVariant(goal.status)} className="capitalize">
            {isOverdue ? "Overdue" : goal.status}
          </Badge>
        </div>
        <CardDescription className="pt-1 line-clamp-3">
          {goal.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} aria-label={`${ASSESSMENT_NAMES[goal.assessmentType]} goal progress ${progressPercentage.toFixed(0)}%`} />
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Start Score:</strong> {goal.startScore}</p>
          {goal.currentScore !== undefined && <p><strong>Current Score:</strong> {goal.currentScore}</p>}
          
          {goal.goalDefinitionType === 'reach_specific_score' && (
            <p><strong>Target Score:</strong> {goal.targetValue}</p>
          )}
          {goal.goalDefinitionType === 'improve_current_score' && (
            <p><strong>Target Improvement:</strong> {goal.targetValue} points</p>
          )}
        </div>

        {goal.targetDate && (
          <p className={cn("text-sm flex items-center gap-1", isOverdue ? "text-destructive font-semibold" : "text-muted-foreground")}>
            <CalendarDays className="h-4 w-4" /> Target Date: {format(parseISO(goal.targetDate), 'PPP')}
            {isOverdue && <Clock className="h-4 w-4" />}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Set on: {format(parseISO(goal.startDate), 'PPP')}</p>
        {goal.notes && (
          <div className="pt-2">
            <p className="text-sm font-medium">Notes:</p>
            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md whitespace-pre-wrap">{goal.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t">
        <div className="flex gap-2 flex-wrap">
            {goal.status === 'active' && (
                <>
                 <Button size="sm" variant="outline" onClick={() => onUpdateStatus(goal.id, 'achieved')} className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark Achieved
                </Button>
                 {goal.targetDate && isPast(parseISO(goal.targetDate)) && (
                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(goal.id, 'missed')}  className="text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700">
                        <XCircle className="mr-2 h-4 w-4" /> Mark Missed
                    </Button>
                )}
                </>
            )}
            {goal.status !== 'active' && (
                 <Button size="sm" variant="outline" onClick={() => onUpdateStatus(goal.id, 'active')}>
                    Reactivate
                </Button>
            )}
             {goal.status !== 'archived' && (
                <Button size="sm" variant="ghost" onClick={() => onUpdateStatus(goal.id, 'archived')}>
                    Archive
                </Button>
            )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(goal)}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(goal.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

