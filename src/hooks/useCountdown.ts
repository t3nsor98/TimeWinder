
"use client";

import { useEffect, useState, useMemo } from 'react';

const calculateTimeLeft = (targetTime: number) => {
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isFinished: false };
};

export const useCountdown = (targetDate: Date | string) => {
    const targetTime = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
    
    // Initialize state with a value that is consistent on server and initial client render
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetTime));

    useEffect(() => {
        // Set the initial correct time on the client
        setTimeLeft(calculateTimeLeft(targetTime));

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    return timeLeft;
};
