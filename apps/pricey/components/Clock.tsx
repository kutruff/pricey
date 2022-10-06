import { Paper, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

export interface CountdownClockProps {
    deadline: Date
}

const CountdownClock: FC<CountdownClockProps> = ({ deadline }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const getTimeUntil = (deadline: Date) => {
        const time = deadline.getTime() - Date.now();
        setSeconds(Math.floor((time / 1000) % 60));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setHours(Math.floor((time / (1000 * 60 * 60))));
    };

    useEffect(() => {
        getTimeUntil(deadline);
    });

    useEffect(() => {
        setInterval(() => getTimeUntil(deadline), 1000);
    }, [deadline]);

    const leading0 = (num: number) => {
        return num < 10 ? '0' + num : num;
    };

    return (
        <Paper elevation={2}>
            <Typography>{`${leading0(hours)}:${leading0(minutes)}:${leading0(seconds)}}`}</Typography>
        </Paper>
    );
};

export default CountdownClock;