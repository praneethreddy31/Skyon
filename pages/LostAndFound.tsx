import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockLostFoundItems } from '../data/mockData';
import { LostAndFoundItem } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';


const ReportItemModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('lost_and_found_report_item')}>
             <form className="space-y-4">
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
                    <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_description')}</label>
                    <textarea rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_add_photo')}</label>
                    <input type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-[#3b5978] hover:file:bg-sky-100"/>
                </div>
                <Button type="submit" className="w-full">Submit Report</Button>
            </form>
        </Modal>
    );
};


const LostAndFound: React.FC = () => {
    const [items, setItems] = useState<LostAndFoundItem[]>(mockLostFoundItems);
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
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('lost_and_found_title')}</h1>
                <Button onClick={handleReportClick} leftIcon={<Icon name="add" className="w-5 h-5"/>}>
                    {t('lost_and_found_report_item')}
                </Button>
            </div>
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
                                <p className="mt-1 font-semibold text-gray-600">Contact: {`${item.contact.name} ${item.contact.block && `(${item.contact.block}-${item.contact.flatNumber})`}`}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <ReportItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default LostAndFound;