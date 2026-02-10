
import { User, Hotel, UserRole, HotelStatus } from '../types';
import { STORAGE_KEYS } from '../constants';

export const storageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getHotels: (): Hotel[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HOTELS);
    return data ? JSON.parse(data) : [];
  },

  saveHotel: (hotel: Hotel) => {
    const hotels = storageService.getHotels();
    const index = hotels.findIndex(h => h.id === hotel.id);
    if (index > -1) {
      hotels[index] = hotel;
    } else {
      hotels.push(hotel);
    }
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(hotels));
  },

  updateHotelStatus: (hotelId: string, status: HotelStatus, reason?: string) => {
    const hotels = storageService.getHotels();
    const index = hotels.findIndex(h => h.id === hotelId);
    if (index > -1) {
      hotels[index].status = status;
      if (reason !== undefined) hotels[index].rejectReason = reason;
      localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(hotels));
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
};
