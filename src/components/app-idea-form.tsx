"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  appIdea: z.string().min(50, {
    message:
      "App idea should be at least 50 characters long to provide enough context for analysis.",
  }),
});

interface AnalysisResult {
  violations: Array<{
    guideline: string;
    explanation: string;
    probability: number;
  }>;
  isCompliant: boolean;
}

export function AppIdeaForm() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appIdea: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing app idea:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="appIdea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your app idea in detail</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Example: I want to create an iOS app that helps users track their daily water intake. The app will send notifications, allow users to log their drinks, and provide insights about their hydration habits..."
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAnalyzing ? "Analyzing..." : "Analyze App Idea"}
          </Button>
        </form>
      </Form>

      {result && (
        <div className="space-y-4">
          {!result.isCompliant && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Potential Guidelines Violations Found</AlertTitle>
              <AlertDescription>
                Your app idea may conflict with some App Store guidelines. See
                details below.
              </AlertDescription>
            </Alert>
          )}

          {result.isCompliant && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Major Issues Found</AlertTitle>
              <AlertDescription>
                Your app idea appears to be compliant with the App Store
                guidelines. However, please note that this is just an initial
                analysis and the actual review process may differ.
              </AlertDescription>
            </Alert>
          )}

          {result.violations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Analysis:</h3>
              {result.violations.map((violation, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTitle>{violation.guideline}</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p>{violation.explanation}</p>
                    <p className="mt-2 text-sm">
                      Confidence: {Math.round(violation.probability * 100)}%
                    </p>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
