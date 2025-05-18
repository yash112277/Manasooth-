
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ClipboardList, Sparkles, BarChart3 } from 'lucide-react';
import { ASSESSMENT_TYPES, ASSESSMENT_NAMES, ASSESSMENT_FLOW, LOCAL_STORAGE_KEYS, type AssessmentTypeValue } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface AssessmentSelectionItem {
  id: AssessmentTypeValue;
  label: string;
}

const assessmentOptions: AssessmentSelectionItem[] = ASSESSMENT_FLOW.map(type => ({
  id: type,
  label: ASSESSMENT_NAMES[type],
}));


export default function AssessmentStartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedAssessments, setSelectedAssessments] = useState<AssessmentTypeValue[]>([]);

  const handleCheckboxChange = (assessmentType: AssessmentTypeValue) => {
    setSelectedAssessments(prev =>
      prev.includes(assessmentType)
        ? prev.filter(item => item !== assessmentType)
        : [...prev, assessmentType]
    );
  };

  const handleStartSelectedAssessments = () => {
    if (selectedAssessments.length === 0) {
      toast({
        title: "No Assessments Selected",
        description: "Please select at least one assessment to start.",
        variant: "destructive",
      });
      return;
    }

    const orderedSelectedFlow = ASSESSMENT_FLOW.filter(type => selectedAssessments.includes(type));

    if (orderedSelectedFlow.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_ASSESSMENT_FLOW, JSON.stringify(orderedSelectedFlow));
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_ASSESSMENT_SCORES); // Clear any previous scores
      router.push(`/assessment/${orderedSelectedFlow[0]}`);
    } else {
         toast({
            title: "Selection Error",
            description: "Could not determine the assessment flow. Please try again.",
            variant: "destructive",
         });
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 px-4">
      <Card className="w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center p-4 sm:p-6 md:p-8 bg-card">
           <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ClipboardList className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Choose Your Assessment Path</CardTitle>
          <CardDescription className="text-md sm:text-lg text-muted-foreground mt-2 sm:mt-3 max-w-xl mx-auto">
            Select how you'd like to complete your mental wellbeing check-in. You can take individual assessments or let our AI guide you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-4 sm:p-6 md:p-8">
          
          <Card className="bg-muted/30 p-6 rounded-lg shadow-md">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                <ClipboardList className="mr-3 h-7 w-7 text-primary" />
                Standard Assessments
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Select one or more assessments to complete using our guided forms.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {assessmentOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/60 transition-colors border bg-card">
                  <Checkbox
                    id={option.id}
                    checked={selectedAssessments.includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange(option.id)}
                    aria-labelledby={`label-${option.id}`}
                  />
                  <Label htmlFor={option.id} id={`label-${option.id}`} className="text-base font-medium cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </CardContent>
            <CardFooter className="p-0 pt-6">
                <Button 
                    size="lg" 
                    onClick={handleStartSelectedAssessments} 
                    className="w-full interactive-glow btn-neumorphic"
                    disabled={selectedAssessments.length === 0}
                >
                    Start Selected Assessment(s) <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </CardFooter>
          </Card>

          <Card className="bg-muted/30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
             <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                    <Sparkles className="mr-3 h-7 w-7 text-secondary" />
                    AI Conversational Assessment
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Let our AI guide you through your chosen assessment in a chat-like experience.
                </CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                <Button asChild size="lg" variant="secondary" className="w-full interactive-glow">
                    <Link href="/assessment/ai-conversational">
                    Start with AI <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
             </CardContent>
          </Card>
          
          <Separator className="my-8" />

          <div className="text-center">
             <Button asChild size="lg" className="btn-neumorphic py-3 px-8">
                <Link href="/assessment/results">
                  <BarChart3 className="mr-2 h-5 w-5" /> View My Latest Results & AI Analysis
                </Link>
              </Button>
            <p className="text-xs text-muted-foreground mt-3">
                If you've completed assessments previously, view your scores and AI insights.
            </p>
          </div>
          
          <div className="text-center pt-4">
             <Image
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21"
              alt="A serene image representing mental wellness assessments options"
              width={600}
              height={300}
              className="object-cover w-full h-auto rounded-lg shadow-md"
              
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-center space-y-2 p-4 sm:p-6 md:p-8 border-t bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            Your responses are private and help generate personalized feedback. Anonymous users' data is stored locally.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
