import { ListQueryParams } from './reponses.type';

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

export type VehicleBrand = PrismaModel & {
  name: string;
  deleted: boolean;
  vehicleModels?: VehicleModel[];
};

export type VehicleModel = PrismaModel & {
  name: string;
  vehicleTypeId: number;
  vehicleBrandId: number;
  vehicleType?: VehicleType;
  vehicleBrand?: VehicleBrand;
  deleted: boolean;
};

export type Vehicle = PrismaModel & {
  licensePlate: string;
  color: string;
  vehicleModelId: number;
  vehicleModel?: VehicleModel;
  deleted: boolean;
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

export type ParkingSessionFilters = ListQueryParams & {
  checkInTime?: string | null | Date;
  checkOutTime?: string | null | Date;
  vehicleLicensePlate?: string | null;
  status?: ParkingSessionStatus | null;
};

export type CreateVehicleRequest = Pick<
  Vehicle,
  'licensePlate' | 'vehicleModelId' | 'color'
>;

export type UpdateVehicleRequest = Partial<CreateVehicleRequest>;
