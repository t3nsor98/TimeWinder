"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, ArrowUp, ArrowDown, CheckCircle, Circle } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { Goal } from '@/lib/types';
import { CountdownDisplay } from './CountdownDisplay';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type GoalCardProps = {
  goal: Goal;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
};

const priorityMap = {
  Low: { label: "Low", color: "bg-green-500" },
  Medium: { label: "Medium", color: "bg-yellow-500" },
  High: { label: "High", color: "bg-red-500" },
};

export const GoalCard = ({ goal, onDelete, onToggleComplete, onMove, isFirst, isLast }: GoalCardProps) => {
  const { days, hours, minutes, seconds, isFinished } = useCountdown(goal.targetDate);
  
  const totalSecondsRemaining = (new Date(goal.targetDate).getTime() - new Date().getTime()) / 1000;
  const isUrgent = totalSecondsRemaining < 60 * 60 * 3; // 3 hours
  const isApproaching = totalSecondsRemaining < 60 * 60 * 24; // 24 hours

  const cardBorderColor = goal.isCompleted
    ? 'border-green-500/50'
    : isFinished
    ? 'border-gray-500/50'
    : isUrgent
    ? 'border-red-500/50'
    : isApproaching
    ? 'border-yellow-500/50'
    : 'border-border';

  const priorityInfo = priorityMap[goal.priority];
  const isOverdue = !goal.isCompleted && isFinished;

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden transition-all hover:shadow-primary/20 hover:-translate-y-1 glassmorphism border-2", cardBorderColor)}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex-1 pr-4">
          <CardTitle className="text-xl font-bold font-headline">{goal.title}</CardTitle>
          <CardDescription className="text-sm">{new Date(goal.targetDate).toLocaleString()}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                    <MoreVertical className="h-5 w-5" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glassmorphism">
                <DropdownMenuItem onClick={() => onMove(goal.id, 'up')} disabled={isFirst}>
                    <ArrowUp className="mr-2 h-4 w-4" /> Move Up
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(goal.id, 'down')} disabled={isLast}>
                    <ArrowDown className="mr-2 h-4 w-4" /> Move Down
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-2 sm:p-6">
        {goal.isCompleted ? (
            <div className="text-center p-8 flex flex-col items-center gap-4 text-green-400">
                <CheckCircle className="w-16 h-16" />
                <h3 className="text-2xl font-bold">Completed!</h3>
            </div>
        ) : (
            <CountdownDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} isFinished={isFinished} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-black/20 p-4">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-full", priorityInfo.color)}></span>
          <span className="text-sm font-medium">{priorityInfo.label} Priority</span>
        </div>
        {isOverdue ? (
             <Badge variant="destructive">Overdue</Badge>
        ) : (
            <Button size="sm" variant="ghost" onClick={() => onToggleComplete(goal.id)} className="flex items-center gap-2">
            {goal.isCompleted ? <CheckCircle className="text-green-500" /> : <Circle />}
            <span>{goal.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}</span>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
};
