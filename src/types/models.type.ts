import { PaginationParams } from './reponses.type';

type PrismaModel = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
};

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export type User = PrismaModel & {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type VehicleType = PrismaModel & {
  name: string;
  ratePerMinute: number;
  description?: string;
};

export type Vehicle = PrismaModel & {
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  vehicleTypeId: number;
  vehicleType?: VehicleType;
};

export type Sector = PrismaModel & {
  name: string;
  description?: string;
  parkingSpaces?: ParkingSpace[];
};

export enum ParkingSpaceStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
}

export type ParkingSpace = PrismaModel & {
  number: string;
  sectorId: number;
  status: ParkingSpaceStatus;
  sector?: Sector;
};

export enum ParkingSessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export type ParkingSession = PrismaModel & {
  vehicleId: number;
  parkingSpaceId: number;
  checkInTime: string;
  checkOutTime?: string | null;
  checkInUserId: number;
  checkOutUserId?: number | null;
  totalAmount?: number | null;
  duration?: number | null;
  status: ParkingSessionStatus;
  vehicle?: Vehicle;
  parkingSpace?: ParkingSpace;
  checkInUser?: User;
  checkOutUser?: User;
};

export type CreateParkingSessionRequest = Pick<
  ParkingSession,
  'vehicleId' | 'parkingSpaceId' | 'checkInUserId'
>;

export type CompleteParkingSessionRequest = Pick<
  ParkingSession,
  'checkOutUserId'
>;

export type ParkingSessionFilters = PaginationParams & {
  checkInTime?: string | null | Date;
  checkOutTime?: string | null | Date;
  vehicleLicensePlate?: string | null;
  status?: ParkingSessionStatus | null;
};
