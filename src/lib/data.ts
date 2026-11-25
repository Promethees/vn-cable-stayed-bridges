import type { Bridge } from '../types';
import { parseBridges } from './validate';

// Lazy glob: separate chunk (real loading state) and no build failure while data/bridges.json is absent.
const loaders = import.meta.glob<unknown>('../../data/bridges*.json', { import: 'default' });
const realKey = Object.keys(loaders).find((k) => k.endsWith('/bridges.json'));
const sampleKey = Object.keys(loaders).find((k) => k.endsWith('/bridges.sample.json'));

export const isSampleData = !realKey;

export async function loadBridges(): Promise<Bridge[]> {
  const key = realKey ?? sampleKey;
  if (!key) throw new Error('No bridge data file found');
  if (isSampleData) console.info('[bridges] data/bridges.json not found — using data/bridges.sample.json');
  return parseBridges(await loaders[key]());
}
