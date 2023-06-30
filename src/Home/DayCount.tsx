import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

export default function DayCount() {
    const startDate = new Date('2023-07-03T00:00:00Z');
    const currentTime = new Date();
    
    const timeDiff = currentTime.getTime() - startDate.getTime();
    const initialDayCount = (Math.floor(timeDiff / (24 * 60 * 60 * 1000)))+1;

    const [dayCount, setDayCount] = useState(initialDayCount);

    useEffect(() => {
        const interval = setInterval(() => {
            setDayCount((prevCount) => prevCount + 1);
        }, 24 * 60 * 60 * 1000); // Update count every 24 hours

        return () => {
            clearInterval(interval); // Clean up the interval when the component unmounts
        };
    }, []);

    return <Typography variant='h4' sx={{ marginLeft: "auto" }}>Day {dayCount}</Typography>;
}

