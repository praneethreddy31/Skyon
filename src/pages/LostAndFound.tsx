import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LostAndFoundItem, UserInfo } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { getCollection, addDocument } from '../services/databaseService';

const ReportItemModal: React.FC<{ isOpen: boolean; onClose: () => void; onReport: () => void }> = ({ isOpen, onClose, onReport }) => {
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser || !currentUser.block) return;
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const userInfo: UserInfo = {
            name: currentUser.displayName || 'Unknown',
            block: currentUser.block,
            flatNumber: currentUser.flatNumber || '000',
        };

        const itemData = {
            status: formData.get('status') as 'Lost' | 'Found',
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            location: 'Community Area', // Placeholder
            date: new Date().toLocaleDateString(),
            imageUrl: 'https://picsum.photos/seed/item' + Math.random() + '/200/200',
            contact: userInfo,
        };

        try {
            await addDocument('lostAndFoundItems', itemData, userInfo);
            onReport();
            onClose();
        } catch (error) {
            console.error("Error reporting item:", error);
            alert("Failed to report item.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('lost_and_found_report_item')}>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">I have...</label>
                    <div className="mt-2 flex gap-4">
                        <label className="inline-flex items-center">
                            <input type="radio" className="form-radio text-[#3b5978]" name="status" value="Lost" defaultChecked />
                            <span className="ml-2">{t('lost_and_found_status_lost')} an item</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" className="form-radio text-[#3b5978]" name="status" value="Found" />
                            <span className="ml-2">{t('lost_and_found_status_found')} an item</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_title')}</label>
                    <input name="title" type="text" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_description')}</label>
                    <textarea name="description" rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"></textarea>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</Button>
            </form>
        </Modal>
    );
};


const LostAndFound: React.FC = () => {
    const [items, setItems] = useState<LostAndFoundItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await getCollection<LostAndFoundItem>('lostAndFoundItems');
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchItems();
    }, []);

    const handleReportClick = () => {
        if (currentUser) {
            setIsModalOpen(true);
        } else {
            navigate('/login');
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('lost_and_found_title')}</h1>
                <Button onClick={handleReportClick} leftIcon={<Icon name="add" className="w-5 h-5"/>}>
                    {t('lost_and_found_report_item')}
                </Button>
            </div>
            {loading ? <p>Loading items...</p> :
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map(item => (
                    <Card key={item.id} className="flex">
                        <img src={item.imageUrl} alt={item.title} className="w-1/3 object-cover" />
                        <div className="p-4 flex flex-col">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full self-start ${
                                item.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                                {item.status === 'Lost' ? t('lost_and_found_status_lost') : t('lost_and_found_status_found')}
                            </span>
                            <h3 className="font-semibold text-lg text-gray-800 mt-2">{item.title}</h3>
                            <p className="text-sm text-gray-600 flex-grow mt-1">{item.description}</p>
                            <div className="text-xs text-gray-400 mt-2">
                                <p>Location: {item.location}</p>
                                <p>{item.date}</p>
                                <p className="mt-1 font-semibold text-gray-600">Contact: {`${item.contact.name} (${item.contact.block}-${item.contact.flatNumber})`}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            }
            <ReportItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onReport={fetchItems} />
        </div>
    );
};

export default LostAndFound;