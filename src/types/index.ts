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

export type TransactionType = 'CREDIT' | 'DEBIT' | 'credit' | 'debit';
export type TransactionCategory = 'WALLET_RECHARGE' | 'RIDE_PAYMENT' | 'REFUND';
export type PaymentStatus = 'CREATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'success' | 'pending' | 'failed';

export interface WalletTransaction {
  id: string;
  transactionId?: string;
  userId: string;
  type: TransactionType;
  category?: TransactionCategory;
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  description: string;
  timestamp?: string;
  createdAt?: string;
  completedAt?: string;
  paymentMethod?: string;
  paymentProvider?: string;
  status: PaymentStatus;
  referenceId: string;
  paymentId?: string;
  orderId?: string;
}

export interface UserWallet {
  userId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface PaymentMethodItem {
  id: string;
  userId: string;
  type: 'Cash' | 'Card' | 'UPI' | 'Wallet' | 'NetBanking';
  title: string;
  details: string; // e.g. "•••• 4242" or "raj@okaxis"
  isDefault: boolean;
  upiQrData?: string;
  upiId?: string;
  cardBrand?: string;
  cardExpiry?: string;
  cardLast4?: string;
  bankName?: string;
  isVerified?: boolean;
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

export interface FeedbackItem {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  category: string;
  rating: number;
  message: string;
  createdAt: string;
}

export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketStatus = 'OPEN' | 'IN PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface TicketReply {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  description: string;
  priority: TicketPriority;
  attachment?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  replies?: TicketReply[];
}

export type ReportTimeRange = '7d' | '30d' | '3m' | '6m' | '1y' | 'all';

export interface ReportSummaryMetrics {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  pendingRides: number;
  totalDistanceKm: number;
  totalSpent: number;
  totalEarned: number;
  averageFare: number;
  averageRating: number;
  avgDistanceKm: number;
  co2SavedKg: number;
}

