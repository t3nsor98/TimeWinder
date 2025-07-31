"use client";

import React, { useState, useEffect } from 'react';
import { Goal } from '@/lib/types';
import { Header } from '@/components/Header';
import { GoalCard } from '@/components/GoalCard';
import { GoalForm } from '@/components/GoalForm';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wind } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function GoalDashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedGoals = localStorage.getItem('timeWinderGoals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals, (key, value) => 
          key === 'targetDate' && value ? new Date(value) : value
        );
        if (Array.isArray(parsedGoals)) {
            setGoals(parsedGoals);
        }
      } catch (e) {
        console.error("Failed to parse goals from localStorage", e);
        localStorage.removeItem('timeWinderGoals');
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('timeWinderGoals', JSON.stringify(goals));
    }
  }, [goals, isClient]);

  const addGoal = (newGoal: Omit<Goal, 'id'>) => {
    setGoals(prev => [...prev, { ...newGoal, id: new Date().toISOString() }]);
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

    newGoals[index] = newGoals[swapIndex];
    newGoals[swapIndex] = goalToMove;
    setGoals(newGoals);
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-2xl py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Goals</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set a New Goal</DialogTitle>
                <DialogDescription>
                  Define your goal and set a deadline. Let's make it happen!
                </DialogDescription>
              </DialogHeader>
              <GoalForm onAddGoal={addGoal} onFinished={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {goals.map((goal, index) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onDelete={deleteGoal} 
                onMove={moveGoal} 
                isFirst={index === 0} 
                isLast={index === goals.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 border-2 border-dashed rounded-lg mt-8">
            <Wind className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No goals yet!</h3>
            <p className="mt-2 text-muted-foreground">Click 'Add New Goal' to get started on your journey.</p>
          </div>
        )}
      </main>
    </div>
  );
}
