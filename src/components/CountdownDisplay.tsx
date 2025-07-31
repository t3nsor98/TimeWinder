"use client";

import { Trophy } from 'lucide-react';

type CountdownSegmentProps = {
  value: number;
  label: string;
};

const CountdownSegment = ({ value, label }: CountdownSegmentProps) => (
  <div className="flex flex-col items-center justify-center p-2 rounded-lg min-w-[70px] sm:min-w-[90px]">
    <span className="text-4xl sm:text-5xl font-bold tabular-nums text-primary tracking-tighter font-digital">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-xs uppercase text-muted-foreground tracking-widest">{label}</span>
  </div>
);

type CountdownDisplayProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
};

export const CountdownDisplay = ({ days, hours, minutes, seconds, isFinished }: CountdownDisplayProps) => {
  if (isFinished) {
    return (
      <div className="text-center p-8 flex flex-col items-center gap-4 bg-card-foreground/5 rounded-lg">
        <Trophy className="w-16 h-16 text-accent" />
        <h3 className="text-2xl font-bold">Goal Achieved!</h3>
        <p className="text-muted-foreground">Congratulations on reaching your target!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-4 p-4 rounded-lg bg-card-foreground/5">
      <CountdownSegment value={days} label="Days" />
      <div className="text-4xl sm:text-5xl font-bold text-primary/50 self-center font-digital">:</div>
      <CountdownSegment value={hours} label="Hours" />
      <div className="text-4xl sm:text-5xl font-bold text-primary/50 self-center font-digital">:</div>
      <CountdownSegment value={minutes} label="Minutes" />
      <div className="text-4xl sm:text-5xl font-bold text-primary/50 self-center font-digital">:</div>
      <CountdownSegment value={seconds} label="Seconds" />
    </div>
  );
};
