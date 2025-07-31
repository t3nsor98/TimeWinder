"use client";

import { useEffect, useState, useMemo } from 'react';

export const useCountdown = (targetDate: Date | string) => {
    const targetTime = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

    const [now, setNow] = useState(new Date().getTime());

    useEffect(() => {
        if (targetTime <= now) return;

        const interval = setInterval(() => {
            setNow(new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime, now]);

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
