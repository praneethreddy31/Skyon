import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Marketplace from './pages/Marketplace';
import Vendors from './pages/Vendors';
import Home from './pages/Home';
import Bazaar from './pages/Bazaar';
import StorePage from './pages/StorePage';
import Events from './pages/Events';
import LostAndFound from './pages/LostAndFound';
import Medical from './pages/Medical';
import Transport from './pages/Transport';
import ParkingWatch from './pages/ParkingWatch';
import TodaysDishes from './pages/TodaysDishes';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { AuthProvider } from './contexts/AuthContext';
import FundDeveloperButton from './components/FundDeveloperButton';

function App() {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <HashRouter>
          <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 pb-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/bazaar" element={<Bazaar />} />
                <Route path="/bazaar/:storeId" element={<StorePage />} />
                <Route path="/todays-dishes" element={<TodaysDishes />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/events" element={<Events />} />
                <Route path="/lost-and-found" element={<LostAndFound />} />
                <Route path="/medical" element={<Medical />} />
                <Route path="/transport" element={<Transport />} />
                <Route path="/parking-watch" element={<ParkingWatch />} />
              </Routes>
            </main>
            <BottomNav />
            <FundDeveloperButton />
          </div>
        </HashRouter>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;