import { DeviceData } from './device.interface';

export interface SessionData {
    userId: string;
    roles: string[];
    createdAt: number;
    expiresAt: number;
    deviceInfo: DeviceData;
}