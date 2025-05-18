
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ASSESSMENT_TYPES, LOCAL_STORAGE_KEYS, ASSESSMENT_NAMES, ASSESSMENT_FLOW, type AssessmentTypeValue } from '@/lib/constants';
import type { CompletedAssessmentSet, CurrentScores } from '@/lib/types';
import { ASSESSMENTS_DATA } from '@/lib/assessment-questions';
import { Bot, FileText, Lightbulb, Printer, CalendarDays, User, Brain, HeartPulse, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const getAssessmentIcon = (type: keyof CurrentScores) => {
  switch (type) {
    case ASSESSMENT_TYPES.WHO5:
      return <Smile className="h-5 w-5 text-primary" />;
    case ASSESSMENT_TYPES.GAD7:
      return <Brain className="h-5 w-5 text-primary" />;
    case ASSESSMENT_TYPES.PHQ9:
      return <HeartPulse className="h-5 w-5 text-primary" />;
    default:
      return <FileText className="h-5 w-5 text-primary" />;
  }
};


export default function ReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [reportData, setReportData] = useState<CompletedAssessmentSet | null>(null);
  const [currentScores, setCurrentScores] = useState<CurrentScores | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedScoresString = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_ASSESSMENT_SCORES);
    const progressDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS_DATA);

    let parsedScores: CurrentScores | null = null;
    if (storedScoresString) {
      try {
        parsedScores = JSON.parse(storedScoresString) as CurrentScores;
        setCurrentScores(parsedScores);
      } catch(e) {
        console.error("Failed to parse current scores from localStorage", e);
        toast({ title: "Error", description: "Could not load current assessment scores.", variant: "destructive" });
        // Allow to proceed to potentially load from history if current scores are corrupted/missing
      }
    }

    if (progressDataString) {
      try {
        const allProgress = JSON.parse(progressDataString) as CompletedAssessmentSet[];
        if (allProgress.length > 0) {
          const latestReport = allProgress
            .slice()
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())[0];
          
          // If currentScores were successfully parsed, try to find a matching report
          // Otherwise, use the absolute latest report from history.
          let reportToUse = latestReport;
          if (parsedScores) {
            const matchingReport = allProgress.find(report => 
              report.who5Score === parsedScores?.who5 &&
              report.gad7Score === parsedScores?.gad7 &&
              report.phq9Score === parsedScores?.phq9
              // Add other core assessments if they become mandatory in CurrentScores
            );
            if (matchingReport) reportToUse = matchingReport;
            else if (latestReport) {
                toast({
                title: "Using Latest Report Data",
                description: "Displaying the most recent historical report as current scores didn't match a specific entry.",
                variant: "default",
                duration: 7000,
                });
            }
          }
          setReportData(reportToUse);
          // Ensure currentScores reflect the report being displayed if they were initially mismatched or missing
          if (reportToUse && (!parsedScores || reportToUse.date !== (parsedScores as any)?.date ) ) { // A bit hacky check for date if parsedScores had a date
             setCurrentScores({
                [ASSESSMENT_TYPES.WHO5]: reportToUse.who5Score,
                [ASSESSMENT_TYPES.GAD7]: reportToUse.gad7Score,
                [ASSESSMENT_TYPES.PHQ9]: reportToUse.phq9Score,
             });
          }

        } else if (parsedScores) { // No progress history, but current scores exist
            setReportData({
                date: new Date().toISOString(),
                who5Score: parsedScores.who5,
                gad7Score: parsedScores.gad7,
                phq9Score: parsedScores.phq9,
                aiFeedback: "AI analysis not yet available for these scores (no history).",
                aiRecommendations: "AI recommendations not yet available for these scores (no history).",
                requiresConsultation: parsedScores.who5 !== undefined && parsedScores.who5 < 50 || 
                                    parsedScores.gad7 !== undefined && parsedScores.gad7 >= 10 || 
                                    parsedScores.phq9 !== undefined && parsedScores.phq9 >=10,
            });
        }
      } catch (e) {
        console.error("Failed to parse progress data from localStorage", e);
        toast({ title: "Error", description: "Could not load progress history.", variant: "destructive" });
        // If progress history fails but current scores exist, create a basic report from current scores
        if (parsedScores) {
             setReportData({
                date: new Date().toISOString(),
                who5Score: parsedScores.who5,
                gad7Score: parsedScores.gad7,
                phq9Score: parsedScores.phq9,
                aiFeedback: "AI analysis not available (history error).",
                aiRecommendations: "AI recommendations not available (history error).",
                requiresConsultation: parsedScores.who5 !== undefined && parsedScores.who5 < 50 || 
                                    parsedScores.gad7 !== undefined && parsedScores.gad7 >= 10 || 
                                    parsedScores.phq9 !== undefined && parsedScores.phq9 >=10,
            });
        }
      }
    } else if (parsedScores) { // No progress data string, but current scores exist
      setReportData({
        date: new Date().toISOString(),
        who5Score: parsedScores.who5,
        gad7Score: parsedScores.gad7,
        phq9Score: parsedScores.phq9,
        aiFeedback: "AI analysis not available for this report generation (no history found).",
        aiRecommendations: "AI recommendations not available for this report generation (no history found).",
        requiresConsultation: parsedScores.who5 !== undefined && parsedScores.who5 < 50 || 
                              parsedScores.gad7 !== undefined && parsedScores.gad7 >= 10 || 
                              parsedScores.phq9 !== undefined && parsedScores.phq9 >=10,
      });
      toast({
        title: "AI Insights Not Available",
        description: "No AI analysis history found. The report will show current scores only.",
        variant: "default",
      });
    }

    if (!storedScoresString && !progressDataString) {
        toast({ title: "Error", description: "No assessment scores found to generate a report.", variant: "destructive" });
        router.push('/assessment/results');
    }
    setIsLoading(false);
  }, [router, toast, isClient]);

  const handlePrint = () => {
    window.print();
  };

  const getScoreInterpretation = (type: AssessmentTypeValue, score?: number) => {
    if (score === undefined) return "Not taken";
    const assessmentData = ASSESSMENTS_DATA[type];
    if (!assessmentData?.interpretation) return `Score: ${score}`;
    for (const range in assessmentData.interpretation) {
      const [min, max] = range.split('-').map(Number);
      if (score >= min && score <= max) {
        return `${assessmentData.interpretation[range]}`;
      }
    }
    return `Interpretation not available`;
  };

  if (!isClient || isLoading || authLoading) {
    return (
        <div className="max-w-4xl mx-auto p-4 print:p-0">
            <Card className="p-6 print:shadow-none print:border-none">
                <Skeleton className="h-10 w-3/4 mb-6" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                <Separator className="my-6" />
                <Skeleton className="h-8 w-1/3 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
                <Separator className="my-6" />
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <Skeleton className="h-20 w-full" />
            </Card>
        </div>
    );
  }

  if (!reportData || !currentScores) { // currentScores also needed to display the scores section correctly
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
        <Card className="p-8 text-center shadow-xl">
          <CardTitle className="text-2xl mb-4">Report Not Available</CardTitle>
          <CardDescription className="mb-6">Could not generate the report. Please ensure you have completed an assessment.</CardDescription>
          <Button onClick={() => router.push('/assessment/results')} className="hover:bg-primary/80 transition-colors">Back to Results</Button>
        </Card>
      </div>
    );
  }
  
  const scoresToDisplay = {
    [ASSESSMENT_TYPES.WHO5]: reportData.who5Score,
    [ASSESSMENT_TYPES.GAD7]: reportData.gad7Score,
    [ASSESSMENT_TYPES.PHQ9]: reportData.phq9Score,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 print:p-2 bg-card print:bg-transparent">
      <div className="flex justify-between items-center mb-6 print:mb-4 no-print">
        <h1 className="text-3xl font-bold text-primary">Assessment Report</h1>
        <Button onClick={handlePrint} size="lg" className="hover:bg-primary/80 transition-colors">
          <Printer className="mr-2 h-5 w-5" /> Print / Save as PDF
        </Button>
      </div>
      
      <div className="print-container p-6 sm:p-8 border rounded-lg shadow-lg print:shadow-none print:border-none bg-card">
        <header className="mb-8 print:mb-6 text-center print:text-left">
           <div className="flex items-center justify-center print:justify-start gap-2 mb-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary print:h-8 print:w-8">
                <path d="M12 2a5 5 0 0 0-5 5c0 1.3.5 2.5 1.4 3.4L5 13.8V21h3.8l3.6-3.6A5 5 0 0 0 12 22a5 5 0 0 0 5-5c0-1.3-.5-2.5-1.4-3.4L19 10.2V3h-3.8l-3.6 3.6A5 5 0 0 0 12 2zM7 21v-2M17 3v2"/>
                <path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                <path d="M12 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
            <h1 className="text-4xl print:text-3xl font-bold text-foreground">Manasooth</h1>
          </div>
          <p className="text-lg print:text-base text-muted-foreground">Mental Wellbeing Assessment Report</p>
        </header>

        <section className="mb-8 print:mb-6">
          <Card className="bg-muted/30 print:bg-transparent print:border-none">
            <CardContent className="p-4 print:p-0 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">User</p>
                  <p className="text-sm text-muted-foreground">{user ? user.email : 'Anonymous User'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Assessment Date</p>
                  <p className="text-sm text-muted-foreground">{format(parseISO(reportData.date), 'PPPp')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8 print:my-6" />

        <section className="mb-8 print:mb-6">
          <h2 className="text-2xl print:text-xl font-semibold text-foreground mb-4 print:mb-3">Assessment Scores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:gap-4">
            {ASSESSMENT_FLOW.map((type) => {
              const scoreValue = scoresToDisplay[type];
              const assessmentDetails = ASSESSMENTS_DATA[type];
              if (scoreValue === undefined) return null; // Skip if score is not in the report

              return (
                <Card key={type} className="shadow-md hover:shadow-lg transition-shadow print:shadow-none print:border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      {getAssessmentIcon(type as keyof CurrentScores)}
                      <CardTitle className="text-lg print:text-base font-medium">{assessmentDetails.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl print:text-3xl font-bold text-primary mb-1">{scoreValue}</p>
                    <p className="text-sm print:text-xs text-muted-foreground">{getScoreInterpretation(type, scoreValue)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        
        <Separator className="my-8 print:my-6" />

        <section className="mb-8 print:mb-6">
          <h2 className="text-2xl print:text-xl font-semibold text-foreground mb-4 print:mb-3 flex items-center">
            <Bot className="mr-2 h-6 w-6 text-primary" /> AI-Powered Insights
          </h2>
          {reportData.aiFeedback && (
            <Alert className="mb-4 print:mb-3 bg-card print:border print:border-input">
              <Lightbulb className="h-5 w-5" />
              <AlertTitle className="font-semibold text-foreground">Feedback</AlertTitle>
              <AlertDescription className="text-muted-foreground whitespace-pre-wrap text-sm print:text-xs">
                {reportData.aiFeedback}
              </AlertDescription>
            </Alert>
          )}
          {reportData.aiRecommendations && (
             <Alert variant="default" className="bg-secondary/20 border-secondary-foreground/10 print:border print:border-input print:bg-card">
              <FileText className="h-5 w-5" />
              <AlertTitle className="font-semibold text-foreground">Recommendations</AlertTitle>
              <AlertDescription className="text-muted-foreground whitespace-pre-wrap text-sm print:text-xs">
                {reportData.aiRecommendations}
              </AlertDescription>
            </Alert>
          )}
          {(!reportData.aiFeedback && !reportData.aiRecommendations) && (
             <p className="text-sm text-muted-foreground">AI analysis data is not available for this report.</p>
          )}
        </section>

        <Separator className="my-8 print:my-6" />

        <section>
          <h3 className="text-lg print:text-base font-semibold text-foreground mb-2 print:mb-1">Important Disclaimer</h3>
          <p className="text-xs text-muted-foreground print:text-[10px]">
            This report is generated based on your self-assessment responses and AI analysis. It is intended for informational purposes only and should not be considered a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read in this report. If you are in crisis or think you may have an emergency, call your doctor or 911 immediately. For illustrative purposes, some assessment question sets used in this app may be representative examples and not the official clinical instruments. For actual clinical use, official versions should be consulted.
          </p>
        </section>

        <footer className="mt-12 pt-4 border-t text-center text-xs text-muted-foreground print:block hidden print-footer">
            Report generated by Manasooth on {format(new Date(), 'PPPp')}
        </footer>
      </div>
    </div>
  );
}
