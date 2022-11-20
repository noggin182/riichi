export function *randomNumberGenerator(seed?: number): Iterator<number> {
    let w = seed ?? new Date().getTime();
    let x = 987654321;
    const mask = 0xffffffff;
    while (true) {
        x = (36969 * (x & 65535) + (x >> 16)) & mask;
        w = (18000 * (w & 65535) + (w >> 16)) & mask;
        yield ((x << 16) + w) & mask;
    }
}

export function *sequentialNumberGenerator(seed = 0): Iterator<number> {
    while (true) {
        yield seed++;
    }
}
