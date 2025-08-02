
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Goal } from '@/lib/types';
import { Header } from '@/components/Header';
import { GoalCard } from '@/components/GoalCard';
import { GoalForm } from '@/components/GoalForm';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wind, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Celebration } from '../Celebration';
import { Stats } from '../Stats';

type GoalSections = {
  upcoming: Goal[];
  overdue: Goal[];
  completed: Goal[];
}

export function GoalDashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionStreak, setCompletionStreak] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const savedGoals = localStorage.getItem('timeWinderGoals');
    if (savedGoals) {
      try {
        const parsedGoals: Goal[] = JSON.parse(savedGoals, (key, value) => 
          key === 'targetDate' || key === 'completedAt' ? new Date(value) : value
        );
        if (Array.isArray(parsedGoals)) {
            setGoals(parsedGoals);
        }
      } catch (e) {
        console.error("Failed to parse goals from localStorage", e);
        localStorage.removeItem('timeWinderGoals');
      }
    }
    
    const savedStreak = localStorage.getItem('timeWinderStreak');
    if(savedStreak){
      setCompletionStreak(JSON.parse(savedStreak));
    }

  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('timeWinderGoals', JSON.stringify(goals));
      localStorage.setItem('timeWinderStreak', JSON.stringify(completionStreak));
    }
  }, [goals, completionStreak, isClient]);

  const addGoal = (newGoal: Omit<Goal, 'id' | 'isCompleted'>) => {
    setGoals(prev => [...prev, { ...newGoal, id: new Date().toISOString(), isCompleted: false, completedAt: null }]);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };
  
  const moveGoal = (id: string, direction: 'up' | 'down') => {
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) return;
    
    const newGoals = [...goals];
    const goalToMove = newGoals[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newGoals.length) return;

    [newGoals[index], newGoals[swapIndex]] = [newGoals[swapIndex], newGoals[index]];
    setGoals(newGoals);
  };

  const handleToggleComplete = (id: string) => {
    let justCompleted = false;
    setGoals(prev => prev.map(g => {
        if (g.id === id) {
            const isNowCompleted = !g.isCompleted;
            if (isNowCompleted) {
                justCompleted = true;
            }
            return { ...g, isCompleted: isNowCompleted, completedAt: isNowCompleted ? new Date() : null };
        }
        return g;
    }));

    if (justCompleted) {
        setShowCelebration(true);
        // This is a simple streak logic. For a real app, this should be more robust.
        setCompletionStreak(prev => prev + 1);
        setTimeout(() => setShowCelebration(false), 3000); // Hide celebration after 3 seconds
    } else {
       // If a goal is marked as incomplete, you might want to decrease the streak.
       // For this example, we'll keep it simple and only increment.
    }
  };

  const { upcoming, overdue, completed } = useMemo((): GoalSections => {
    const now = new Date();
    return goals.reduce<GoalSections>((acc, goal) => {
        if (goal.isCompleted) {
            acc.completed.push(goal);
        } else if (new Date(goal.targetDate) < now) {
            acc.overdue.push(goal);
        } else {
            acc.upcoming.push(goal);
        }
        return acc;
    }, { upcoming: [], overdue: [], completed: [] });
  }, [goals]);

  
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
         <main className="container max-w-screen-2xl py-8 px-4 sm:px-6 lg:px-8">
             <div className="text-center py-20 px-4 border-2 border-dashed rounded-lg mt-8 glassmorphism">
                <Wind className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">Loading your goals...</h3>
                <p className="mt-2 text-muted-foreground">Please wait a moment.</p>
              </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background bg-grid-white/[0.05] relative">
       {showCelebration && <Celebration />}
       <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <Header />
      <main className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-center sm:text-left text-white font-headline">
            Dashboard
          </h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-12 text-base">
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg glassmorphism">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline">Set a New Goal</DialogTitle>
                <DialogDescription>
                  Define your goal and set a deadline. Let's make it happen!
                </DialogDescription>
              </DialogHeader>
              <GoalForm onAddGoal={addGoal} onFinished={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <Stats totalGoals={completed.length} completionStreak={completionStreak} />
        
        {goals.length === 0 ? (
          <div className="text-center py-20 px-4 border-2 border-dashed rounded-lg mt-8 glassmorphism">
            <Wind className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No goals yet!</h3>
            <p className="mt-2 text-muted-foreground">Click 'Add New Goal' to get started on your journey.</p>
          </div>
        ) : (
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3"><Clock className="text-primary"/>Upcoming</h2>
                    {upcoming.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                            {upcoming.map((goal, index) => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                onDelete={deleteGoal} 
                                onToggleComplete={handleToggleComplete}
                                onMove={moveGoal} 
                                isFirst={index === 0} 
                                isLast={index === upcoming.length - 1}
                            />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No upcoming goals. Great job staying on top of things!</p>
                    )}
                </section>

                 <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3"><AlertTriangle className="text-destructive"/>Overdue</h2>
                    {overdue.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                            {overdue.map((goal, index) => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                onDelete={deleteGoal} 
                                onToggleComplete={handleToggleComplete}
                                onMove={moveGoal} 
                                isFirst={index === 0} 
                                isLast={index === overdue.length - 1}
                            />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">Nothing is overdue. Keep up the great work!</p>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3"><CheckCircle className="text-green-500"/>Completed</h2>
                    {completed.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                            {completed.map((goal, index) => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                onDelete={deleteGoal}
                                onToggleComplete={handleToggleComplete} 
                                onMove={moveGoal} 
                                isFirst={index === 0} 
                                isLast={index === completed.length - 1}
                            />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No goals completed yet. Let's get to work!</p>
                    )}
                </section>
            </div>
        )}
      </main>
    </div>
  );
}
