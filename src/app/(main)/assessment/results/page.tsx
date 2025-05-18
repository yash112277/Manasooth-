
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { analyzeAssessment, type AnalyzeAssessmentInput, type AnalyzeAssessmentOutput } from '@/ai/flows/analyze-assessment';
import { ASSESSMENT_TYPES, LOCAL_STORAGE_KEYS, ASSESSMENT_NAMES, type AssessmentTypeValue } from '@/lib/constants';
import type { CompletedAssessmentSet, CurrentScores, UserGoal } from '@/lib/types';
import { ASSESSMENTS_DATA } from '@/lib/assessment-questions';
import { Bot, FileText, RefreshCw, Lightbulb, MessageSquare, Video, AlertTriangle, Download, TrendingUp, Smile, Brain, HeartPulse } from 'lucide-react';
// useAuth import removed as login features are gone
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLanguage, type SupportedLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const CHART_COLORS_STROKE: Record<AssessmentTypeValue, string> = {
  [ASSESSMENT_TYPES.WHO5]: 'hsl(var(--chart-1))',
  [ASSESSMENT_TYPES.GAD7]: 'hsl(var(--chart-2))',
  [ASSESSMENT_TYPES.PHQ9]: 'hsl(var(--chart-3))',
};
const CHART_COLORS_FILL: Record<AssessmentTypeValue, string> = {
  [ASSESSMENT_TYPES.WHO5]: 'hsla(var(--chart-1), 0.7)',
  [ASSESSMENT_TYPES.GAD7]: 'hsla(var(--chart-2), 0.7)',
  [ASSESSMENT_TYPES.PHQ9]: 'hsla(var(--chart-3), 0.7)',
};

const getAssessmentIcon = (type: keyof CurrentScores) => {
  switch (type) {
    case ASSESSMENT_TYPES.WHO5:
      return <Smile className="h-7 w-7 text-primary" />;
    case ASSESSMENT_TYPES.GAD7:
      return <Brain className="h-7 w-7 text-primary" />;
    case ASSESSMENT_TYPES.PHQ9:
      return <HeartPulse className="h-7 w-7 text-primary" />;
    default:
      return <TrendingUp className="h-7 w-7 text-primary" />;
  }
};

function ResultScoreCard({ type, score }: { type: keyof CurrentScores, score: number }) {
  const { language, translate } = useLanguage();

  const nameTranslations : Record<string, Record<SupportedLanguage, string>> = {
    [ASSESSMENT_TYPES.WHO5] : {en: ASSESSMENT_NAMES.who5, hi: "WHO-5 सेहत सूचकांक"},
    [ASSESSMENT_TYPES.GAD7] : {en: ASSESSMENT_NAMES.gad7, hi: "GAD-7 चिंता मूल्यांकन"},
    [ASSESSMENT_TYPES.PHQ9] : {en: ASSESSMENT_NAMES.phq9, hi: "PHQ-9 अवसाद स्क्रीनिंग"},
  }
  const translatedName = translate(nameTranslations[type] || {en: ASSESSMENT_NAMES[type as AssessmentTypeValue], hi: ASSESSMENT_NAMES[type as AssessmentTypeValue]});

  const interpretation = getScoreInterpretation(type, score);

  return (
    <Card className="bg-muted/50 hover:shadow-lg transition-shadow duration-300 p-1 rounded-xl border">
      <CardContent className="p-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3">
            <div className="p-3 bg-primary/10 rounded-full">
                {getAssessmentIcon(type)}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">{translatedName}</CardTitle>
        </div>
        <p className="text-5xl sm:text-6xl font-bold text-primary my-2 text-center">{score}</p>
        <p className="text-sm sm:text-md text-muted-foreground text-center">{interpretation.replace(` (Score: ${score})`, '')}</p>
      </CardContent>
    </Card>
  );
}


const getScoreInterpretation = (type: keyof CurrentScores, score?: number) => {
    if (score === undefined) return "Not taken";
    const assessmentData = ASSESSMENTS_DATA[type as AssessmentTypeValue];
    if (!assessmentData?.interpretation) return `Score: ${score}`;

    for (const range in assessmentData.interpretation) {
      const [min, max] = range.split('-').map(Number);
      if (score >= min && score <= max) {
        return `${assessmentData.interpretation[range]} (Score: ${score})`;
      }
    }
    return `Score: ${score}`;
  };

export default function ResultsPage() {
  const router = useRouter();
  const { toast } = useToast();
  // const { user, loading: authLoading } = useAuth(); // Auth features removed
  const { translate, language } = useLanguage();
  const [scores, setScores] = useState<CurrentScores | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AnalyzeAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAiAnalysis = useCallback(async (input: AnalyzeAssessmentInput) => {
    if(!isClient) return;
    setIsAiLoading(true);
    try {
      const result = await analyzeAssessment(input);
      setAiAnalysis(result);
      
      const progressDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS_DATA);
      let progressData: CompletedAssessmentSet[] = progressDataString ? JSON.parse(progressDataString) : [];
      
      const newEntry: CompletedAssessmentSet = {
        date: new Date().toISOString(),
        who5Score: input.who5Score,
        gad7Score: input.gad7Score,
        phq9Score: input.phq9Score,
        aiFeedback: result.feedback,
        aiRecommendations: result.recommendations,
        requiresConsultation: result.requiresConsultation, 
      };
      progressData.push(newEntry);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS_DATA, JSON.stringify(progressData));

      if (result.requiresConsultation) {
        setShowConsultationDialog(true);
      }
      
    } catch (error) {
      console.error("AI Analysis Error:", error);
      toast({ title: "AI Analysis Error", description: "Could not retrieve AI insights. Please try again later.", variant: "destructive" });
      setAiAnalysis({ feedback: "Could not load AI feedback.", recommendations: "Could not load AI recommendations.", requiresConsultation: false });
    } finally {
      setIsAiLoading(false);
    }
  }, [isClient, toast]); 

  useEffect(() => {
    if (!isClient) return;

    const storedScoresString = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_ASSESSMENT_SCORES);
    if (storedScoresString) {
      try {
        const parsedScores = JSON.parse(storedScoresString) as CurrentScores;
        setScores(parsedScores);
      } catch (e) {
        console.error("Failed to parse scores from localStorage", e);
        toast({ title: "Error", description: "Could not load assessment scores. Please try assessments again.", variant: "destructive" });
        router.push('/assessment');
      }
    } else {
      toast({ title: "Error", description: "No assessment scores found. Please complete the assessments first.", variant: "destructive" });
      router.push('/assessment');
    }
    setIsLoading(false);
  }, [isClient, router, toast]);

  useEffect(() => {
    if (!isClient || !scores || aiAnalysis) return; 

    let activeGoalsForAI: AnalyzeAssessmentInput['activeGoals'] = [];
    try {
      const storedGoalsString = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS);
      if (storedGoalsString) {
        const allGoals = JSON.parse(storedGoalsString) as UserGoal[];
        activeGoalsForAI = allGoals
          .filter(goal => goal.status === 'active')
          .map(goal => ({
            description: goal.description || `Goal for ${ASSESSMENT_NAMES[goal.assessmentType]}`,
            assessmentName: ASSESSMENT_NAMES[goal.assessmentType],
          }));
      }
    } catch (error) {
      console.error("Failed to load or parse goals from localStorage for AI Analysis", error);
    }
    
    const analysisInput: AnalyzeAssessmentInput = {
      who5Score: scores[ASSESSMENT_TYPES.WHO5] ?? 0,
      gad7Score: scores[ASSESSMENT_TYPES.GAD7] ?? 0,
      phq9Score: scores[ASSESSMENT_TYPES.PHQ9] ?? 0,
      activeGoals: activeGoalsForAI,
      userContext: undefined, 
      preferredRecommendationTypes: undefined,
    };

    handleAiAnalysis(analysisInput);
  }, [isClient, scores, handleAiAnalysis, aiAnalysis]);
  

  if (!isClient || isLoading /* || authLoading */) { // authLoading removed
    return (
      <div className="space-y-8 p-4 md:p-6 lg:p-8">
        <Skeleton className="h-12 w-3/4 sm:w-1/2" />
        <Skeleton className="h-8 w-full sm:w-3/4" />
        <Card className="shadow-xl"><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
        <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
        </div>
        <Card className="shadow-xl"><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
        <Card className="p-8 text-center shadow-xl rounded-lg">
          <CardTitle className="text-3xl mb-4 text-destructive">{translate({en: "No Assessment Data", hi:"कोई मूल्यांकन डेटा नहीं"})}</CardTitle>
          <CardDescription className="mb-6 text-lg">{translate({en: "We couldn't find your assessment scores. Please complete an assessment first.", hi:"हमें आपके मूल्यांकन स्कोर नहीं मिल सके। कृपया पहले एक मूल्यांकन पूरा करें।"})}</CardDescription>
          <Button onClick={() => router.push('/assessment')} size="lg" className="hover:bg-primary/90 transition-colors">
            {translate({en: "Take Assessment", hi:"मूल्यांकन करें"})}
          </Button>
        </Card>
      </div>
    );
  }

  const chartData = Object.entries(scores)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const assessmentKey = key as AssessmentTypeValue;
      return {
        name: ASSESSMENT_NAMES[assessmentKey] || assessmentKey,
        score: value,
        fullMark: assessmentKey === ASSESSMENT_TYPES.WHO5 ? 100 : (assessmentKey === ASSESSMENT_TYPES.GAD7 ? 21 : 27),
        fill: CHART_COLORS_FILL[assessmentKey] || CHART_COLORS_FILL[ASSESSMENT_TYPES.WHO5], 
        stroke: CHART_COLORS_STROKE[assessmentKey] || CHART_COLORS_STROKE[ASSESSMENT_TYPES.WHO5], 
      };
    });


  return (
    <div className="space-y-10 p-4 md:p-6 lg:p-8">
      <section className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {translate({en: "Your Assessment Results", hi: "आपके मूल्यांकन के परिणाम"})}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          {translate({en: "Here's a summary of your recent assessments and AI-powered insights.", hi: "यहाँ आपके हाल के मूल्यांकनों और एआई-संचालित अंतर्दृष्टियों का सारांश दिया गया है।"})}
        </p>
      </section>

      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg border">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary"/>{translate({en: "Scores Overview", hi: "स्कोर अवलोकन"})}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
             <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} layout="horizontal" margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} interval={0} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} />
                <YAxis type="number" domain={[0, 'dataMax + 5']} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  formatter={(value, name, props) => {
                    const originalName = Object.keys(ASSESSMENT_NAMES).find(key => ASSESSMENT_NAMES[key as AssessmentTypeValue] === props.payload.name) as AssessmentTypeValue | undefined;
                    if (!originalName) return [`${value} / ${props.payload.fullMark}`, name];
                    return [
                      `${value} / ${props.payload.fullMark}`, 
                      `${getScoreInterpretation(originalName, Number(value)).split(' (Score:')[0]}`
                    ];
                  }}
                />
                <Legend wrapperStyle={{paddingTop: '20px'}}/>
                <Bar dataKey="score" name={translate({en: "Your Score", hi: "आपका स्कोर"})} barSize={40} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.stroke} strokeWidth={1}/>
                  ))}
                   <LabelList dataKey="score" position="top" style={{ fill: 'hsl(var(--foreground))', fontSize: '12px', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center">{translate({en: "No chart data available.", hi: "कोई चार्ट डेटा उपलब्ध नहीं है।"})}</p>
          )}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(scores).map(([key, value]) => {
              if (value === undefined) return null;
              return (
                <ResultScoreCard key={key} type={key as keyof CurrentScores} score={value} />
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg border">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl sm:text-3xl gap-2">
            <Bot className="mr-1 h-8 w-8 text-primary" /> {translate({en: "AI Powered Insights", hi: "एआई संचालित अंतर्दृष्टि"})}
          </CardTitle>
          <CardDescription className="text-md">
            {translate({en: "Personalized feedback and recommendations based on your scores.", hi: "आपके स्कोर के आधार पर व्यक्तिगत प्रतिक्रिया और सिफारिशें।"})}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAiLoading && (
            <>
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <Skeleton className="h-7 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <Skeleton className="h-7 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </>
          )}
          {aiAnalysis && !isAiLoading && (
            <>
              <Alert variant="default" className="card-glassmorphic shadow-sm">
                <Lightbulb className="h-6 w-6 text-secondary-foreground/80" />
                <AlertTitle className="font-semibold text-lg text-secondary-foreground">{translate({en: "Feedback", hi: "प्रतिक्रिया"})}</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap text-muted-foreground mt-1">{aiAnalysis.feedback}</AlertDescription>
              </Alert>
              <Alert variant="default" className="card-glassmorphic shadow-sm">
                 <FileText className="h-6 w-6 text-accent-foreground/80" />
                <AlertTitle className="font-semibold text-lg text-accent-foreground">{translate({en: "Recommendations", hi: "सिफारिशें"})}</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap text-muted-foreground mt-1">{aiAnalysis.recommendations}</AlertDescription>
              </Alert>
            </>
          )}
          {!isAiLoading && !aiAnalysis && scores && (
             <Button onClick={() => {
                if (!scores) return; 
                let activeGoalsForAI: AnalyzeAssessmentInput['activeGoals'] = [];
                if(isClient) {
                    try {
                    const storedGoalsString = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS);
                    if (storedGoalsString) {
                        const allGoals = JSON.parse(storedGoalsString) as UserGoal[];
                        activeGoalsForAI = allGoals
                        .filter(goal => goal.status === 'active')
                        .map(goal => ({
                            description: goal.description || `Goal for ${ASSESSMENT_NAMES[goal.assessmentType]}`,
                            assessmentName: ASSESSMENT_NAMES[goal.assessmentType],
                        }));
                    }
                    } catch (error) {
                    console.error("Failed to load or parse goals for retry", error);
                    }
                }
                handleAiAnalysis({
                  who5Score: scores[ASSESSMENT_TYPES.WHO5] ?? 0,
                  gad7Score: scores[ASSESSMENT_TYPES.GAD7] ?? 0,
                  phq9Score: scores[ASSESSMENT_TYPES.PHQ9] ?? 0,
                  activeGoals: activeGoalsForAI,
                  userContext: undefined,
                  preferredRecommendationTypes: undefined
                });
             }} className="hover:bg-primary/90 transition-colors">
              <RefreshCw className="mr-2 h-4 w-4" /> {translate({en: "Retry AI Analysis", hi: "एआई विश्लेषण पुनः प्रयास करें"})}
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold">
                {translate({en: "Professional Consultation Recommended", hi: "पेशेवर परामर्श की सिफारिश की जाती है"})}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-md text-muted-foreground">
              {translate({en: "Based on your assessment results, speaking with a healthcare professional could be beneficial. Our platform offers a simulated professional consultation feature. Would you like to explore this now?", hi: "आपके मूल्यांकन परिणामों के आधार पर, एक स्वास्थ्य देखभाल पेशेवर के साथ बात करना फायदेमंद हो सकता है। हमारा मंच एक नकली पेशेवर परामर्श सुविधा प्रदान करता है। क्या आप इसे अभी एक्सप्लोर करना चाहेंगे?"})}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <AlertDialogCancel className="w-full sm:w-auto hover:bg-muted/80 transition-colors">
                {translate({en: "Maybe Later", hi: "शायद बाद में"})}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.push('/consultation')} 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {translate({en: "Yes, Go to Consultation", hi: "हाँ, परामर्श पर जाएँ"})}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 flex-wrap">
        {/* Login button removed */}
        <Button size="lg" onClick={() => router.push('/progress')} className="hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 py-3">
            {translate({en: "View Progress", hi: "प्रगति देखें"})}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => router.push('/chatbot')} className="hover:bg-secondary/80 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 py-3">
          <MessageSquare className="mr-2 h-5 w-5" /> {translate({en: "Talk to AI Bot", hi: "एआई बॉट से बात करें"})}
        </Button>
        <Button size="lg" variant="outline" onClick={() => router.push('/consultation')} className="hover:bg-accent hover:text-accent-foreground transition-colors shadow-md hover:shadow-lg transform hover:scale-105 py-3">
          <Video className="mr-2 h-5 w-5" /> {translate({en: "Professional Consultation", hi: "पेशेवर परामर्श"})}
        </Button>
        <Button size="lg" variant="outline" onClick={() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_ASSESSMENT_SCORES); 
          }
          router.push('/assessment');
        }} className="hover:bg-accent hover:text-accent-foreground transition-colors shadow-md hover:shadow-lg transform hover:scale-105 py-3">
            {translate({en: "Take New Assessment", hi: "नया मूल्यांकन करें"})}
        </Button>
         <Button asChild size="lg" variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors shadow-md hover:shadow-lg transform hover:scale-105 py-3">
          <Link href="/assessment/report">
            <Download className="mr-2 h-5 w-5" /> {translate({en: "Download Report", hi: "रिपोर्ट डाउनलोड करें"})}
          </Link>
        </Button>
      </div>
    </div>
  );
}
