import { PointsLimit } from '../types/points';

export const defaultLimits: PointsLimit[] = [
    {
        name: 'Yakuman',
        points: 8000,
        check: han => han < 0
    },
    {
        name: 'Sanbaiman',
        points: 6000,
        check: han => han >= 11
    },
    {
        name: 'Baiman',
        points: 4000,
        check: han => han >= 8
    },
    {
        name: 'Haneman',
        points: 3000,
        check: han => han >= 6
    },
    {
        name: 'Mangan',
        points: 2000,
        check: (han, points) => han >= 5 || points >= 2000
    }
];
