
"use client";

import { useEffect, useState, useMemo } from 'react';

export const useCountdown = (targetDate: Date | string) => {
    const targetTime = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

    // Initialize `now` with null on the server
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        // Set the initial time on the client
        setNow(new Date().getTime());

        const interval = setInterval(() => {
            setNow(new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []); // Run only once on the client to set up

    // If `now` is null (i.e., on the server or before first client render), return a default state
    if (now === null) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: false };
    }

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
