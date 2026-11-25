import { parseBridges } from './validate';

// Glob so the build does not fail while data/bridges.json does not exist yet.
const files = import.meta.glob<unknown>('../../data/bridges*.json', { eager: true, import: 'default' });

const realKey = Object.keys(files).find((k) => k.endsWith('/bridges.json'));
const sampleKey = Object.keys(files).find((k) => k.endsWith('/bridges.sample.json'));

export const isSampleData = !realKey;
if (isSampleData) console.info('[bridges] data/bridges.json not found — using data/bridges.sample.json');

export const bridges = parseBridges(files[realKey ?? sampleKey ?? ''] ?? []);
