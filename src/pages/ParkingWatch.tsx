import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { ParkingViolation, UserInfo, User } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { getCollection, addDocument, deleteDocument } from '../services/databaseService';
import { imageUploadService } from '../services/imageUploadService';

// --- Form Modal for Reporting a New Violation ---
const ReportViolationModal: React.FC<{ isOpen: boolean; onClose: () => void; onReport: () => void; }> = ({ isOpen, onClose, onReport }) => {
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser || !currentUser.block || !imageFile) {
            alert("Please fill all fields and upload a photo of the violation.");
            return;
        }
        if (!formRef.current) return;
        setLoading(true);

        try {
            const imageUrl = await imageUploadService.uploadImage(imageFile);
            if (!imageUrl) throw new Error("Image upload failed");

            const formData = new FormData(formRef.current);
            const reporterInfo: UserInfo = {
                uid: currentUser.uid,
                name: currentUser.displayName || 'Unknown',
                block: currentUser.block,
                flatNumber: currentUser.flatNumber || '000',
            };

            const violationData = {
                vehicleNumber: formData.get('vehicleNumber') as string,
                location: formData.get('location') as string,
                description: formData.get('description') as string,
                imageUrl: imageUrl,
                reportedBy: reporterInfo,
                timestamp: new Date().toLocaleString('en-IN'),
            };

            await addDocument('parkingViolations', violationData, reporterInfo);
            alert("Violation reported successfully.");
            onReport();
            onClose();
        } catch (error) {
            console.error("Error reporting violation:", error);
            alert("Failed to report violation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('parking_report_violation')}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_vehicle_number')}</label>
                    <input name="vehicleNumber" type="text" placeholder="e.g., TS 09 AB 1234" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_location')}</label>
                    <input name="location" type="text" placeholder="e.g., B-Wing, Slot 102" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_description')}</label>
                    <textarea name="description" rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_add_photo')}</label>
                    <input 
                        type="file"
                        required
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files) setImageFile(e.target.files[0]);
                        }}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-[#3b5978] hover:file:bg-sky-100"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</Button>
            </form>
        </Modal>
    );
};

// --- Main Parking Watch Page Component ---
const ParkingWatch: React.FC = () => {
    const [violations, setViolations] = useState<ParkingViolation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const fetchViolations = async () => {
        setLoading(true);
        try {
            const data = await getCollection<ParkingViolation>('parkingViolations');
            setViolations(data);
        } catch (error) {
            console.error("Error fetching violations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchViolations();
    }, []);

    const handleReportClick = () => {
        if (currentUser) {
            setIsModalOpen(true);
        } else {
            navigate('/login');
        }
    };
    
    const handleDelete = async (violationId: string) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await deleteDocument('parkingViolations', violationId);
                fetchViolations(); // Refresh the list
            } catch (error) {
                alert("Failed to delete report.");
            }
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
            {loading ? <p className="text-center py-10">Loading reports...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {violations.map(violation => (
                        <Card key={violation.id} className="relative group">
                            <img src={violation.imageUrl} alt={violation.vehicleNumber} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold text-xl text-gray-800">{violation.vehicleNumber}</h3>
                                <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <Icon name="location" className="w-4 h-4 inline" /> {violation.location}
                                </p>
                                <p className="text-gray-700 my-2 text-sm">{violation.description}</p>
                                <p className="text-xs text-gray-400 text-right">
                                    Reported by {`${violation.reportedBy.name} (${violation.reportedBy.block}-${violation.reportedBy.flatNumber})`} - {violation.timestamp}
                                </p>
                            </div>
                            {currentUser?.uid === violation.reportedBy.uid && (
                                <button 
                                    onClick={() => handleDelete(violation.id)} 
                                    className="absolute top-2 right-2 p-2 bg-white/70 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                    aria-label="Delete report"
                                >
                                    <Icon name="close" className="w-5 h-5"/>
                                </button>
                            )}
                        </Card>
                    ))}
                </div>
            )}
            <ReportViolationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onReport={fetchViolations}/>
        </div>
    );
};

export default ParkingWatch;