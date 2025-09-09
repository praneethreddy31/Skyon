import { Listing, Vendor, Store, EmergencyContact, CommunityEvent, LostAndFoundItem, MedicalService, Doctor, CarpoolRide, TransportRequest, ParkingViolation, DailyDish, DishTemplate, UserInfo } from '../types';

const mockUser1: UserInfo = { name: 'Rohan Sharma', block: 'A', flatNumber: '401' };
const mockUser2: UserInfo = { name: 'Priya Mehta', block: 'B', flatNumber: '1203' };
const mockUser3: UserInfo = { name: 'Amit Singh', block: 'C', flatNumber: '702' };
const mockUser4: UserInfo = { name: 'Sunita Patil', block: 'A', flatNumber: '804' };
const mockUser5: UserInfo = { name: 'Neha G.', block: 'D', flatNumber: '1101' };

export const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Comfortable Study Chair',
    description: 'Barely used study chair with adjustable height. Perfect for work from home setup.',
    price: 1500,
    type: 'For Sale',
    category: 'Furniture',
    condition: 'Used - Like New',
    imageUrl: 'https://picsum.photos/seed/chair/400/300',
    seller: mockUser1,
  },
  {
    id: 2,
    title: 'Collection of Classic Novels',
    description: 'Set of 10 classic English literature novels. Includes works by Dickens, Austen, and more.',
    price: 800,
    type: 'For Sale',
    category: 'Books',
    condition: 'Used - Good',
    imageUrl: 'https://picsum.photos/seed/books/400/300',
    seller: mockUser2,
  },
  {
    id: 3,
    title: 'Microwave Oven',
    description: '20L Microwave oven in good working condition. Selling because we upgraded to a bigger one.',
    price: 2500,
    type: 'For Sale',
    category: 'Appliances',
    condition: 'Used - Good',
    imageUrl: 'https://picsum.photos/seed/oven/400/300',
    seller: mockUser3,
  },
  {
    id: 4,
    title: 'Kids Bicycle',
    description: 'Bicycle for kids aged 5-8. Good condition, with training wheels available.',
    price: 'Free',
    type: 'For Sale',
    category: 'Kids',
    condition: 'Used - Fair',
    imageUrl: 'https://picsum.photos/seed/bicycle/400/300',
    seller: mockUser4,
  },
  {
    id: 5,
    title: 'Party Wear Dress for Rent',
    description: 'Beautiful gown, suitable for weddings or parties. Available for one-day rental.',
    price: 1000,
    type: 'For Rent',
    category: 'Clothes',
    condition: 'Used - Like New',
    imageUrl: 'https://picsum.photos/seed/dress/400/300',
    seller: mockUser5,
  },
];

export const mockVendors: Vendor[] = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    service: 'Electrician',
    description: '15+ years of experience in all types of electrical work. Available 24/7 for emergencies.',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/seed/electrician/100/100',
    reviews: [
      { id: 1, author: 'Mr. Gupta', rating: 5, comment: 'Very professional and quick service.' },
      { id: 2, author: 'Mrs. Khan', rating: 4, comment: 'Fixed the issue, but was a bit late.' },
    ],
  },
  {
    id: 2,
    name: 'Deepa Joshi',
    service: 'Home Tutor (Math & Science)',
    description: 'M.Sc. in Physics. Specializes in teaching CBSE syllabus for classes 6-10.',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/seed/tutor/100/100',
    reviews: [
      { id: 1, author: 'Anjali S.', rating: 5, comment: 'My son\'s grades have improved significantly!' },
    ],
  },
  {
    id: 3,
    name: 'Suresh Cleaning Services',
    service: 'House Help / Cleaning',
    description: 'Team of two for deep cleaning services. We bring our own supplies.',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/seed/cleaning/100/100',
    reviews: [
      { id: 1, author: 'Vikram P.', rating: 5, comment: 'Excellent work. My apartment looks brand new.' },
    ],
  },
    {
    id: 4,
    name: 'Yoga with Aarti',
    service: 'Yoga Trainer',
    description: 'Certified yoga instructor offering group and personal classes for all levels.',
    rating: 5.0,
    imageUrl: 'https://picsum.photos/seed/yoga/100/100',
    reviews: [
      { id: 1, author: 'Pooja R.', rating: 5, comment: 'Aarti is an amazing and patient teacher.' },
    ],
  },
];

const mockStoreOwner1: UserInfo = { name: 'Sunita Sharma', block: 'B', flatNumber: '202' };
const mockStoreOwner2: UserInfo = { name: 'Ritu Verma', block: 'C', flatNumber: '101' };
const mockStoreOwner3: UserInfo = { name: 'Neha Agarwal', block: 'A', flatNumber: '1104' };


export const mockStores: Store[] = [
  {
    id: 1,
    name: "Sunita's Kitchen",
    category: 'Home Food',
    owner: mockStoreOwner1,
    rating: 4.9,
    coverImageUrl: 'https://picsum.photos/seed/kitchen/400/200',
    whatsappNumber: '919876543210',
    phoneNumber: '919876543210',
    products: [
      { id: 101, name: 'Aloo Paratha (2 pcs)', price: 120, imageUrl: 'https://picsum.photos/seed/paratha/200/200' },
      { id: 102, name: 'Rajma Chawal', price: 150, imageUrl: 'https://picsum.photos/seed/rajma/200/200' },
      { id: 103, name: 'Homemade Paneer', price: 200, imageUrl: 'https://picsum.photos/seed/paneer/200/200' },
    ],
  },
  {
    id: 2,
    name: "Creative Crafts by Ritu",
    category: 'Handmade Crafts',
    owner: mockStoreOwner2,
    rating: 4.8,
    coverImageUrl: 'https://picsum.photos/seed/crafts/400/200',
    whatsappNumber: '919123456789',
    phoneNumber: '919123456789',
    products: [
      { id: 201, name: 'Hand-painted Diya Set', price: 250, imageUrl: 'https://picsum.photos/seed/diya/200/200' },
      { id: 202, name: 'Custom Nameplate', price: 800, imageUrl: 'https://picsum.photos/seed/nameplate/200/200' },
    ],
  },
  {
    id: 3,
    name: "Neha's Boutique",
    category: 'Boutique',
    owner: mockStoreOwner3,
    rating: 4.9,
    coverImageUrl: 'https://picsum.photos/seed/boutique/400/200',
    whatsappNumber: '919988776655',
    phoneNumber: '919988776655',
    products: [
      { id: 301, name: 'Cotton Kurti', price: 900, imageUrl: 'https://picsum.photos/seed/kurti/200/200' },
      { id: 302, name: 'Silk Scarf', price: 450, imageUrl: 'https://picsum.photos/seed/scarf/200/200' },
      { id: 303, name: 'Beaded Necklace', price: 300, imageUrl: 'https://picsum.photos/seed/necklace/200/200' },
    ],
  }
];

export const mockEmergencyContacts: EmergencyContact[] = [
  { id: 1, name: 'Society Security', service: 'Main Gate', phone: '022-12345678' },
  { id: 2, name: 'Local Police Station', service: 'Police', phone: '100' },
  { id: 3, name: 'Fire Brigade', service: 'Fire Department', phone: '101' },
  { id: 4, name: 'Ambulance Service', service: 'Medical Emergency', phone: '102' },
];

export const mockEvents: CommunityEvent[] = [
  { id: 1, title: 'Diwali Mela', date: 'Oct 25, 2024', time: '5:00 PM onwards', location: 'Clubhouse Lawns', description: 'Join us for a grand Diwali celebration with food stalls, games, and cultural performances.', imageUrl: 'https://picsum.photos/seed/diwali/400/200', rsvps: 128 },
  { id: 2, title: 'Annual Sports Day', date: 'Nov 12, 2024', time: '9:00 AM - 4:00 PM', location: 'Society Ground', description: 'Cricket, Football, and fun races for all age groups. Register your team at the society office.', imageUrl: 'https://picsum.photos/seed/sports/400/200', rsvps: 75 },
  { id: 3, title: 'Holi Celebration', date: 'Mar 17, 2025', time: '10:00 AM', location: 'Community Park', description: 'Come and play with organic colors. Music and snacks will be provided.', imageUrl: 'https://picsum.photos/seed/holi/400/200', rsvps: 210 },
];

export const mockLostFoundItems: LostAndFoundItem[] = [
  { id: 1, title: 'Found: Smart Watch', status: 'Found', description: 'Black smart watch found near the swimming pool area.', location: 'Swimming Pool', date: '2 days ago', imageUrl: 'https://picsum.photos/seed/watch/200/200', contact: {name: 'Society Office', block: '', flatNumber: ''} },
  { id: 2, title: 'Lost: House Keys', status: 'Lost', description: 'A bunch of keys with a blue keychain. Last seen near A-Wing lift.', location: 'A-Wing', date: 'Yesterday', imageUrl: 'https://picsum.photos/seed/keys/200/200', contact: mockUser1 },
  { id: 3, title: 'Found: Kid\'s School Bag', status: 'Found', description: 'A blue school bag with cartoon characters on it. Found in the children\'s play area.', location: 'Play Area', date: '4 hours ago', imageUrl: 'https://picsum.photos/seed/bag/200/200', contact: {name: 'Society Office', block: '', flatNumber: ''} },
];

export const mockMedicalServices: MedicalService[] = [
    { id: 1, name: 'City Hospital', type: 'Hospital', address: '123 Main Road, Near Market', phone: '022-98765432', timings: '24/7 Emergency' },
    { id: 2, name: 'Wellness Clinic', type: 'Clinic', address: 'Shop 5, Community Center', phone: '022-23456789', timings: '9 AM - 8 PM' },
];

export const mockDoctors: Doctor[] = [
    { id: 1, name: 'Dr. Anita Gupta', specialty: 'General Physician', location: 'Wellness Clinic', availability: 'Mon-Sat, 10 AM - 1 PM', isResident: false },
    { id: 2, name: 'Dr. Rohan Mehra', specialty: 'Pediatrician', location: 'A-Wing, 703', availability: 'By Appointment', isResident: true },
    { id: 3, name: 'Dr. Priya Singh', specialty: 'Dentist', location: 'City Hospital', availability: 'Mon-Fri, 9 AM - 5 PM', isResident: false },
    { id: 4, name: 'Dr. Sameer Khan', specialty: 'Cardiologist', location: 'C-Wing, 1101', availability: 'Emergency Calls Only', isResident: true },
];

const carpoolDriver1: UserInfo = { name: 'Ankit', block: 'C', flatNumber: '505' };
const carpoolDriver2: UserInfo = { name: 'Sunita', block: 'B', flatNumber: '301' };

export const mockCarpoolRides: CarpoolRide[] = [
    { id: 1, driver: carpoolDriver1, from: 'Society Gate', to: 'Cyber City Tech Park', date: 'Daily', time: '8:30 AM', seatsAvailable: 2, contact: 'Contact via App' },
    { id: 2, driver: carpoolDriver2, from: 'Society Gate', to: 'Greenwood High School', date: 'Mon-Fri', time: '7:45 AM', seatsAvailable: 1, contact: 'Contact via App' },
];

export const mockTransportRequests: TransportRequest[] = [
    { id: 1, requester: { name: 'Mr. Verma', block: 'A', flatNumber: '404' }, requestType: 'Need a Ride', description: 'Need a ride to the airport on Saturday.', date: 'This Saturday', contact: 'A-Wing, 404' },
    { id: 2, requester: { name: 'Mrs. Das', block: 'D', flatNumber: '102' }, requestType: 'Need a Driver', description: 'Need a reliable driver for a senior citizen for local errands.', date: 'Ongoing', contact: 'D-Wing, 102' },
];

export const mockParkingViolations: ParkingViolation[] = [
  { id: 1, vehicleNumber: 'MH 01 AB 1234', location: 'Visitor Parking #5', description: 'Parked in visitor slot for over 24 hours.', imageUrl: 'https://picsum.photos/seed/parking1/400/300', reportedBy: { name: 'R. Gupta', block: 'B', flatNumber: '101' }, timestamp: '2 hours ago' },
  { id: 2, vehicleNumber: 'DL 3C CD 5678', location: 'A-Wing, Slot 401', description: 'This is not my car, it is parked in my assigned slot.', imageUrl: 'https://picsum.photos/seed/parking2/400/300', reportedBy: { name: 'S. Mehta', block: 'A', flatNumber: '401' }, timestamp: '1 day ago' },
  { id: 3, vehicleNumber: 'KA 05 EF 9012', location: 'Near Clubhouse entrance', description: 'Blocking the entrance ramp for wheelchairs.', imageUrl: 'https://picsum.photos/seed/parking3/400/300', reportedBy: { name: 'Admin', block: '', flatNumber: '' }, timestamp: '3 days ago' },
];

export const mockDishTemplates: DishTemplate[] = [
  { id: 1, name: 'Chicken Biryani', price: 180 },
  { id: 2, name: 'Paneer Butter Masala', price: 150 },
  { id: 3, name: 'Aloo Gobi', price: 100 },
];

export const mockDailyDishes: DailyDish[] = [
  { id: 1, name: 'Special Chicken Biryani', price: 180, imageUrl: 'https://picsum.photos/seed/biryani/400/300', seller: mockStoreOwner1, postedAt: '10:30 AM' },
  { id: 2, name: 'Idli Sambar', price: 80, imageUrl: 'https://picsum.photos/seed/idli/400/300', seller: { name: 'Madras Cafe Corner', block: 'E', flatNumber: '607'}, postedAt: '9:15 AM' },
  { id: 3, name: 'Fresh Fruit Salad', price: 120, imageUrl: 'https://picsum.photos/seed/salad/400/300', seller: { name: 'Healthy Bites', block: 'F', flatNumber: '102'}, postedAt: '8:00 AM' },
];