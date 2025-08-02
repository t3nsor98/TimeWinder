"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal, Trophy, TrendingUp } from "lucide-react";

type StatsProps = {
    totalGoals: number;
    completionStreak: number;
}

export const Stats = ({ totalGoals, completionStreak }: StatsProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Goals Met</CardTitle>
                    <Trophy className="h-5 w-5 text-yellow-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalGoals}</div>
                    <p className="text-xs text-muted-foreground">All completed goals</p>
                </CardContent>
            </Card>
            <Card className="glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Streak</CardTitle>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completionStreak}</div>
                     <p className="text-xs text-muted-foreground">Consecutive days with a completion</p>
                </CardContent>
            </Card>
             <Card className="glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Coming Soon</CardTitle>
                    <Goal className="h-5 w-5 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">...</div>
                     <p className="text-xs text-muted-foreground">More stats on the way!</p>
                </CardContent>
            </Card>
        </div>
    )
}
