import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { ParkingViolation } from '../types';
import { mockParkingViolations } from '../data/mockData';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Modal from '../components/Modal';

const ReportViolationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('parking_report_violation')}>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_vehicle_number')}</label>
                    <input type="text" placeholder="e.g., MH 01 AB 1234" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_location')}</label>
                    <input type="text" placeholder="e.g., B-Wing, Slot 102" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_description')}</label>
                    <textarea rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_add_photo')}</label>
                    <input type="file" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-[#3b5978] hover:file:bg-sky-100"/>
                </div>
                <Button type="submit" className="w-full">Submit Report</Button>
            </form>
        </Modal>
    );
};

const ParkingWatch: React.FC = () => {
    const [violations, setViolations] = useState<ParkingViolation[]>(mockParkingViolations);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleReportClick = () => {
        if (currentUser) {
            setIsModalOpen(true);
        } else {
            navigate('/login');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('parking_title')}</h1>
                <Button onClick={handleReportClick} leftIcon={<Icon name="add" className="w-5 h-5"/>}>
                    {t('parking_report_violation')}
                </Button>
            </div>
            <div className="space-y-6">
                {violations.map(violation => (
                    <Card key={violation.id}>
                        <img src={violation.imageUrl} alt={violation.vehicleNumber} className="w-full h-56 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-xl text-gray-800">{violation.vehicleNumber}</h3>
                            <p className="text-sm font-semibold text-gray-600"><Icon name="location" className="w-4 h-4 inline -mt-1 mr-1" /> {violation.location}</p>
                            <p className="text-gray-700 my-2">{violation.description}</p>
                            <p className="text-xs text-gray-400 text-right">Reported by {`${violation.reportedBy.name} ${violation.reportedBy.block && `(${violation.reportedBy.block}-${violation.reportedBy.flatNumber})`}`} - {violation.timestamp}</p>
                        </div>
                    </Card>
                ))}
            </div>
            <ReportViolationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ParkingWatch;