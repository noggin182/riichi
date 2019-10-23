import { PointsLimit } from '../types/points';

export const defaultLimits: PointsLimit[] = [
    {
        name: 'Yakuman',
        points: 8000,
        check: fan => fan < 0
    },
    {
        name: 'Sanbaiman',
        points: 6000,
        check: fan => fan >= 11
    },
    {
        name: 'Baiman',
        points: 4000,
        check: fan => fan >= 8
    },
    {
        name: 'Haneman',
        points: 3000,
        check: fan => fan >= 6
    },
    {
        name: 'Mangan',
        points: 2000,
        check: (fan, points) => fan >= 5 || points >= 2000
    }
];
