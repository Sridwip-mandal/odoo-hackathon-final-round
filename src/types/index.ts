export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  employeeId: string;
  department: string;
  manager: string;
  officeLocation: string;
  role: UserRole;
  avatar?: string;
  platformAccess: 'granted' | 'revoked';
  status: 'active' | 'inactive';
  rating?: number;
  totalTrips?: number;
  walletBalance: number;
}

export interface Vehicle {
  id: string;
  userId: string;
  driverName: string;
  model: string;
  registrationNumber: string;
  seatingCapacity: number;
  vehicleType: 'Sedan' | 'Hatchback' | 'SUV' | 'EV' | 'Compact';
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  status: 'approved' | 'pending' | 'inactive';
  isDefault?: boolean;
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  driverRating: number;
  driverPhone: string;
  vehicleModel: string;
  registrationNumber: string;
  startLocation: string;
  destinationLocation: string;
  startCoords: [number, number];
  destCoords: [number, number];
  departureDate: string;
  departureTime: string;
  availableSeats: number;
  totalSeats: number;
  farePerSeat: number;
  distanceKm: number;
  estimatedMinutes: number;
  isRecurring?: boolean;
  recurringDays?: string[];
  notes?: string;
  amenities?: string[];
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface TripPassenger {
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  passengerAvatar?: string;
  seatsBooked: number;
  pickupLocation: string;
  dropLocation: string;
  farePaid: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'Wallet';
}

export interface Trip {
  id: string;
  rideId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicleModel: string;
  registrationNumber: string;
  startLocation: string;
  destinationLocation: string;
  startCoords: [number, number];
  destCoords: [number, number];
  date: string;
  time: string;
  fare: number;
  seatNumber: string;
  seatsBooked: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending';
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'Wallet';
  passengers?: TripPassenger[];
  currentLocation?: [number, number];
  etaMinutes?: number;
  distanceRemainingKm?: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'Cash' | 'Auto-Refund';
  status: 'success' | 'pending' | 'failed';
  referenceId: string;
}

export interface PaymentMethodItem {
  id: string;
  userId: string;
  type: 'Cash' | 'Card' | 'UPI' | 'Wallet';
  title: string;
  details: string; // e.g. "•••• 4242" or "raj@okaxis"
  isDefault: boolean;
  upiQrData?: string;
}

export interface SavedPlace {
  id: string;
  userId: string;
  label: 'Home' | 'Office' | 'Gym' | 'Custom';
  customName?: string;
  address: string;
  coords: [number, number];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
  type: 'ride' | 'payment' | 'vehicle' | 'security' | 'system';
  link?: string;
}

export interface ChatMessage {
  id: string;
  tripId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isDriver: boolean;
}

export interface CompanySettings {
  companyName: string;
  registeredAddress: string;
  industry: string;
  adminContact: string;
  totalEmployees: number;
  fuelCostPerLiter: number;
  costPerKm: number;
  travelCostOperational: number;
  defaultCarpoolingPolicy: string;
  maxSeatsPerRide: number;
  autoApproveVehicles: boolean;
  corporateSubsidyPercent: number;
}

export interface MonthlyFinancialSummary {
  month: string;
  revenue: number;
  fuelCost: number;
  maintenance: number;
  netProfit: number;
  ridesCount: number;
  co2SavedKg: number;
}

export interface UserFeedback {
  id: string;
  userName: string;
  userEmail: string;
  category: 'Ride Experience' | 'App Usability & Map' | 'Driver / Passenger Rating' | 'Billing & UPI Payment' | 'Feature Request & Suggestion';
  rating: number; // 1 to 5
  route?: string;
  comments: string;
  status: 'Received' | 'Under Review' | 'Resolved';
  createdAt: string;
}
