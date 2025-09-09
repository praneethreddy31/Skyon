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
  name: string;
  block: string;
  flatNumber: string;
}


export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | 'Free';
  type: ListingType;
  category: string;
  condition: ListingCondition;
  imageUrl: string;
  seller: UserInfo;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface Vendor {
  id: number;
  name: string;
  service: string;
  description: string;
  rating: number;
  imageUrl: string;
  reviews: Review[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Store {
  id: number;
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
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  rsvps: number;
}

export interface LostAndFoundItem {
  id: number;
  title: string;
  description: string;
  status: 'Lost' | 'Found';
  location: string;
  date: string;
  imageUrl: string;
  contact: UserInfo;
}

export interface EmergencyContact {
  id: number;
  name: string;
  service: string;
  phone: string;
}

export interface MedicalService {
  id: number;
  name: string;
  type: 'Hospital' | 'Clinic';
  address: string;
  phone: string;
  timings: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  availability: string;
  isResident: boolean;
}

export interface CarpoolRide {
  id: number;
  driver: UserInfo;
  from: string;
  to: string;
  date: string;
  time: string;
  seatsAvailable: number;
  contact: string;
}

export interface TransportRequest {
    id: number;
    requester: UserInfo;
    requestType: 'Need a Ride' | 'Need a Driver';
    description: string;
    date: string;
    contact: string;
}

export interface ParkingViolation {
  id: number;
  vehicleNumber: string;
  location: string;
  description: string;
  imageUrl: string;
  reportedBy: UserInfo;
  timestamp: string;
}

export interface DailyDish {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  seller: UserInfo;
  postedAt: string;
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