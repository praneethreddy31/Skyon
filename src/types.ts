export enum Language {
  EN = 'en',
  HI = 'hi',
  TE = 'te',
}

export type ListingCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
export type ListingType = 'For Sale' | 'For Rent';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  block?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  flatNumber?: string;
}

export interface UserInfo {
  uid: string;
  name: string;
  block: string;
  flatNumber: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | 'Free';
  type: ListingType;
  category: string;
  condition: ListingCondition;
  imageUrl: string;
  owner: UserInfo;
  whatsappNumber: string;
  phoneNumber: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  description: string;
  rating: number;
  imageUrl: string;
  reviews: Review[];
  owner: UserInfo;
  whatsappNumber: string;
  phoneNumber: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export interface Store {
  id: string;
  name: string;
  category: 'Home Food' | 'Handmade Crafts' | 'Boutique' | 'Groceries';
  owner: UserInfo,
  rating: number;
  coverImageUrl: string;
  products: Product[];
  whatsappNumber: string;
  phoneNumber: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  rsvps: number;
  owner: UserInfo;
}

export interface LostAndFoundItem {
  id: string;
  title: string;
  description: string;
  status: 'Lost' | 'Found';
  location: string;
  date: string;
  imageUrl: string;
  owner: UserInfo;
}

export interface EmergencyContact {
  id: number;
  name: string;
  service: string;
  phone: string;
}

export interface MedicalService {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic';
  address: string;
  phone: string;
  timings: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  availability: string;
  isResident: boolean;
  imageUrl: string;
  phoneNumber: string;
  whatsappNumber: string;
}

export interface CarpoolRide {
  id: string;
  driver: UserInfo;
  from: string;
  to: string;
  date: string;
  time: string;
  seatsAvailable: number;
  whatsappNumber: string;
  phoneNumber: string;
}

export interface TransportRequest {
  id: string;
  requester: UserInfo;
  requestType: 'Need a Ride' | 'Need a Driver';
  description: string;
  date: string;
  whatsappNumber: string;
  phoneNumber: string;
}

export interface ParkingViolation {
  id: string;
  vehicleNumber: string;
  location: string;
  description: string;
  imageUrl: string;
  reportedBy: UserInfo;
  timestamp: string;
}

export interface DailyDish {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  seller: UserInfo;
  postedAt: string;
  createdAt: number;
  whatsappNumber: string;
  phoneNumber: string;
}

export interface DishTemplate {
  id: number;
  name: string;
  price: number;
}

export type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

