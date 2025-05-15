
"use client";

import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Assessment, Question } from '@/lib/types';

interface AssessmentFormProps {
  assessment: Assessment;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>; 
  formState: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: any;
  };
}

export function AssessmentForm({ assessment, control, formState }: AssessmentFormProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {assessment.questions.map((question, index) => (
        <Card key={question.id} className="shadow-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Question {index + 1}</CardTitle>
            <CardDescription className="text-md sm:text-lg text-foreground pt-2">{question.text}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Controller
              name={question.id}
              control={control}
              rules={{ required: 'Please select an option.' }}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                  className="space-y-2"
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted transition-colors">
                      <RadioGroupItem value={option.value.toString()} id={`${question.id}-${option.value}`} />
                      <Label htmlFor={`${question.id}-${option.value}`} className="text-sm sm:text-base font-normal cursor-pointer flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {formState.errors[question.id] && (
              <p className="text-sm font-medium text-destructive mt-2">
                {formState.errors[question.id]?.message?.toString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

