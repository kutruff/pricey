import { Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { TimeOffset } from '../app';

export interface CountdownClockProps {
    deadline: Date
}

const CountdownClock: FC<CountdownClockProps> = ({ deadline }) => {
    const [timeLeft, setTimeLeft] = useState<TimeOffset>({ hours: 0, minutes: 0, seconds: 0 });

    const refreshTimeLeft = (deadline: Date) => {
        const time = Math.max(deadline.getTime() - Date.now(), 0);

        const newTimeLeft = {
            seconds: Math.floor((time / 1000) % 60),
            minutes: Math.floor((time / 1000 / 60) % 60),
            hours: Math.floor((time / (1000 * 60 * 60))),
        };
        setTimeLeft(newTimeLeft);
    };

    useEffect(() => {
        refreshTimeLeft(deadline);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const timerHandle = setInterval(() => refreshTimeLeft(deadline), 1000);
        return () => clearInterval(timerHandle);
    }, [deadline]);

    const addLeadingZeros = (value: number) => {
        return value < 10 ? '0' + value : value;
    };

    return (
        <Typography variant='h4' >{`${addLeadingZeros(timeLeft.hours || 0)}:${addLeadingZeros(timeLeft.minutes || 0)}:${addLeadingZeros(timeLeft.seconds || 0)}`}</Typography>
    );
};

export default CountdownClock;