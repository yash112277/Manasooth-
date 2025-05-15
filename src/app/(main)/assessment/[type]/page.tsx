
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AssessmentForm } from '@/components/assessment/AssessmentForm';
import { ASSESSMENTS_DATA } from '@/lib/assessment-questions';
import { LOCAL_STORAGE_KEYS, type AssessmentTypeValue, ASSESSMENT_TYPES } from '@/lib/constants';
import type { Assessment, CurrentScores } from '@/lib/types';
import { ArrowLeft, CheckCircle, Info, ChevronsRight } from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const assessmentType = params.type as AssessmentTypeValue;
  const [assessmentData, setAssessmentData] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState("View Results");
  const [isLastInFlow, setIsLastInFlow] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dynamically create Zod schema based on questions
  const schema = assessmentData
    ? z.object(
        Object.fromEntries(
          assessmentData.questions.map((q) => [q.id, z.number({ required_error: "Please select an option." }).min(0)])
        )
      )
    : z.object({}); 

  const { handleSubmit, control, formState, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!isClient) return;

    if (assessmentType && ASSESSMENTS_DATA[assessmentType as keyof typeof ASSESSMENTS_DATA]) {
      const data = ASSESSMENTS_DATA[assessmentType as keyof typeof ASSESSMENTS_DATA];
      setAssessmentData(data);
      const defaultVals: Record<string, number | undefined> = {};
      data.questions.forEach(q => defaultVals[q.id] = undefined);
      reset(defaultVals);
      
      // Check if in a selected flow
      const flowString = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW);
      if (flowString) {
        try {
          const currentFlow: AssessmentTypeValue[] = JSON.parse(flowString);
          // The current assessment type should be the first in the flow if this page was reached correctly
          if (currentFlow.length > 0 && currentFlow[0] === assessmentType) {
            if (currentFlow.length > 1) {
              setSubmitButtonText("Next Assessment");
              setIsLastInFlow(false);
            } else {
              setSubmitButtonText("View Results");
              setIsLastInFlow(true);
            }
          } else {
            // If current type is not first, or flow is empty but key exists, something is wrong.
            // Default to "View Results" and potentially clear the flow.
            // For now, just set to default. User can re-initiate a flow.
            setSubmitButtonText("View Results");
            setIsLastInFlow(true);
             if (currentFlow.length === 0) localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW);
          }
        } catch (e) {
          console.error("Failed to parse selected assessment flow:", e);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW); // Clear corrupted data
          setSubmitButtonText("View Results");
          setIsLastInFlow(true);
        }
      } else {
        setSubmitButtonText("View Results");
        setIsLastInFlow(true);
      }

      setIsLoading(false);
    } else {
      toast({ title: "Error", description: "Invalid assessment type.", variant: "destructive" });
      router.push('/assessment');
    }
  }, [assessmentType, toast, router, reset, isClient]);

  const onSubmit = (data: FieldValues) => {
    if (!assessmentData || !isClient) return;

    let score = Object.values(data).reduce((sum, val) => sum + (val as number), 0);
    if (assessmentData.type === ASSESSMENT_TYPES.WHO5) {
      score *= 4; 
    }

    let currentScores: CurrentScores = {};
    try {
      const storedScores = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_ASSESSMENT_SCORES);
      if (storedScores) {
        currentScores = JSON.parse(storedScores);
      }
    } catch (error) {
      console.error("Failed to parse scores from localStorage", error);
    }
    
    currentScores[assessmentData.type as keyof CurrentScores] = score;
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_ASSESSMENT_SCORES, JSON.stringify(currentScores));

    toast({
      title: `${assessmentData.name} Submitted`,
      description: `Your score: ${score}`,
      className: "bg-secondary text-secondary-foreground"
    });

    // Handle navigation based on selected flow
    const flowString = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW);
    if (flowString) {
      try {
        let currentFlow: AssessmentTypeValue[] = JSON.parse(flowString);
        // Remove current assessment from flow
        currentFlow = currentFlow.filter(type => type !== assessmentType); 

        if (currentFlow.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW, JSON.stringify(currentFlow));
          router.push(`/assessment/${currentFlow[0]}`);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW);
          router.push('/assessment/results');
        }
      } catch(e) {
        console.error("Error processing assessment flow on submit:", e);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW);
        router.push('/assessment/results'); // Fallback
      }
    } else {
      // No flow, just go to results
      router.push('/assessment/results');
    }
  };

  if (!isClient || isLoading || !assessmentData) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] p-4">
        <div className="space-y-4 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold">Loading Assessment...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-0">
      <Card className="shadow-2xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-primary">{assessmentData.name}</CardTitle>
          <CardDescription className="text-center text-sm sm:text-md">
            Please answer based on your feelings over the past two weeks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <AssessmentForm assessment={assessmentData} control={control} formState={formState} />
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 px-0 pb-0">
               <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Page
              </Button>
              <Button type="submit" size="lg" className="w-full sm:w-auto btn-neumorphic">
                {submitButtonText} {isLastInFlow ? <CheckCircle className="ml-2 h-4 w-4" /> : <ChevronsRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
         {assessmentData.scoringNote && (
          <CardFooter className="flex-col items-start gap-2 border-t pt-4 sm:pt-6 p-4 sm:p-6">
            <Alert variant="default" className="w-full bg-muted/50">
              <Info className="h-5 w-5" />
              <AlertTitle className="font-semibold">Scoring Information</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">{assessmentData.scoringNote}</AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
