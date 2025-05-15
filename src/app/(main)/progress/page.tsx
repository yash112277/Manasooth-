
"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, Info, Target } from 'lucide-react';
import { LOCAL_STORAGE_KEYS, ASSESSMENT_TYPES, ASSESSMENT_NAMES, type AssessmentTypeValue } from '@/lib/constants';
import type { CompletedAssessmentSet, UserGoal } from '@/lib/types';
import { GOAL_DEFINITION_TYPES } from '@/lib/types';
import { format, parseISO, isPast } from 'date-fns';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const CHART_COLORS = {
  [ASSESSMENT_TYPES.WHO5]: 'hsl(var(--chart-1))',
  [ASSESSMENT_TYPES.GAD7]: 'hsl(var(--chart-2))',
  [ASSESSMENT_TYPES.PHQ9]: 'hsl(var(--chart-3))',
};

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<CompletedAssessmentSet[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS_DATA);
    if (storedData) {
      const parsedData = JSON.parse(storedData) as CompletedAssessmentSet[];
      parsedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setProgressData(parsedData);
      updateGoalsWithLatestScores(parsedData);
    } else {
       // If no progress data, still try to load goals to display them.
      loadGoals();
    }
    setIsLoading(false);
  }, [isClient]);

  const loadGoals = () => {
    const storedGoals = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS);
    if (storedGoals) {
      setUserGoals(JSON.parse(storedGoals) as UserGoal[]);
    }
  };

  const saveGoals = (updatedGoals: UserGoal[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_GOALS, JSON.stringify(updatedGoals));
    setUserGoals(updatedGoals);
  };

  const updateGoalsWithLatestScores = (latestProgressData: CompletedAssessmentSet[]) => {
    const storedGoalsString = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS);
    if (!storedGoalsString) {
      setUserGoals([]); // Ensure userGoals is initialized if none are stored
      return;
    }

    let currentGoals = JSON.parse(storedGoalsString) as UserGoal[];
    let goalsWereUpdated = false;

    if (latestProgressData.length > 0) {
      const latestScoresAllTypes = latestProgressData[latestProgressData.length - 1];
      
      const scoreMap: Record<AssessmentTypeValue, number | undefined> = {
        [ASSESSMENT_TYPES.WHO5]: latestScoresAllTypes.who5Score,
        [ASSESSMENT_TYPES.GAD7]: latestScoresAllTypes.gad7Score,
        [ASSESSMENT_TYPES.PHQ9]: latestScoresAllTypes.phq9Score,
      };

      currentGoals = currentGoals.map(goal => {
        if (goal.status !== 'active') return goal; // Only update active goals

        const latestScoreForGoalType = scoreMap[goal.assessmentType];
        if (latestScoreForGoalType === undefined) return goal; // No new score for this goal's type

        let updatedGoal = { ...goal, currentScore: latestScoreForGoalType };
        let achieved = false;

        if (goal.goalDefinitionType === GOAL_DEFINITION_TYPES.REACH_SPECIFIC_SCORE) {
          if (goal.assessmentType === ASSESSMENT_TYPES.WHO5) { // Higher is better
            achieved = latestScoreForGoalType >= goal.targetValue;
          } else { // Lower is better
            achieved = latestScoreForGoalType <= goal.targetValue;
          }
        } else if (goal.goalDefinitionType === GOAL_DEFINITION_TYPES.IMPROVE_CURRENT_SCORE) {
          const change = latestScoreForGoalType - goal.startScore;
          if (goal.assessmentType === ASSESSMENT_TYPES.WHO5) { // Expect positive change (increase)
            // targetValue is positive points to increase by
            achieved = change >= goal.targetValue;
          } else { // Expect negative change (decrease)
            // targetValue is positive points to decrease by (e.g. improve by 5 means score should go down by 5)
            achieved = change <= -goal.targetValue;
          }
        }

        if (achieved) {
          updatedGoal.status = 'achieved';
          goalsWereUpdated = true;
          toast({ title: "Goal Achieved!", description: `Congrats on achieving your goal for ${ASSESSMENT_NAMES[goal.assessmentType]}!`, className: "bg-green-500 text-white" });
        } else if (goal.targetDate && isPast(parseISO(goal.targetDate)) && !achieved) {
          updatedGoal.status = 'missed';
          goalsWereUpdated = true;
        }
        return updatedGoal;
      });
    }
    
    if (goalsWereUpdated) {
      saveGoals(currentGoals);
    } else {
      setUserGoals(currentGoals); // Set state even if no updates to ensure consistency
    }
  };


  if (!isClient || isLoading) {
    return <div className="text-center p-10"><p>Loading progress data and goals...</p></div>;
  }

  const activeGoals = userGoals.filter(g => g.status === 'active');

  if (progressData.length === 0 && userGoals.length === 0) {
    return (
      <Card className="shadow-lg w-full max-w-lg mx-auto">
        <CardHeader className="items-center text-center">
           <TrendingUp className="w-20 h-20 text-primary mb-4" />
          <CardTitle className="text-2xl">No Progress Data Yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            It looks like you haven&apos;t completed any assessments or set any goals yet. Complete an assessment to track your mental wellbeing journey here.
          </p>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row justify-center gap-3">
          <Button size="lg" onClick={() => router.push('/assessment')}>Take an Assessment</Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/goals')}>Set a Goal</Button>
        </CardFooter>
      </Card>
    );
  }

  const formattedData = progressData.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM d, yyyy'),
  }));

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Your Wellbeing Journey</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Track your assessment scores over time, monitor your goals, and identify trends and improvements.
        </p>
      </section>

      {progressData.length > 0 && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Assessment Score Trends</CardTitle>
            <CardDescription>Scores for WHO-5, GAD-7, and PHQ-9 over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.values(ASSESSMENT_TYPES).map(type => (
                  <Line
                    key={type}
                    type="monotone"
                    dataKey={`${type}Score`}
                    name={ASSESSMENT_NAMES[type as keyof typeof ASSESSMENT_NAMES]}
                    stroke={CHART_COLORS[type as keyof typeof CHART_COLORS]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    connectNulls 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
       {progressData.length === 0 && userGoals.length > 0 && (
         <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Assessment Data</AlertTitle>
          <AlertDescription>
            You have goals set, but no assessment data yet to track progress against them. 
            <Button variant="link" asChild className="p-0 h-auto ml-1"><Link href="/assessment">Take an assessment</Link></Button> to start tracking.
          </AlertDescription>
        </Alert>
      )}


      {activeGoals.length > 0 && (
        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" /> Active Goals
                </CardTitle>
                <CardDescription>Here are the goals you are currently working towards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {activeGoals.map(goal => (
                    <div key={goal.id} className="p-4 border rounded-lg bg-card">
                        <h3 className="font-semibold">{ASSESSMENT_NAMES[goal.assessmentType]}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                        <p className="text-xs mt-1">Set on: {format(parseISO(goal.startDate), 'PPP')}</p>
                        {goal.targetDate && <p className="text-xs">Target: {format(parseISO(goal.targetDate), 'PPP')}</p>}
                        <p className="text-xs">Start Score: {goal.startScore}, Current: {goal.currentScore ?? 'N/A'}</p>
                    </div>
                ))}
                 <Button asChild variant="outline" className="mt-4">
                    <Link href="/goals">Manage All Goals</Link>
                </Button>
            </CardContent>
        </Card>
      )}
       {activeGoals.length === 0 && userGoals.length > 0 && (
         <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Active Goals</AlertTitle>
          <AlertDescription>
            You don&apos;t have any active goals right now. 
            <Button variant="link" asChild className="p-0 h-auto ml-1"><Link href="/goals">Set a new goal</Link></Button> or reactivate an old one!
          </AlertDescription>
        </Alert>
      )}


      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Interpreting Your Progress</AlertTitle>
        <AlertDescription>
          For WHO-5 (Well-being), higher scores are better. For GAD-7 (Anxiety) and PHQ-9 (Depression), lower scores are generally better.
          Consistent trends can be more informative than single scores. If you have concerns, consider discussing them with a healthcare professional.
        </AlertDescription>
      </Alert>
      
      {progressData.length > 0 && progressData[progressData.length-1].aiFeedback && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Latest AI Insights</CardTitle>
            <CardDescription>From your assessment on {formattedData[formattedData.length-1].date}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Feedback:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{progressData[progressData.length-1].aiFeedback}</p>
            </div>
            <div>
              <h4 className="font-semibold">Recommendations:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{progressData[progressData.length-1].aiRecommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

