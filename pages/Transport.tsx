import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { CarpoolRide, TransportRequest } from '../types';
import { mockCarpoolRides, mockTransportRequests } from '../data/mockData';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Modal from '../components/Modal';

const PostRideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('transport_post_ride')}>
            <form className="space-y-4">
                {/* Form fields for posting a ride */}
                <p>Ride posting form would go here.</p>
                <Button type="submit" className="w-full">Submit Ride</Button>
            </form>
        </Modal>
    );
};
const PostRequestModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('transport_post_request')}>
            <form className="space-y-4">
                {/* Form fields for posting a request */}
                <p>Request posting form would go here.</p>
                <Button type="submit" className="w-full">Submit Request</Button>
            </form>
        </Modal>
    );
};

const Transport: React.FC = () => {
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'carpool' | 'requests'>('carpool');
    const [isRideModalOpen, setIsRideModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    
    const handleActionClick = (action: () => void) => {
        if (currentUser) {
            action();
        } else {
            navigate('/login');
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">{t('transport_title')}</h1>

            <div className="flex justify-center border-b">
                <button 
                    onClick={() => setActiveTab('carpool')}
                    className={`px-6 py-2 font-semibold ${activeTab === 'carpool' ? 'border-b-2 border-[#3b5978] text-[#3b5978]' : 'text-gray-500'}`}
                >
                    {t('transport_carpool_board')}
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-6 py-2 font-semibold ${activeTab === 'requests' ? 'border-b-2 border-[#3b5978] text-[#3b5978]' : 'text-gray-500'}`}
                >
                    {t('transport_driver_requests')}
                </button>
            </div>

            {activeTab === 'carpool' && (
                <div>
                    <div className="text-right mb-4">
                         <Button onClick={() => handleActionClick(() => setIsRideModalOpen(true))} leftIcon={<Icon name="add" className="w-5 h-5"/>}>
                            {t('transport_post_ride')}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {mockCarpoolRides.map((ride: CarpoolRide) => (
                            <Card key={ride.id}>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800">{ride.from} &rarr; {ride.to}</p>
                                            <p className="text-sm text-gray-600">With {`${ride.driver.name} (${ride.driver.block}-${ride.driver.flatNumber})`}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-[#3b5978]">{ride.seatsAvailable} Seats</p>
                                            <p className="text-xs text-gray-500">{ride.date} @ {ride.time}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                 <div>
                    <div className="text-right mb-4">
                         <Button onClick={() => handleActionClick(() => setIsRequestModalOpen(true))} leftIcon={<Icon name="add" className="w-5 h-5"/>}>
                            {t('transport_post_request')}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {mockTransportRequests.map((req: TransportRequest) => (
                           <Card key={req.id}>
                                <div className="p-4">
                                    <p className="font-semibold text-[#3b5978] text-sm">{req.requestType}</p>
                                    <p className="font-bold text-gray-800 mt-1">{req.description}</p>
                                    <div className="text-xs text-gray-500 mt-2">
                                        <span>By {`${req.requester.name} (${req.requester.block}-${req.requester.flatNumber})`}</span> | <span>For: {req.date}</span>
                                    </div>
                                </div>
                           </Card>
                        ))}
                    </div>
                </div>
            )}
            
            <PostRideModal isOpen={isRideModalOpen} onClose={() => setIsRideModalOpen(false)} />
            <PostRequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
        </div>
    );
};

export default Transport;