
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Bot, User, Send, Loader2, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { ASSESSMENTS_DATA } from '@/lib/assessment-questions';
import { ASSESSMENT_TYPES, ASSESSMENT_NAMES, type AssessmentTypeValue } from '@/lib/constants';
import type { Question, QuestionOption } from '@/lib/types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

type ConversationalStage =
  | { type: 'awaiting_assessment_choice' }
  | { type: 'assessment_question'; assessmentType: AssessmentTypeValue; questionIndex: number }
  | { type: 'conclusion' };

const assessmentChoicesMap: Record<string, AssessmentTypeValue | undefined> = {
  "who-5": ASSESSMENT_TYPES.WHO5, "who5": ASSESSMENT_TYPES.WHO5, "wellbeing": ASSESSMENT_TYPES.WHO5, "well being": ASSESSMENT_TYPES.WHO5,
  "gad-7": ASSESSMENT_TYPES.GAD7, "gad7": ASSESSMENT_TYPES.GAD7, "anxiety": ASSESSMENT_TYPES.GAD7,
  "phq-9": ASSESSMENT_TYPES.PHQ9, "phq9": ASSESSMENT_TYPES.PHQ9, "depression": ASSESSMENT_TYPES.PHQ9,
};


export default function AiConversationalAssessmentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<ConversationalStage>({ type: 'awaiting_assessment_choice' });
  // Mock scores - in a real app, these would be collected and processed
  const [mockScores, setMockScores] = useState<Record<string, number[]>>({});

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        requestAnimationFrame(() => {
          scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        });
      }
    }
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hello! I'm Manasooth's assessment assistant. I can guide you through one of the following questionnaires:\n\n- WHO-5 Well-being Index\n- GAD-7 Anxiety Assessment\n- PHQ-9 Depression Screening\n\nWhich one would you like to take today? Please type its name (e.g., 'WHO-5', 'Anxiety', or 'PHQ-9').",
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const formatQuestionWithOptions = (question: Question): string => {
    const optionsString = question.options.map(opt => `${opt.value}: ${opt.text}`).join('\n');
    return `${question.text}\n\nOptions (reply with the number corresponding to your choice):\n${optionsString}`;
  };

  const getMockAIResponse = (userInput: string): string => {
    let responseText = "";
    let nextStage: ConversationalStage = currentStage;

    switch (currentStage.type) {
      case "awaiting_assessment_choice":
        const chosenKey = userInput.trim().toLowerCase().replace(/\s+/g, '');
        const chosenAssessmentType = assessmentChoicesMap[chosenKey];
        
        if (chosenAssessmentType && ASSESSMENTS_DATA[chosenAssessmentType]) {
          const assessmentData = ASSESSMENTS_DATA[chosenAssessmentType];
          responseText = `Great! Let's start with the ${ASSESSMENT_NAMES[chosenAssessmentType]}. It has ${assessmentData.questions.length} questions.`;
          const firstQuestion = assessmentData.questions[0];
          responseText += `\n\nQuestion 1: ${formatQuestionWithOptions(firstQuestion)}`;
          nextStage = { type: 'assessment_question', assessmentType: chosenAssessmentType, questionIndex: 0 };
        } else {
          responseText = "I'm sorry, I didn't recognize that assessment. Please choose from WHO-5, GAD-7, or PHQ-9. For example, type 'GAD-7'.";
          // nextStage remains 'awaiting_assessment_choice'
        }
        break;

      case "assessment_question":
        const { assessmentType, questionIndex } = currentStage;
        const currentAssessmentData = ASSESSMENTS_DATA[assessmentType];
        const currentQuestion = currentAssessmentData.questions[questionIndex];

        const userAnswerNumeric = parseInt(userInput.trim());
        const isValidOption = currentQuestion.options.some(opt => opt.value === userAnswerNumeric);

        if (isNaN(userAnswerNumeric) || !isValidOption) {
          responseText = `I'm sorry, I didn't quite catch that. Please select one of the numbered options for the question. Let's try again:\n\nQuestion ${questionIndex + 1}: ${formatQuestionWithOptions(currentQuestion)}`;
          // nextStage remains currentStage, re-prompting the same question
        } else {
          // Valid input, proceed (mock storing score)
          setMockScores(prev => ({
            ...prev,
            [assessmentType]: [...(prev[assessmentType] || []), userAnswerNumeric]
          }));

          const nextQuestionIndex = questionIndex + 1;
          if (nextQuestionIndex < currentAssessmentData.questions.length) {
            const nextQ = currentAssessmentData.questions[nextQuestionIndex];
            responseText = `Okay. Question ${nextQuestionIndex + 1} for ${ASSESSMENT_NAMES[assessmentType]}:\n${formatQuestionWithOptions(nextQ)}`;
            nextStage = { type: 'assessment_question', assessmentType, questionIndex: nextQuestionIndex };
          } else {
            responseText = `Excellent! You've completed the ${ASSESSMENT_NAMES[assessmentType]}. Your results will be processed. (In a real app, you'd be directed to the results page now or given a summary, and your actual scores would be saved). Thank you for your time!`;
            nextStage = { type: 'conclusion' };
          }
        }
        break;

      case "conclusion":
        responseText = "You've already completed this assessment session. If you'd like to take another assessment, you can start a new session from the assessment page. For now, you can view your results (if this session were real) or explore other features.";
        break;
    }

    setCurrentStage(nextStage);
    return responseText;
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));

    try {
      const aiTextResponse = getMockAIResponse(currentInput);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiTextResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Conversational Assessment Error:", error);
      toast({ title: "Error", description: "Something went wrong with the conversational flow.", variant: "destructive" });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a little trouble right now. Please try again in a moment or try our standard assessment forms.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col shadow-2xl max-w-3xl mx-auto w-full">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <MessageCircleQuestion className="mr-3 h-7 w-7 text-primary" /> AI Conversational Assessment
              </CardTitle>
              <CardDescription>Chat with our AI to complete your chosen wellbeing check-in.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4 sm:p-6" ref={scrollAreaRef}>
            <div className="space-y-6" aria-live="polite" aria-atomic="false">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <Avatar className="h-10 w-10 border border-primary/50">
                       <div className="bg-primary rounded-full p-1.5">
                        <Bot className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] sm:max-w-[80%] rounded-xl px-4 py-3 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card border border-border text-card-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.sender === 'user' && (
                     <Avatar className="h-10 w-10 border">
                       <div className="bg-secondary rounded-full p-1.5">
                        <User className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-3 justify-start">
                  <Avatar className="h-10 w-10 border border-primary/50">
                     <div className="bg-primary rounded-full p-1.5">
                        <Bot className="h-6 w-6 text-primary-foreground" />
                      </div>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-xl px-4 py-3 shadow-md bg-card border border-border text-card-foreground rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
               {currentStage.type === "conclusion" && messages.length > 0 && messages[messages.length -1].sender === 'ai' && !isLoading && (
                <div className="text-center pt-6">
                    <Button asChild variant="outline">
                        <Link href="/assessment/results">View My Results (Simulated)</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        (Note: This conversational assessment is currently a simulation. Actual results processing, scoring, and Genkit integration are pending.)
                    </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStage.type !== "conclusion") {
                handleSendMessage();
              }
            }}
            className="flex w-full items-center space-x-3"
          >
            <Input
              type="text"
              placeholder={currentStage.type === "conclusion" ? "Assessment complete. Explore other options." : 
                             currentStage.type === "awaiting_assessment_choice" ? "Type assessment name (e.g. WHO-5)..." :
                             "Type your response (e.g., a number for your choice)..."
                           }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-base py-3 px-4 h-12"
              disabled={isLoading || currentStage.type === "conclusion"}
              aria-label="Chat message input"
            />
            <Button type="submit" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading || input.trim() === '' || currentStage.type === "conclusion"}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
