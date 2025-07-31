"use client";

import React, { useState } from 'react';
import { generateMotivationalMessage } from '@/ai/flows/generate-motivational-message';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, MoreVertical, Sparkles, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { Goal } from '@/lib/types';
import { CountdownDisplay } from './CountdownDisplay';

type GoalCardProps = {
  goal: Goal;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
};

export const GoalCard = ({ goal, onDelete, onMove, isFirst, isLast }: GoalCardProps) => {
  const { days, hours, minutes, seconds, isFinished } = useCountdown(goal.targetDate);
  const [motivation, setMotivation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMotivationDialogOpen, setIsMotivationDialogOpen] = useState(false);

  const handleGetMotivation = async () => {
    setIsMotivationDialogOpen(true);
    if (motivation) return;
    setIsLoading(true);
    try {
      const result = await generateMotivationalMessage({ goalDescription: goal.title });
      setMotivation(result.motivationalMessage);
    } catch (error) {
      console.error('Failed to get motivation:', error);
      setMotivation('Sorry, I couldn\'t come up with anything right now. You got this, though!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-all hover:shadow-primary/20 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="text-xl font-bold">{goal.title}</CardTitle>
            <CardDescription>{new Date(goal.targetDate).toLocaleString()}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onMove(goal.id, 'up')} disabled={isFirst}>
                <ArrowUp className="mr-2 h-4 w-4" /> Move Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(goal.id, 'down')} disabled={isLast}>
                <ArrowDown className="mr-2 h-4 w-4" /> Move Down
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <CountdownDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} isFinished={isFinished} />
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleGetMotivation}>
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            Get a Motivation Boost
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={isMotivationDialogOpen} onOpenChange={setIsMotivationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Motivation Boost!</DialogTitle>
            <DialogDescription>For your goal: "{goal.title}"</DialogDescription>
          </DialogHeader>
          <div className="py-4 min-h-[100px] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <p className="text-lg italic text-center">"{motivation}"</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
