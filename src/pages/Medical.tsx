import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Button from '../components/Button';
import AddHospitalModal from '../components/AddHospitalModal';
import AddDoctorModal from '../components/AddDoctorModal';
import EditHospitalModal from '../components/EditHospitalModal';
import EditDoctorModal from '../components/EditDoctorModal';
import { getCollection, deleteDocument } from '../services/databaseService';
import { EmergencyContact, MedicalService, Doctor } from '../types';

// Hardcoded emergency contacts that don't need to be in the database
const staticEmergencyContacts: EmergencyContact[] = [
  { id: 1, name: 'Local Police', service: 'Police', phone: '100' },
  { id: 2, name: 'Fire & Rescue', service: 'Fire Department', phone: '101' },
  { id: 3, name: 'Ambulance', service: 'Medical Emergency', phone: '102' },
  { id: 4, name: 'Society Security', service: 'Main Gate', phone: '04012345678' },
];

const Medical: React.FC = () => {
    const { t } = useLocalization();
    const { currentUser } = useAuth();

    const [services, setServices] = useState<MedicalService[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // State for Add modals
    const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

    // State for Edit modals
    const [editingService, setEditingService] = useState<MedicalService | null>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

    const ADMIN_EMAIL = 'praneethreddykarrem123@gmail.com';

    const fetchData = async () => {
        try {
            const [servicesData, doctorsData] = await Promise.all([
                getCollection<MedicalService>('medicalServices'),
                getCollection<Doctor>('doctors')
            ]);
            setServices(servicesData);
            setDoctors(doctorsData);
        } catch (error) {
            console.error("Error fetching medical data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        
        if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [currentUser]);

    const handleDelete = async (collection: string, id: string) => {
        if (!isAdmin) return;
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteDocument(collection, id);
                fetchData(); // Refresh data after deletion
            } catch (error) {
                alert("Failed to delete item.");
            }
        }
    };

    if (loading) {
        return <p className="text-center py-10">Loading medical hub...</p>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800 text-center">{t('medical_title')}</h1>
            
            <div className="mb-8">
                <h2 className="text-xl font-bold text-red-600 mb-3">{t('emergency_contacts')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {staticEmergencyContacts.map((contact) => (
                        <Card key={contact.id} className="border-l-4 border-red-500">
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800">{contact.name}</h3>
                                <p className="text-sm text-gray-500">{contact.service}</p>
                                <a href={`tel:${contact.phone}`} className="mt-2 inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-800">
                                    <Icon name="phone" className="w-4 h-4" />
                                    {contact.phone}
                                </a>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{t('medical_hospitals_clinics')}</h2>
                    {isAdmin && <Button onClick={() => setIsHospitalModalOpen(true)}>Add New</Button>}
                </div>
                <div className="space-y-4">
                    {services.map((service) => (
                        <Card key={service.id} className="border-l-4 border-blue-500 flex justify-between items-center p-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{service.name} <span className="text-sm font-normal text-white bg-blue-500 px-2 py-0.5 rounded-full ml-2">{service.type}</span></h3>
                                <p className="text-sm text-gray-600 mt-1">{service.address}</p>
                                <p className="text-sm text-gray-500">{service.timings}</p>
                                <a href={`tel:${service.phone}`} className="mt-2 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800">
                                    <Icon name="phone" className="w-4 h-4" />
                                    {service.phone}
                                </a>
                            </div>
                            {isAdmin && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setEditingService(service)} className="p-2 text-sm text-blue-600 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete('medicalServices', service.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                        <Icon name="close" className="w-4 h-4"/>
                                    </button>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{t('medical_find_doctor')}</h2>
                    {isAdmin && <Button onClick={() => setIsDoctorModalOpen(true)}>Add New</Button>}
                </div>
                 <div className="space-y-3">
                    {doctors.map((doctor) => (
                        <Card key={doctor.id} className="p-4 flex flex-col sm:flex-row gap-4">
                            <img src={doctor.imageUrl} alt={doctor.name} className="w-24 h-24 rounded-full object-cover self-center"/>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{doctor.name} {doctor.isResident && <span className="text-xs font-semibold text-white bg-green-500 px-2 py-0.5 rounded-full ml-2">Resident</span>}</h3>
                                        <p className="text-sm text-[#3b5978]">{doctor.specialty}</p>
                                    </div>
                                    {isAdmin && (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setEditingDoctor(doctor)} className="p-2 text-sm text-blue-600 hover:underline">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete('doctors', doctor.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                                <Icon name="close" className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    <span>Clinic/Flat No: {doctor.location}</span> | <span>Timings: {doctor.availability}</span>
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <a href={`https://wa.me/${doctor.whatsappNumber}`} className="flex-1">
                                        <Button size="sm" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                                            <Icon name="whatsapp" className="w-4 h-4 mr-2" /> WhatsApp
                                        </Button>
                                    </a>
                                    <a href={`tel:${doctor.phoneNumber}`} className="flex-1">
                                        <Button size="sm" variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                                            <Icon name="phone" className="w-4 h-4 mr-2" /> Call
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </Card>
                    ))}
                 </div>
            </div>
            
            {isAdmin && (
                <>
                    <AddHospitalModal isOpen={isHospitalModalOpen} onClose={() => setIsHospitalModalOpen(false)} onSuccess={fetchData} />
                    <AddDoctorModal isOpen={isDoctorModalOpen} onClose={() => setIsDoctorModalOpen(false)} onSuccess={fetchData} />
                    
                    {editingService && (
                        <EditHospitalModal 
                            isOpen={!!editingService} 
                            onClose={() => setEditingService(null)} 
                            onSuccess={fetchData}
                            service={editingService}
                        />
                    )}
                    {editingDoctor && (
                        <EditDoctorModal 
                            isOpen={!!editingDoctor} 
                            onClose={() => setEditingDoctor(null)} 
                            onSuccess={fetchData}
                            doctor={editingDoctor}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Medical;