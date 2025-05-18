
"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowRight, CheckCircle, MessageSquare, BarChartBig, Activity, Lightbulb, ShieldCheck, Smile, Brain, HeartPulse, TrendingUp, Target as GoalIcon, Info, Award, Users } from 'lucide-react';
import Image from 'next/image';
// useAuth import removed
import type { CompletedAssessmentSet, UserGoal } from '@/lib/types';
import { ASSESSMENT_NAMES, ASSESSMENT_TYPES, type AssessmentTypeValue, LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { ASSESSMENTS_DATA } from '@/lib/assessment-questions';
import { Skeleton } from '@/components/ui/skeleton';
import { GOAL_DEFINITION_TYPES } from '@/lib/types';
import { isPast, parseISO, differenceInDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, type SupportedLanguage } from '@/contexts/LanguageContext'; 
import { cn } from '@/lib/utils';


const getScoreInterpretationText = (type: AssessmentTypeValue, score?: number): string => {
  if (score === undefined) return "Not taken";
  const assessmentDetails = ASSESSMENTS_DATA[type];
  if (!assessmentDetails?.interpretation) return `Score: ${score}`;
  for (const range in assessmentDetails.interpretation) {
    const [min, max] = range.split('-').map(Number);
    if (score >= min && score <= max) {
      return assessmentDetails.interpretation[range];
    }
  }
  return `Score: ${score}`;
};


const getAssessmentIcon = (type: AssessmentTypeValue) => {
  switch (type) {
    case ASSESSMENT_TYPES.WHO5:
      return <Smile className="h-7 w-7 text-primary" />;
    case ASSESSMENT_TYPES.GAD7:
      return <Brain className="h-7 w-7 text-primary" />;
    case ASSESSMENT_TYPES.PHQ9:
      return <HeartPulse className="h-7 w-7 text-primary" />;
    default:
      return <Activity className="h-7 w-7 text-primary" />;
  }
};

const welcomeTranslations: Record<SupportedLanguage, string> = {
  en: "Welcome to",
  hi: "में आपका स्वागत है" 
};

const taglineTranslations: Record<SupportedLanguage, string> = {
  en: "Your personalized companion for understanding and improving your mental wellbeing.",
  hi: "आपकी मानसिक भलाई को समझने और सुधारने के लिए आपका व्यक्तिगत साथी।"
};

const dashboardMessageTranslations: Record<SupportedLanguage, string> = {
  en: "Here's a quick look at your recent wellbeing journey and active goals.",
  hi: "यहां आपकी हाल की कल्याण यात्रा और सक्रिय लक्ष्यों पर एक त्वरित नज़र है।"
};

const anonMessageTranslations: Record<SupportedLanguage, string> = {
  en: "Take confidential assessments, track your progress, set goals, and receive AI-powered insights. Your data is stored locally in your browser.",
  hi: "गोपनीय मूल्यांकन करें, अपनी प्रगति को ट्रैक करें, लक्ष्य निर्धारित करें, और एआई-संचालित अंतर्दृष्टि प्राप्त करें। आपका डेटा आपके ब्राउज़र में स्थानीय रूप से संग्रहीत है।"
}

const featureCardsTranslations: Record<string, Record<SupportedLanguage, string>> = {
  guidedAssessmentsTitle: { en: "Guided Assessments", hi: "निर्देशित मूल्यांकन" },
  guidedAssessmentsDesc: { en: "Answer research-backed questionnaires (WHO-5, GAD-7, PHQ-9) to understand different aspects of your mental health.", hi: "अपने मानसिक स्वास्थ्य के विभिन्न पहलुओं को समझने के लिए शोध-समर्थित प्रश्नावली (WHO-5, GAD-7, PHQ-9) का उत्तर दें।" },
  guidedAssessmentsLink: { en: "Start Assessment", hi: "मूल्यांकन शुरू करें" },
  
  setGoalsTitle: { en: "Set Wellbeing Goals", hi: "कल्याण लक्ष्य निर्धारित करें" },
  setGoalsDesc: { en: "Define personal targets for your assessment scores and track your journey towards achieving them.", hi: "अपने मूल्यांकन स्कोर के लिए व्यक्तिगत लक्ष्य परिभाषित करें और उन्हें प्राप्त करने की अपनी यात्रा को ट्रैक करें।" },
  setGoalsLink: { en: "Set Goals", hi: "लक्ष्य निर्धारित करें" },

  trackProgressTitle: { en: "Track Your Progress", hi: "अपनी प्रगति को ट्रैक करें" },
  trackProgressDesc: { en: "Visualize your assessment scores over time with intuitive charts. Identify trends and celebrate improvements.", hi: "सहज ज्ञान युक्त चार्ट के साथ समय के साथ अपने मूल्यांकन स्कोर की कल्पना करें। रुझानों को पहचानें और सुधारों का जश्न मनाएं।" },
  trackProgressLink: { en: "View Progress", hi: "प्रगति देखें" },

  aiSupportTitle: { en: "AI-Powered Support", hi: "एआई-संचालित सहायता" },
  aiSupportDesc: { en: "Receive instant, AI-driven feedback based on your assessment results and chat with our supportive AI bot.", hi: "अपने मूल्यांकन परिणामों के आधार पर तत्काल, एआई-संचालित प्रतिक्रिया प्राप्त करें और हमारे सहायक एआई बॉट के साथ चैट करें।" },
  aiSupportLink: { en: "Talk to Bot", hi: "बॉट से बात करें" },
  
  journeyTitle: { en: "Your Journey to Wellbeing Starts Here", hi: "आपकी कल्याण की यात्रा यहीं से शुरू होती है" },
  journeyDesc: { en: "Manasooth provides tools and insights to help you navigate your mental health journey. Our platform is designed to be a supportive, confidential, and empowering resource.", hi: "मनोसूथ आपकी मानसिक स्वास्थ्य यात्रा को नेविगेट करने में मदद करने के लिए उपकरण और अंतर्दृष्टि प्रदान करता है। हमारा मंच एक सहायक, गोपनीय और सशक्त संसाधन बनने के लिए डिज़ाइन किया गया है।" },
  confidentialSecure: { en: "Confidential & Secure", hi: "गोपनीय और सुरक्षित" },
  evidenceBased: { en: "Evidence-Based Assessments", hi: "साक्ष्य-आधारित मूल्यांकन" },
  personalizedAI: { en: "Personalized AI Insights", hi: "व्यक्तिगत एआई अंतर्दृष्टि" },
  actionableGoals: { en: "Actionable Goal Setting", hi: "कार्रवाई योग्य लक्ष्य निर्धारण" },
  
  recentSnapshotTitle: { en: "Your Recent Wellbeing Snapshot", hi: "आपकी हाल की सेहत का स्नैपशॉट" },
  recentSnapshotDesc: { en: "From your assessment on", hi: "आपके मूल्यांकन से" },
  activeGoalsTitle: { en: "Your Active Goals", hi: "आपके सक्रिय लक्ष्य" },
  viewAllGoals: { en: "View & Manage All Goals", hi: "सभी लक्ष्य देखें और प्रबंधित करें" },
  latestAIInsightsTitle: { en: "Latest AI Insights", hi: "नवीनतम एआई अंतर्दृष्टि" },
  aiFeedbackSnippet: { en: "AI Feedback Snippet", hi: "एआई फ़ीडबैक स्निपेट" },
  aiRecommendationHighlight: { en: "AI Recommendation Highlight", hi: "एआई अनुशंसा हाइलाइट" },
  viewFullAnalysis: { en: "View Full Analysis", hi: "पूर्ण विश्लेषण देखें" },
  startNewAssessment: { en: "Start New Assessment", hi: "नया मूल्यांकन शुरू करें" },
  manageGoals: { en: "Manage Goals", hi: "लक्ष्य प्रबंधित करें" },
  viewFullProgress: { en: "View Full Progress", hi: "पूरी प्रगति देखें" },
  takeAnAssessment: { en: "Take an Assessment", hi: "एक मूल्यांकन करें" },
  chatWithAIBot: { en: "Chat with AI Bot", hi: "एआई बॉट से चैट करें" },
  friendlyReminderTitle: { en: "Friendly Reminder", hi: "मित्रवत अनुस्मारक" },
  takeAssessmentNow: { en: "Take an Assessment Now", hi: "अभी मूल्यांकन करें" },
};


export default function HomePage() {
  // const { user, loading: authLoading } = useAuth(); // authLoading removed, user always null
  const { translate, language } = useLanguage(); 
  const [latestAssessment, setLatestAssessment] = useState<CompletedAssessmentSet | null>(null);
  const [activeGoals, setActiveGoals] = useState<UserGoal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [showAssessmentReminder, setShowAssessmentReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");
  const REMINDER_THRESHOLD_DAYS = 14;

  const [isClientMounted, setIsClientMounted] = useState(false);
  useEffect(() => {
    setIsClientMounted(true);
  }, []);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateGoalsBasedOnAssessment = useCallback((assessment: CompletedAssessmentSet | null) => {
    if (!isClient) return;
    const storedGoalsString = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS);
    if (!storedGoalsString) {
      setActiveGoals([]);
      return;
    }

    let currentGoals: UserGoal[] = [];
    try {
        currentGoals = JSON.parse(storedGoalsString) as UserGoal[];
    } catch (error) {
        console.error("Failed to parse goals from localStorage for update", error);
        setActiveGoals([]); 
        return;
    }
    
    let goalsWereUpdated = false;

    if (assessment) {
      const scoreMap: Partial<Record<AssessmentTypeValue, number | undefined>> = {
        [ASSESSMENT_TYPES.WHO5]: assessment.who5Score,
        [ASSESSMENT_TYPES.GAD7]: assessment.gad7Score,
        [ASSESSMENT_TYPES.PHQ9]: assessment.phq9Score,
      };

      currentGoals = currentGoals.map(goal => {
        if (goal.status !== 'active') return goal;

        const latestScoreForGoalType = scoreMap[goal.assessmentType];
        if (latestScoreForGoalType === undefined) return goal;
        
        let updatedGoal = { ...goal, currentScore: latestScoreForGoalType };
        let achieved = false;

        if (goal.goalDefinitionType === GOAL_DEFINITION_TYPES.REACH_SPECIFIC_SCORE) {
          if (goal.assessmentType === ASSESSMENT_TYPES.WHO5) {
            achieved = latestScoreForGoalType >= goal.targetValue;
          } else {
            achieved = latestScoreForGoalType <= goal.targetValue;
          }
        } else if (goal.goalDefinitionType === GOAL_DEFINITION_TYPES.IMPROVE_CURRENT_SCORE) {
          const change = latestScoreForGoalType - goal.startScore;
          if (goal.assessmentType === ASSESSMENT_TYPES.WHO5) {
            achieved = change >= goal.targetValue;
          } else {
            achieved = change <= -goal.targetValue;
          }
        }

        if (achieved) {
          updatedGoal.status = 'achieved';
          goalsWereUpdated = true;
          toast({ title: "Goal Achieved!", description: `Congrats on achieving: ${goal.description || `Goal for ${ASSESSMENT_NAMES[goal.assessmentType]}`}`, className: "bg-green-500 text-white dark:bg-green-600 dark:text-white" });
        } else if (goal.targetDate && isPast(parseISO(goal.targetDate)) && !achieved) {
          updatedGoal.status = 'missed';
          goalsWereUpdated = true;
        }
        return updatedGoal;
      });
    }
    
    if (goalsWereUpdated) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_GOALS, JSON.stringify(currentGoals));
      } catch (error) {
        console.error("Failed to save updated goals to localStorage", error);
      }
    }
    setActiveGoals(currentGoals.filter(g => g.status === 'active'));
  }, [isClient, toast]);

  const loadGoalsOnly = useCallback(() => {
    if (!isClient) return;
    try {
      const storedGoalsString = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS);
      if (storedGoalsString) {
        const allGoals = JSON.parse(storedGoalsString) as UserGoal[];
        setActiveGoals(allGoals.filter(g => g.status === 'active'));
      } else {
        setActiveGoals([]);
      }
    } catch (error) {
        console.error("Failed to load goals from localStorage", error);
        setActiveGoals([]);
    }
  }, [isClient]);

  const loadAndProcessData = useCallback(() => {
    if (/*!authLoading && */ !isClient) { // authLoading check removed
        return;
    }
    setIsLoadingData(true); 

    try {
      const progressDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS_DATA);
      let currentLatestAssessment: CompletedAssessmentSet | null = null;
      if (progressDataString) {
        const allProgress = JSON.parse(progressDataString) as CompletedAssessmentSet[];
        if (allProgress.length > 0) {
          allProgress.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          currentLatestAssessment = allProgress[0];
          setLatestAssessment(currentLatestAssessment);
          updateGoalsBasedOnAssessment(currentLatestAssessment);
        } else {
          setLatestAssessment(null);
          loadGoalsOnly(); 
        }
      } else {
        setLatestAssessment(null);
        loadGoalsOnly(); 
      }

      const reminderMsgBase = language === 'hi' 
        ? `आपकी पिछली सेहत जांच को ${REMINDER_THRESHOLD_DAYS} दिन से ज़्यादा हो गए हैं। नियमित मूल्यांकन आपकी प्रगति को ट्रैक करने में मदद करते हैं।`
        : `It's been over ${REMINDER_THRESHOLD_DAYS} days since your last wellbeing check-in. Regular assessments help track your progress.`;
      
      const firstCheckinMsg = language === 'hi'
        ? "अपनी पहली सेहत जांच शुरू करने के लिए तैयार हैं? अपनी वर्तमान स्थिति को समझने के लिए मूल्यांकन करें।"
        : "Ready to start your first wellbeing check-in? Take an assessment to understand your current state.";

      if (!currentLatestAssessment) {
        setReminderMessage(firstCheckinMsg);
        setShowAssessmentReminder(true);
      } else {
        const daysSinceLast = differenceInDays(new Date(), parseISO(currentLatestAssessment.date));
        if (daysSinceLast > REMINDER_THRESHOLD_DAYS) {
          setReminderMessage(reminderMsgBase);
          setShowAssessmentReminder(true);
        } else {
          setShowAssessmentReminder(false);
        }
      }

    } catch (error) {
      console.error("Failed to load or process data from localStorage", error);
      setLatestAssessment(null);
      loadGoalsOnly(); 
      setShowAssessmentReminder(false); 
    } finally {
      setIsLoadingData(false); 
    }
  }, [/*authLoading,*/ isClient, language, updateGoalsBasedOnAssessment, loadGoalsOnly, REMINDER_THRESHOLD_DAYS]); // authLoading removed
  
  useEffect(() => {
    if (isClient) { 
      loadAndProcessData();
    }
  }, [isClient, /*authLoading, user,*/ language, loadAndProcessData]); // authLoading, user removed
  

  return (
    <div className="flex flex-col items-center justify-center space-y-10 sm:space-y-16 p-4 sm:p-6 md:p-8">
      <section className="text-center space-y-4 sm:space-y-6 w-full max-w-4xl animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          {language === 'hi' ? "मनोसूथ " : ""}{translate(welcomeTranslations)}{language !== 'hi' ? " Manasooth" : ""}
          {/* User-specific welcome removed: user && !authLoading && `, ${user.email?.split('@')[0] || 'Explorer'}!`*/}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          { latestAssessment || activeGoals.length > 0 // Simplified condition as user is always null
            ? translate(dashboardMessageTranslations)
            : translate(taglineTranslations)}
          {` ${translate(anonMessageTranslations)}`} {/* Always show anon message */}
        </p>
      </section>

      {isClientMounted && (isLoadingData /*|| authLoading*/) && ( // authLoading removed
        <DashboardSkeleton />
      )}

      {isClientMounted && !isLoadingData /*&& !authLoading*/ && (latestAssessment || activeGoals.length > 0) && ( // authLoading removed, user is always null
        <section className="w-full max-w-5xl space-y-8 sm:space-y-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
           {showAssessmentReminder && (
             <Alert
              variant="default"
              className="bg-accent/10 border-accent/20 mt-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out max-w-xl mx-auto animate-fadeIn"
            >
              <Info className="h-6 w-6 text-primary" />
              <AlertTitle className="font-semibold text-foreground text-lg">
                {translate(featureCardsTranslations.friendlyReminderTitle)}
              </AlertTitle>
              <AlertDescription className="text-foreground mt-1">
                {reminderMessage}
                <Button asChild variant="link" className="text-primary p-0 h-auto ml-1 hover:underline font-semibold">
                  <Link href="/assessment">
                    {translate(featureCardsTranslations.takeAssessmentNow)}
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {latestAssessment && (
            <Card className="shadow-xl bg-card border-border hover:shadow-2xl transition-shadow duration-300 ease-in-out card-hover-effect">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  {translate(featureCardsTranslations.recentSnapshotTitle)}
                </CardTitle>
                <CardDescription className="text-md">
                  {translate(featureCardsTranslations.recentSnapshotDesc)} {format(parseISO(latestAssessment.date), language === 'hi' ? 'PPP' : 'MMMM d, yyyy', { locale: language === 'hi' ? require('date-fns/locale/hi') : undefined })}.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {Object.values(ASSESSMENT_TYPES).map(type => {
                  const score = latestAssessment[`${type}Score` as keyof CompletedAssessmentSet] as number | undefined;
                  if (score !== undefined) {
                    return <ScoreCard key={type} type={type} score={score} />;
                  }
                  return null;
                })}
              </CardContent>
            </Card>
          )}
          
          {activeGoals.length > 0 && (
            <Card className="shadow-xl bg-card border-border hover:shadow-2xl transition-shadow duration-300 ease-in-out card-hover-effect">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
                  <GoalIcon className="h-8 w-8 text-primary" />
                  {translate(featureCardsTranslations.activeGoalsTitle)}
                </CardTitle>
                 <CardDescription className="text-md">
                  {language === 'hi' ? "आप वर्तमान में इन लक्ष्यों की ओर काम कर रहे हैं।" : "You are currently working towards these goals."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeGoals.slice(0,3).map(goal => ( 
                    <Card key={goal.id} className="bg-secondary/10 border-secondary/30 hover:shadow-md transition-shadow duration-300 ease-in-out">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-secondary-foreground flex items-center gap-2">
                            <Award className="h-5 w-5"/>{ASSESSMENT_NAMES[goal.assessmentType]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2">{goal.description || "No description"}</p>
                        {goal.targetDate && <p className="text-xs text-muted-foreground mt-1">Target: {format(parseISO(goal.targetDate), 'PPP')}</p>}
                      </CardContent>
                    </Card>
                ))}
                <Button asChild variant="link" className="text-primary p-0 h-auto font-semibold mt-2 text-md">
                  <Link href="/goals">{translate(featureCardsTranslations.viewAllGoals)} <ArrowRight className="ml-1 h-4 w-4"/></Link>
                </Button>
              </CardContent>
            </Card>
          )}


          {latestAssessment && (latestAssessment.aiFeedback || latestAssessment.aiRecommendations) && (
            <Card className="shadow-xl bg-card border-border hover:shadow-2xl transition-shadow duration-300 ease-in-out card-hover-effect">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3">
                  <Lightbulb className="h-8 w-8 text-primary" />
                  {translate(featureCardsTranslations.latestAIInsightsTitle)}
                </CardTitle>
                 <CardDescription className="text-md">
                  {language === 'hi' ? "आपके नवीनतम मूल्यांकन पर आधारित वैयक्तिकृत अंतर्दृष्टि।" : "Personalized insights based on your latest assessment."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestAssessment.aiFeedback && (
                  <Card className="bg-secondary/10 border-secondary/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-secondary-foreground flex items-center gap-2">
                            <MessageSquare className="h-5 w-5"/>{translate(featureCardsTranslations.aiFeedbackSnippet)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground line-clamp-3 whitespace-pre-line">
                        {latestAssessment.aiFeedback}
                        </p>
                    </CardContent>
                  </Card>
                )}
                {latestAssessment.aiRecommendations && (
                  <Card className="bg-accent/10 border-accent/30">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5"/>{translate(featureCardsTranslations.aiRecommendationHighlight)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground line-clamp-3 whitespace-pre-line">
                        {latestAssessment.aiRecommendations}
                        </p>
                    </CardContent>
                  </Card>
                )}
                <Button asChild variant="link" className="text-primary p-0 h-auto font-semibold mt-2 text-md">
                  <Link href="/assessment/results">{translate(featureCardsTranslations.viewFullAnalysis)} <ArrowRight className="ml-1 h-4 w-4"/></Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center pt-6">
            <Button asChild size="lg" className="btn-neumorphic shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto py-3">
              <Link href="/assessment">
                {translate(featureCardsTranslations.startNewAssessment)} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
             <Button asChild size="lg" variant="outline" className="interactive-glow shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto py-3">
              <Link href="/goals">
                {translate(featureCardsTranslations.manageGoals)} <GoalIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="interactive-glow shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto py-3">
              <Link href="/progress">
                {translate(featureCardsTranslations.viewFullProgress)} <BarChartBig className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {isClientMounted && !isLoadingData /*&& !authLoading && !user*/ && !latestAssessment && activeGoals.length === 0 && ( // authLoading, user removed
        <>
        {showAssessmentReminder && (
             <Alert
              variant="default"
              className="bg-accent/10 border-accent/20 mt-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out max-w-xl mx-auto animate-fadeIn"
            >
              <Info className="h-6 w-6 text-primary" />
              <AlertTitle className="font-semibold text-foreground text-lg">
                {translate(featureCardsTranslations.friendlyReminderTitle)}
              </AlertTitle>
              <AlertDescription className="text-foreground mt-1">
                {reminderMessage}
                <Button asChild variant="link" className="text-primary p-0 h-auto ml-1 hover:underline font-semibold">
                  <Link href="/assessment">{translate(featureCardsTranslations.takeAssessmentNow)}</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-lg pt-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="btn-neumorphic shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto py-3">
              <Link href="/assessment">
                {translate(featureCardsTranslations.takeAnAssessment)} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="interactive-glow shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto py-3">
              <Link href="/chatbot">
                {translate(featureCardsTranslations.chatWithAIBot)} <MessageSquare className="ml-2 h-5 w-5" />
              </Link>
            </Button>
        </div>
        </>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-7xl pt-10">
        <FeatureCard
          className="animate-fadeIn interactive-glow" style={{ animationDelay: '0.1s' }}
          icon={<CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
          title={translate(featureCardsTranslations.guidedAssessmentsTitle)}
          description={translate(featureCardsTranslations.guidedAssessmentsDesc)}
          link="/assessment"
          linkText={translate(featureCardsTranslations.guidedAssessmentsLink)}
        />
        <FeatureCard
          className="animate-fadeIn interactive-glow" style={{ animationDelay: '0.2s' }}
          icon={<GoalIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
          title={translate(featureCardsTranslations.setGoalsTitle)}
          description={translate(featureCardsTranslations.setGoalsDesc)}
          link="/goals"
          linkText={translate(featureCardsTranslations.setGoalsLink)}
        />
        <FeatureCard
          className="animate-fadeIn interactive-glow" style={{ animationDelay: '0.3s' }}
          icon={<BarChartBig className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
          title={translate(featureCardsTranslations.trackProgressTitle)}
          description={translate(featureCardsTranslations.trackProgressDesc)}
          link="/progress"
          linkText={translate(featureCardsTranslations.trackProgressLink)}
        />
        <FeatureCard
          className="animate-fadeIn interactive-glow" style={{ animationDelay: '0.4s' }}
          icon={<Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
          title={translate(featureCardsTranslations.aiSupportTitle)}
          description={translate(featureCardsTranslations.aiSupportDesc)}
          link="/chatbot"
          linkText={translate(featureCardsTranslations.aiSupportLink)}
        />
      </section>

      <section className="w-full max-w-5xl p-6 sm:p-10 bg-card rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-8 sm:gap-12 mt-8 animate-fadeIn card-hover-effect" style={{ animationDelay: '0.5s' }}>
        <div className="flex-1 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{translate(featureCardsTranslations.journeyTitle)}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {translate(featureCardsTranslations.journeyDesc)}
          </p>
          <ul className="space-y-3 text-muted-foreground text-md">
            <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-green-500" /> {translate(featureCardsTranslations.confidentialSecure)}</li>
            <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-green-500" /> {translate(featureCardsTranslations.evidenceBased)}</li>
            <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-green-500" /> {translate(featureCardsTranslations.personalizedAI)}</li>
            <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-green-500" /> {translate(featureCardsTranslations.actionableGoals)}</li>
          </ul>
        </div>
        <div className="flex-shrink-0 mt-6 md:mt-0 w-full md:w-auto max-w-md md:max-w-none">
          <Image 
            src="https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd"
            alt={translate({en: "Image depicting a serene path towards mental wellbeing", hi: "मानसिक कल्याण की ओर एक शांत मार्ग दर्शाती छवि"})}
            width={450} 
            height={350} 
            className="rounded-lg shadow-xl object-cover w-full h-auto"
            
          />
        </div>
      </section>
      
       <section className="w-full max-w-5xl p-6 sm:p-10 bg-card rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-8 sm:gap-12 mt-8 animate-fadeIn card-hover-effect" style={{ animationDelay: '0.6s' }}>
        <div className="flex-shrink-0 mt-6 md:mt-0 w-full md:w-auto max-w-md md:max-w-none">
          <Image 
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66"
            alt={translate({en: "Illustration of a calm mind or lotus flower", hi: "शांत मन या कमल के फूल का चित्रण"})}
            width={450} 
            height={350} 
            className="rounded-lg shadow-xl object-cover w-full h-auto"
            
          />
        </div>
         <div className="flex-1 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{translate({en: "Find Your Center", hi: "अपना केंद्र खोजें"})}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {translate({en: "Explore tools designed to help you understand your emotions, build resilience, and cultivate a sense of peace. Manasooth is here to support you every step of the way.", hi: "अपनी भावनाओं को समझने, लचीलापन बनाने और शांति की भावना पैदा करने में मदद करने के लिए डिज़ाइन किए गए टूल का अन्वेषण करें। मनोसूथ हर कदम पर आपका समर्थन करने के लिए यहां है।"})}
          </p>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
  className?: string;
  style?: React.CSSProperties;
}

function FeatureCard({ icon, title, description, link, linkText, className, style }: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        "shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col bg-card hover:border-primary/50 border-2 border-transparent card-hover-effect",
        className
      )}
      style={style}
    >
      <CardHeader className="items-center text-center pt-8 pb-4">
        <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
            {icon}
        </div>
        <CardTitle className="mt-2 text-xl sm:text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-center px-5 sm:px-7">
        <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</CardDescription>
      </CardContent>
      <CardFooter className="justify-center pb-8 pt-5">
        <Button 
          asChild 
          variant="outline" 
          size="md" 
          className="interactive-glow hover:bg-primary hover:text-primary-foreground border-primary/50 text-primary font-semibold w-full sm:w-auto py-3 px-6 transition-all duration-300 ease-in-out"
        >
          <Link href={link}>{linkText} <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ScoreCard({ type, score }: { type: AssessmentTypeValue, score: number }) {
  const { language, translate } = useLanguage();
  const assessmentInfo = ASSESSMENT_NAMES[type];
  
  const nameTranslations : Record<string, Record<SupportedLanguage, string>> = {
    [ASSESSMENT_TYPES.WHO5] : {en: ASSESSMENT_NAMES.who5, hi: "WHO-5 सेहत सूचकांक"},
    [ASSESSMENT_TYPES.GAD7] : {en: ASSESSMENT_NAMES.gad7, hi: "GAD-7 चिंता मूल्यांकन"},
    [ASSESSMENT_TYPES.PHQ9] : {en: ASSESSMENT_NAMES.phq9, hi: "PHQ-9 अवसाद स्क्रीनिंग"},
  }
  const translatedName = translate(nameTranslations[type] || {en: assessmentInfo, hi: assessmentInfo});


  return (
    <Card className="bg-muted/30 hover:shadow-lg transition-shadow duration-300 ease-in-out p-1 rounded-xl border card-hover-effect">
      <CardContent className="p-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3">
            <div className="p-3 bg-primary/10 rounded-full">
                {getAssessmentIcon(type)}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">{translatedName}</CardTitle>
        </div>
        <p className="text-5xl sm:text-6xl font-bold text-primary my-2 text-center">{score}</p>
        <p className="text-sm sm:text-md text-muted-foreground text-center">{getScoreInterpretationText(type, score)}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <section className="w-full max-w-5xl space-y-10 sm:space-y-12">
       {/* Assessment Reminder Skeleton */}
      <Card className="bg-accent/10 border-accent/20 shadow-lg">
        <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-1/3" />
            </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>

      {/* Recent Snapshot Skeleton */}
      <Card className="shadow-xl bg-card border-border">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Skeleton className="h-40 sm:h-48 rounded-xl" />
          <Skeleton className="h-40 sm:h-48 rounded-xl" />
          <Skeleton className="h-40 sm:h-48 rounded-xl" />
        </CardContent>
      </Card>

       {/* Active Goals Skeleton */}
       <Card className="shadow-xl bg-card border-border">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-6 w-1/3" />
        </CardContent>
      </Card>

      {/* Latest AI Insights Skeleton */}
      <Card className="shadow-xl bg-card border-border">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-6 w-1/3" />
        </CardContent>
      </Card>

      {/* Action Buttons Skeleton */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center pt-6">
        <Skeleton className="h-12 sm:h-14 w-full sm:w-52 rounded-lg" />
        <Skeleton className="h-12 sm:h-14 w-full sm:w-48 rounded-lg" />
        <Skeleton className="h-12 sm:h-14 w-full sm:w-48 rounded-lg" />
      </div>
    </section>
  );
}
