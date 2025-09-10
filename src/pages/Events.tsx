import React, { useState, useEffect } from 'react';
import { CommunityEvent } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useLocalization } from '../contexts/LocalizationContext';
import { getCollection, updateDocument } from '../services/databaseService'; // Assuming updateDocument exists

const EventCard: React.FC<{ event: CommunityEvent, onClick: () => void }> = ({ event, onClick }) => {
    return (
        <Card onClick={onClick} className="flex flex-col h-full">
            <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p className="flex items-center"><Icon name="calendar" className="w-4 h-4 mr-2" /> {event.date} at {event.time}</p>
                    <p className="flex items-center"><Icon name="location" className="w-4 h-4 mr-2" /> {event.location}</p>
                </div>
                <div className="mt-auto pt-4">
                    <div className="text-sm font-semibold text-[#3b5978]">{event.rsvps} people going</div>
                </div>
            </div>
        </Card>
    );
};

const EventDetailModal: React.FC<{ event: CommunityEvent | null; onClose: () => void, onRsvp: (event: CommunityEvent) => void }> = ({ event, onClose, onRsvp }) => {
    const { t } = useLocalization();
    const [isRsvpd, setIsRsvpd] = useState(false);

    if (!event) return null;

    const handleRsvp = () => {
        if (!isRsvpd) {
            onRsvp(event);
            setIsRsvpd(true);
        }
    }

    return (
        <Modal isOpen={!!event} onClose={onClose} title={event.title}>
            <div>
                <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover rounded-lg mb-4" />
                <div className="text-gray-600 space-y-2 mb-4">
                    <p className="flex items-center font-semibold"><Icon name="calendar" className="w-5 h-5 mr-2 text-gray-500" /> {event.date} at {event.time}</p>
                    <p className="flex items-center font-semibold"><Icon name="location" className="w-5 h-5 mr-2 text-gray-500" /> {event.location}</p>
                </div>
                <p className="text-gray-600 mb-6">{event.description}</p>
                <div className="text-center text-lg font-bold text-[#3b5978] mb-4">
                    {event.rsvps + (isRsvpd ? 1 : 0)} {t('events_people_going')}
                </div>
                <Button className="w-full" onClick={handleRsvp} disabled={isRsvpd}>
                    {isRsvpd ? 'You are going!' : t('events_rsvp')}
                </Button>
            </div>
        </Modal>
    );
};

const Events: React.FC = () => {
    const [events, setEvents] = useState<CommunityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
    const { t } = useLocalization();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await getCollection<CommunityEvent>('events');
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleRsvp = async (eventToUpdate: CommunityEvent) => {
        try {
            // Optimistically update the UI
            setEvents(prevEvents => prevEvents.map(e =>
                e.id === eventToUpdate.id ? { ...e, rsvps: e.rsvps + 1 } : e
            ));
            // Update the document in Firestore, converting the id to a string
            await updateDocument('events', eventToUpdate.id.toString(), { rsvps: eventToUpdate.rsvps + 1 });
        } catch (error) {
            console.error("Failed to RSVP:", error);
            // Revert UI change on error
            setEvents(prevEvents => prevEvents.map(e =>
                e.id === eventToUpdate.id ? { ...e, rsvps: e.rsvps } : e
            ));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('events_title')}</h1>
            {loading ? <p>Loading events...</p> :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                    ))}
                </div>
            }
            <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onRsvp={handleRsvp} />
        </div>
    );
};

export default Events;