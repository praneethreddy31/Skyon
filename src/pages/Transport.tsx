import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { CarpoolRide, TransportRequest, UserInfo } from '../types';
import { getCollection, deleteDocument } from '../services/databaseService';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import PostRideModal from '../components/PostRideModal';
import PostRequestModal from '../components/PostRequestModal';

const Transport: React.FC = () => {
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'carpool' | 'requests'>('carpool');
    const [isRideModalOpen, setIsRideModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [rides, setRides] = useState<CarpoolRide[]>([]);
    const [requests, setRequests] = useState<TransportRequest[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchData = async () => {
        setLoading(true);
        try {
            const [ridesData, requestsData] = await Promise.all([
                getCollection<CarpoolRide>('carpoolRides'),
                getCollection<TransportRequest>('transportRequests')
            ]);
            setRides(ridesData);
            setRequests(requestsData);
        } catch (error) {
            console.error("Error fetching transport data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(currentUser) fetchData();
        else setLoading(false);
    }, [currentUser]);

    const handleActionClick = (action: () => void) => {
        if (currentUser) {
            action();
        } else {
            navigate('/login');
        }
    };

    const handleDelete = async (collection: string, id: string) => {
        if(window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteDocument(collection, id);
                fetchData();
            } catch (error) {
                alert("Failed to delete post.");
            }
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
            
            {loading && <p className="text-center py-10">Loading...</p>}

            {!loading && activeTab === 'carpool' && (
                <div>
                    <div className="text-right mb-4">
                         <Button onClick={() => handleActionClick(() => setIsRideModalOpen(true))} leftIcon={<Icon name="add" className="w-5 h-5"/>}>
                            {t('transport_post_ride')}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {rides.map((ride: CarpoolRide) => (
                            <Card key={ride.id} className="p-4 relative">
                                <p className="font-bold text-lg text-gray-800">{ride.from} &rarr; {ride.to}</p>
                                <p className="text-sm text-gray-600">With {`${ride.driver?.name} (${ride.driver?.block}-${ride.driver?.flatNumber})`}</p>
                                <div className="mt-2 flex items-center gap-4 flex-wrap">
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">{ride.date}</span>
                                    <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">{ride.time}</span>
                                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">{ride.seatsAvailable} Seats</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <a href={`https://wa.me/${ride.whatsappNumber}`} className="flex-1"><Button size="sm" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">WhatsApp</Button></a>
                                    <a href={`tel:${ride.phoneNumber}`} className="flex-1"><Button size="sm" variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">Call</Button></a>
                                </div>
                                {currentUser?.uid === ride.driver?.uid && (
                                    <button onClick={() => handleDelete('carpoolRides', ride.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><Icon name="close" className="w-5 h-5"/></button>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {!loading && activeTab === 'requests' && (
                 <div>
                    <div className="text-right mb-4">
                         <Button onClick={() => handleActionClick(() => setIsRequestModalOpen(true))} leftIcon={<Icon name="add" className="w-5 h-5"/>}>
                            {t('transport_post_request')}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {requests.map((req: TransportRequest) => (
                           <Card key={req.id} className="p-4 relative">
                                <p className="font-semibold text-[#3b5978] text-sm">{req.requestType}</p>
                                <p className="font-bold text-lg text-gray-800 mt-1">{req.description}</p>
                                <div className="mt-2 flex items-center gap-4">
                                    <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded">{req.date}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">By {`${req.requester?.name} (${req.requester?.block}-${req.requester?.flatNumber})`}</p>
                                <div className="flex gap-2 mt-4">
                                    <a href={`https://wa.me/${req.whatsappNumber}`} className="flex-1"><Button size="sm" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">WhatsApp</Button></a>
                                    <a href={`tel:${req.phoneNumber}`} className="flex-1"><Button size="sm" variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">Call</Button></a>
                                </div>
                                {currentUser?.uid === req.requester?.uid && (
                                    <button onClick={() => handleDelete('transportRequests', req.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><Icon name="close" className="w-5 h-5"/></button>
                                )}
                           </Card>
                        ))}
                    </div>
                </div>
            )}
            
            {isRideModalOpen && <PostRideModal isOpen={isRideModalOpen} onClose={() => setIsRideModalOpen(false)} onSuccess={fetchData} />}
            {isRequestModalOpen && <PostRequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} onSuccess={fetchData} />}
        </div>
    );
};

export default Transport;