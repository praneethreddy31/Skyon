import React from 'react';
// Fix: Use the useLocalization hook instead of importing LocalizationContext from App.
import { useLocalization } from '../contexts/LocalizationContext';
import Card from '../components/Card';
import Icon from '../components/Icon';
import { mockEmergencyContacts, mockMedicalServices, mockDoctors } from '../data/mockData';
import { EmergencyContact, MedicalService, Doctor } from '../types';

const EmergencyContacts: React.FC = () => {
    // Fix: Use the useLocalization hook.
    const { t } = useLocalization();
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-red-600 mb-3">{t('emergency_contacts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockEmergencyContacts.map((contact: EmergencyContact) => (
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
    );
}

const Medical: React.FC = () => {
    // Fix: Use the useLocalization hook.
    const { t } = useLocalization();

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800 text-center">{t('medical_title')}</h1>
            
            <EmergencyContacts />

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('medical_hospitals_clinics')}</h2>
                <div className="space-y-4">
                    {mockMedicalServices.map((service: MedicalService) => (
                        <Card key={service.id} className="border-l-4 border-blue-500">
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-800">{service.name} <span className="text-sm font-normal text-white bg-blue-500 px-2 py-0.5 rounded-full ml-2">{service.type}</span></h3>
                                <p className="text-sm text-gray-600 mt-1">{service.address}</p>
                                <p className="text-sm text-gray-500">{service.timings}</p>
                                <a href={`tel:${service.phone}`} className="mt-2 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800">
                                    <Icon name="phone" className="w-4 h-4" />
                                    {service.phone}
                                </a>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                 <h2 className="text-xl font-bold text-gray-800 mb-4">{t('medical_find_doctor')}</h2>
                 <div className="space-y-3">
                    {mockDoctors.map((doctor: Doctor) => (
                        <div key={doctor.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">{doctor.name} {doctor.isResident && <span className="text-xs font-semibold text-white bg-green-500 px-2 py-0.5 rounded-full ml-2">Resident</span>}</h3>
                                <p className="text-sm text-[#3b5978]">{doctor.specialty}</p>
                                <p className="text-xs text-gray-500">{doctor.location} | {doctor.availability}</p>
                            </div>
                            <button className="p-2 bg-sky-100 text-[#3b5978] rounded-full hover:bg-sky-200">
                                <Icon name="phone" className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default Medical;
