import { components } from '../api-types';

export type EnvironmentReading = components['schemas']['EnvironmentReading'];

export type LatestReading = { temperature: number; humidity: number; moisture: number, recordedAt: string, zone: { id: number, name: string} };