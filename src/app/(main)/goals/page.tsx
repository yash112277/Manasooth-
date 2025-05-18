
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, Target, ListChecks, Info, CheckCircle } from 'lucide-react'; // Added CheckCircle
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import type { UserGoal } from '@/lib/types';
import { GoalForm } from '@/components/goals/GoalForm';
import { GoalCard } from '@/components/goals/GoalCard';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function GoalsPage() {
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    loadGoals();
    setIsLoading(false);
  }, [isClient]);

  const loadGoals = () => {
    const storedGoals = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS);
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals) as UserGoal[]);
    }
  };

  const saveGoals = (updatedGoals: UserGoal[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_GOALS, JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const handleGoalAddOrUpdate = (goal: UserGoal) => {
    const existingGoalIndex = goals.findIndex(g => g.id === goal.id);
    let updatedGoals;
    if (existingGoalIndex > -1) {
      updatedGoals = [...goals];
      updatedGoals[existingGoalIndex] = goal;
      toast({ title: "Goal Updated", description: "Your goal has been successfully updated."});
    } else {
      updatedGoals = [...goals, goal];
      toast({ title: "Goal Set!", description: "Your new goal has been added.", className: "bg-primary text-primary-foreground" });
    }
    saveGoals(updatedGoals);
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  const handleGoalDelete = (goalId: string) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    saveGoals(updatedGoals);
    toast({ title: "Goal Deleted", description: "The goal has been removed."});
  };

  const handleEditGoal = (goal: UserGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };
  
  const handleUpdateGoalStatus = (goalId: string, status: UserGoal['status']) => {
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex > -1) {
      const updatedGoals = [...goals];
      updatedGoals[goalIndex] = { ...updatedGoals[goalIndex], status };
      saveGoals(updatedGoals);
      toast({ title: "Goal Status Updated", description: `Goal marked as ${status}.`});
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <p>Loading your goals...</p>
      </div>
    );
  }
  
  const activeGoals = goals.filter(g => g.status === 'active');
  const archivedGoals = goals.filter(g => g.status === 'archived');
  const completedGoals = goals.filter(g => g.status === 'achieved' || g.status === 'missed');


  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Target className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Your Wellbeing Goals</h1>
            <p className="text-lg text-muted-foreground">Set, track, and achieve your mental wellness milestones.</p>
          </div>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingGoal(null);
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow">
              <PlusCircle className="mr-2 h-5 w-5" /> Set New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{editingGoal ? 'Edit Goal' : 'Set a New Wellbeing Goal'}</DialogTitle>
            </DialogHeader>
            <GoalForm 
              onGoalAdd={handleGoalAddOrUpdate} 
              existingGoal={editingGoal} 
              closeDialog={() => { setIsFormOpen(false); setEditingGoal(null); }} 
            />
          </DialogContent>
        </Dialog>
      </header>

      {goals.length === 0 && (
        <Card className="shadow-xl border-dashed border-2 hover:border-primary transition-all">
          <CardContent className="p-8 text-center space-y-6">
             <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ListChecks className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-semibold">No Goals Yet?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Setting personal goals is a great step towards improving your wellbeing. 
              Click &quot;Set New Goal&quot; to define what you want to achieve.
            </p>
            <div className="relative aspect-video max-w-sm mx-auto rounded-lg overflow-hidden shadow-md">
                 <Image 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" 
                    alt="Person planning goals" 
                    width={400}
                    height={250}
                    className="object-cover w-full h-full"
                    
                />
            </div>
          </CardContent>
        </Card>
      )}

      {activeGoals.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
            <Target className="mr-2 h-6 w-6 text-primary" /> Active Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onDelete={handleGoalDelete} onEdit={handleEditGoal} onUpdateStatus={handleUpdateGoalStatus} />
            ))}
          </div>
        </section>
      )}
      
      {completedGoals.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
            <CheckCircle className="mr-2 h-6 w-6 text-green-500" /> Completed & Missed Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onDelete={handleGoalDelete} onEdit={handleEditGoal} onUpdateStatus={handleUpdateGoalStatus} />
            ))}
          </div>
        </section>
      )}

      {archivedGoals.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-muted-foreground flex items-center">
             Archived Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
            {archivedGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onDelete={handleGoalDelete} onEdit={handleEditGoal} onUpdateStatus={handleUpdateGoalStatus} />
            ))}
          </div>
        </section>
      )}


      <Alert variant="default" className="bg-accent/10 border-accent/20">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent-foreground/90">Goal Tracking Tips</AlertTitle>
        <AlertDescription className="text-accent-foreground/80">
          Regularly check in on your goals after completing new assessments. Your progress will be updated based on your latest scores. 
          Remember, consistency is key! Adjust goals as needed and celebrate your achievements.
        </AlertDescription>
      </Alert>
    </div>
  );
}
