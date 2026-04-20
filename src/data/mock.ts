export type Role = 'rider' | 'driver' | 'admin';

export interface WaitPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface Route {
  id: number;
  name: string;
  points: { waitPointId: number; sequence: number; segmentFare: number }[];
}

export interface Vehicle {
  id: number;
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vehicleType: 'sedan' | 'suv' | 'minivan' | 'bus';
  seatCapacity: number;
  status: 'pending' | 'approved' | 'rejected' | 'retired';
  driverId?: number;
}

export interface DriverProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  licenseNumber?: string;
  licenseExpiry?: string;
  rating: number;
  totalRides: number;
  vehicleId?: number;
}

export interface Rider {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalTrips: number;
}

export interface Ride {
  id: number;
  driverName: string;
  vehiclePlate: string;
  vehicleModel: string;
  routeName: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  currentWaitPoint: string;
  startedAt: string;
  completedAt?: string;
  seatsAvailable: number;
  totalSeats: number;
}

export interface Booking {
  id: number;
  rideId: number;
  routeName: string;
  driverName: string;
  vehiclePlate: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  bookedAt: string;
  departureTime: string;
}

export interface WalletTxn {
  id: number;
  type: 'deposit' | 'booking_payment' | 'booking_refund' | 'admin_credit' | 'admin_debit';
  amount: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
}

export interface Trip {
  id: number;
  routeName: string;
  scheduledDeparture: string;
  assignedDriver?: string;
  status: 'scheduled' | 'started' | 'completed' | 'cancelled';
  notes?: string;
}

// ---------- Fixtures ----------

export const waitPoints: WaitPoint[] = [
  { id: 1, name: 'Lekki Phase 1 Gate', lat: 6.445, lng: 3.464 },
  { id: 2, name: 'Ikoyi Link Bridge', lat: 6.452, lng: 3.429 },
  { id: 3, name: 'Falomo Roundabout', lat: 6.448, lng: 3.416 },
  { id: 4, name: 'TBS (Tafawa Balewa Sq.)', lat: 6.451, lng: 3.396 },
  { id: 5, name: 'CMS Bus Terminal', lat: 6.450, lng: 3.393 },
  { id: 6, name: 'Victoria Island Circle', lat: 6.428, lng: 3.423 },
  { id: 7, name: 'Ajah Junction', lat: 6.466, lng: 3.560 },
  { id: 8, name: 'Ikeja Under Bridge', lat: 6.600, lng: 3.349 },
];

export const routes: Route[] = [
  {
    id: 1,
    name: 'Lekki → CMS',
    points: [
      { waitPointId: 1, sequence: 0, segmentFare: 500 },
      { waitPointId: 2, sequence: 1, segmentFare: 400 },
      { waitPointId: 3, sequence: 2, segmentFare: 300 },
      { waitPointId: 4, sequence: 3, segmentFare: 200 },
      { waitPointId: 5, sequence: 4, segmentFare: 0 },
    ],
  },
  {
    id: 2,
    name: 'Ajah → VI Circle',
    points: [
      { waitPointId: 7, sequence: 0, segmentFare: 700 },
      { waitPointId: 1, sequence: 1, segmentFare: 600 },
      { waitPointId: 6, sequence: 2, segmentFare: 0 },
    ],
  },
  {
    id: 3,
    name: 'Ikeja → Lekki',
    points: [
      { waitPointId: 8, sequence: 0, segmentFare: 900 },
      { waitPointId: 4, sequence: 1, segmentFare: 500 },
      { waitPointId: 1, sequence: 2, segmentFare: 0 },
    ],
  },
];

export const rides: Ride[] = [
  {
    id: 101,
    driverName: 'Seyi Adebayo',
    vehiclePlate: 'LAG-427-KJA',
    vehicleModel: 'Toyota Sienna 2019',
    routeName: 'Lekki → CMS',
    status: 'in_progress',
    currentWaitPoint: 'Ikoyi Link Bridge',
    startedAt: '08:12',
    seatsAvailable: 3,
    totalSeats: 7,
  },
  {
    id: 102,
    driverName: 'Musa Bello',
    vehiclePlate: 'LAG-118-ABJ',
    vehicleModel: 'Toyota Camry 2021',
    routeName: 'Ajah → VI Circle',
    status: 'in_progress',
    currentWaitPoint: 'Ajah Junction',
    startedAt: '08:25',
    seatsAvailable: 2,
    totalSeats: 4,
  },
  {
    id: 103,
    driverName: 'Chioma Nwosu',
    vehiclePlate: 'LAG-903-IKJ',
    vehicleModel: 'Hiace Bus 2020',
    routeName: 'Ikeja → Lekki',
    status: 'in_progress',
    currentWaitPoint: 'Ikeja Under Bridge',
    startedAt: '07:55',
    seatsAvailable: 8,
    totalSeats: 14,
  },
];

export const riderBookings: Booking[] = [
  {
    id: 501,
    rideId: 101,
    routeName: 'Lekki → CMS',
    driverName: 'Seyi Adebayo',
    vehiclePlate: 'LAG-427-KJA',
    pickup: 'Lekki Phase 1 Gate',
    dropoff: 'TBS',
    fare: 1200,
    status: 'upcoming',
    bookedAt: '2026-04-17 08:02',
    departureTime: 'Today · 08:30',
  },
  {
    id: 499,
    rideId: 98,
    routeName: 'Ajah → VI Circle',
    driverName: 'Musa Bello',
    vehiclePlate: 'LAG-118-ABJ',
    pickup: 'Ajah Junction',
    dropoff: 'VI Circle',
    fare: 1300,
    status: 'completed',
    bookedAt: '2026-04-15 17:21',
    departureTime: 'Apr 15 · 17:40',
  },
  {
    id: 488,
    rideId: 91,
    routeName: 'Ikeja → Lekki',
    driverName: 'Chioma Nwosu',
    vehiclePlate: 'LAG-903-IKJ',
    pickup: 'Ikeja Under Bridge',
    dropoff: 'Lekki Phase 1 Gate',
    fare: 1400,
    status: 'completed',
    bookedAt: '2026-04-10 09:03',
    departureTime: 'Apr 10 · 09:15',
  },
];

export const walletTxns: WalletTxn[] = [
  { id: 1, type: 'deposit', amount: 5000, balanceAfter: 8200, reason: 'Wallet top-up · Paystack', createdAt: 'Apr 17 · 08:00' },
  { id: 2, type: 'booking_payment', amount: -1200, balanceAfter: 3200, reason: 'Booking #501 · Lekki → TBS', createdAt: 'Apr 17 · 08:02' },
  { id: 3, type: 'booking_refund', amount: 1300, balanceAfter: 4400, reason: 'Refund · Booking #499', createdAt: 'Apr 16 · 11:25' },
  { id: 4, type: 'booking_payment', amount: -1300, balanceAfter: 3100, reason: 'Booking #499 · Ajah → VI', createdAt: 'Apr 15 · 17:21' },
  { id: 5, type: 'deposit', amount: 2000, balanceAfter: 4400, reason: 'Wallet top-up · card', createdAt: 'Apr 14 · 18:02' },
];

export const pendingDrivers: DriverProfile[] = [
  {
    id: 21,
    name: 'Tunde Okafor',
    email: 'tunde.okafor@mail.com',
    phone: '+234 803 220 1144',
    status: 'pending',
    licenseNumber: 'LAG-D-998112',
    licenseExpiry: '2028-05-20',
    rating: 0,
    totalRides: 0,
  },
  {
    id: 22,
    name: 'Blessing Eze',
    email: 'blessing.e@mail.com',
    phone: '+234 802 990 0012',
    status: 'pending',
    licenseNumber: 'LAG-D-224401',
    licenseExpiry: '2027-09-03',
    rating: 0,
    totalRides: 0,
  },
];

export const approvedDrivers: DriverProfile[] = [
  {
    id: 7,
    name: 'Seyi Adebayo',
    email: 'seyi.a@streetlift.app',
    phone: '+234 813 001 9922',
    status: 'approved',
    licenseNumber: 'LAG-D-111220',
    licenseExpiry: '2029-02-12',
    rating: 4.9,
    totalRides: 218,
    vehicleId: 1,
  },
  {
    id: 9,
    name: 'Musa Bello',
    email: 'musa.b@streetlift.app',
    phone: '+234 905 220 8801',
    status: 'approved',
    licenseNumber: 'LAG-D-331221',
    licenseExpiry: '2028-11-30',
    rating: 4.8,
    totalRides: 164,
    vehicleId: 2,
  },
  {
    id: 11,
    name: 'Chioma Nwosu',
    email: 'chioma.n@streetlift.app',
    phone: '+234 704 881 0032',
    status: 'approved',
    licenseNumber: 'LAG-D-551777',
    licenseExpiry: '2030-01-08',
    rating: 4.95,
    totalRides: 302,
    vehicleId: 3,
  },
];

export const vehicles: Vehicle[] = [
  {
    id: 1,
    plate: 'LAG-427-KJA',
    make: 'Toyota',
    model: 'Sienna',
    year: 2019,
    color: 'Silver',
    vehicleType: 'minivan',
    seatCapacity: 7,
    status: 'approved',
    driverId: 7,
  },
  {
    id: 2,
    plate: 'LAG-118-ABJ',
    make: 'Toyota',
    model: 'Camry',
    year: 2021,
    color: 'Black',
    vehicleType: 'sedan',
    seatCapacity: 4,
    status: 'approved',
    driverId: 9,
  },
  {
    id: 3,
    plate: 'LAG-903-IKJ',
    make: 'Toyota',
    model: 'Hiace',
    year: 2020,
    color: 'White',
    vehicleType: 'bus',
    seatCapacity: 14,
    status: 'approved',
    driverId: 11,
  },
  {
    id: 4,
    plate: 'LAG-774-LAG',
    make: 'Honda',
    model: 'Pilot',
    year: 2018,
    color: 'Grey',
    vehicleType: 'suv',
    seatCapacity: 6,
    status: 'pending',
  },
  {
    id: 5,
    plate: 'LAG-001-NEW',
    make: 'Hyundai',
    model: 'Staria',
    year: 2023,
    color: 'White',
    vehicleType: 'minivan',
    seatCapacity: 9,
    status: 'pending',
  },
];

export const trips: Trip[] = [
  {
    id: 801,
    routeName: 'Lekki → CMS',
    scheduledDeparture: 'Today · 17:30',
    assignedDriver: 'Seyi Adebayo',
    status: 'scheduled',
    notes: 'Evening commute rush',
  },
  {
    id: 802,
    routeName: 'Ajah → VI Circle',
    scheduledDeparture: 'Today · 18:00',
    status: 'scheduled',
  },
  {
    id: 803,
    routeName: 'Ikeja → Lekki',
    scheduledDeparture: 'Tomorrow · 06:45',
    assignedDriver: 'Chioma Nwosu',
    status: 'scheduled',
  },
  {
    id: 804,
    routeName: 'Lekki → CMS',
    scheduledDeparture: 'Apr 16 · 08:00',
    assignedDriver: 'Seyi Adebayo',
    status: 'completed',
  },
];

export const riders: Rider[] = [
  { id: 1001, name: 'Amara Okoye', email: 'amara@mail.com', phone: '+234 810 222 9900', totalTrips: 42 },
  { id: 1002, name: 'Kunle Bamgbose', email: 'kunle@mail.com', phone: '+234 805 118 4422', totalTrips: 18 },
  { id: 1003, name: 'Zainab Yusuf', email: 'zainab@mail.com', phone: '+234 803 331 7788', totalTrips: 73 },
  { id: 1004, name: 'David Obi', email: 'david@mail.com', phone: '+234 907 220 1199', totalTrips: 5 },
];
