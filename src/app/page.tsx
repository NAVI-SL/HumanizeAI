'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Loader2, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { handleAnalyzeText, handleRewriteText } from '@/app/actions';
import { CopyButton } from '@/components/copy-button';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
  text: z.string().min(50, {
    message: 'Please input at least 50 characters for analysis.',
  }),
});

type AnalysisResult = {
  score: number;
} | null;

type LoadingState = 'idle' | 'analyzing' | 'humanizing';

export default function ClarityFlowPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [animatedScore, setAnimatedScore] = useState(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
    },
  });

  useEffect(() => {
    if (!analysisResult) {
      setAnimatedScore(0);
      return;
    }

    const finalScore = Math.round(analysisResult.score * 100);
    let animationFrameId: number;
    let startTimestamp: number | null = null;
    const duration = 1000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setAnimatedScore(Math.floor(progress * finalScore));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [analysisResult]);

  const onSubmit = (values: z.infer<typeof FormSchema>, action: 'analyze' | 'humanize') => {
    startTransition(async () => {
      setLoadingState(action === 'analyze' ? 'analyzing' : 'humanizing');
      setAnalysisResult(null);
      setRewrittenText(null);

      try {
        if (action === 'analyze') {
          const result = await handleAnalyzeText(values.text);
          if (result.success) {
            setAnalysisResult(result.data);
          } else {
            toast({ variant: 'destructive', title: 'Analysis Failed', description: result.error });
          }
        } else {
          const result = await handleRewriteText(values.text);
          if (result.success) {
            setRewrittenText(result.data.rewrittenText);
          } else {
            toast({ variant: 'destructive', title: 'Humanization Failed', description: result.error });
          }
        }
      } catch (e) {
        toast({ variant: 'destructive', title: 'An Error Occurred', description: 'Something went wrong. Please try again.' });
      } finally {
        setLoadingState('idle');
      }
    });
  };

  const handleReset = () => {
    form.reset({ text: '' });
    setAnalysisResult(null);
    setRewrittenText(null);
    setLoadingState('idle');
  };

  const isLoading = isPending || loadingState !== 'idle';

  return (
    <div className="flex min-h-dvh flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="flex items-center gap-3 py-8">
        <Logo className="h-10 w-10" />
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">ClarityFlow</h1>
      </header>

      <main className="w-full max-w-3xl">
        <Card className="glowing-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Analyze & Humanize Text</CardTitle>
            <CardDescription>
             Enter text to analyze for AI content and rewrite it to sound more human.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form>
              <CardContent>
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Text to analyze</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter text here..."
                          className="min-h-[200px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={form.handleSubmit(v => onSubmit(v, 'analyze'))}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {loadingState === 'analyzing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  Analyze
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(v => onSubmit(v, 'humanize'))}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {loadingState === 'humanizing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Humanize
                </Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {(analysisResult || rewrittenText) && (
          <div className="mt-8 grid gap-8" data-state="open" data-animate-in>
            {analysisResult && (
              <Card className="animate-in fade-in-0 zoom-in-95 duration-500 glowing-card">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Detection Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-headline text-3xl font-bold tracking-tighter text-primary">
                      {animatedScore}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {rewrittenText && (
              <Card className="animate-in fade-in-0 zoom-in-95 duration-500 glowing-card-accent">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center justify-between">
                    <span className='flex items-center gap-2'>
                      <Sparkles className="h-5 w-5" />
                      Humanized Text
                    </span>
                    <CopyButton text={rewrittenText} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap font-body">{rewrittenText}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
