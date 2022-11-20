export function distinct<T>(item: T, index: number, array: T[]) {
    return array.indexOf(item) === index;
}

export function exclude<T>(items: T[], ...excluded: T[]) {
    return items.filter(item => !excluded.includes(item));
}

export function groupBy<T, TKey>(items: readonly T[], delegate: (item: T) => TKey): Map<TKey, readonly T[]> {
    return items.reduce((map, item) => {
        const key = delegate(item);
        const arr = map.has(key) && map.get(key);
        if (arr) {
            arr.push(item);
        } else {
            map.set(key, [item]);
        }
        return map;
    }, new Map<TKey, T[]>());
}
