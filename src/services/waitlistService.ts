import api from './api';
import { WaitlistFormData } from '../types/waitlist';

export const captureEmail = async (email: string) => {
  const response = await api.post('/v1/waitlist/email-capture', { email });
  return response.data;
};

export const updateWaitlistEntry = async (id: string, data: WaitlistFormData) => {
  const response = await api.put(`/v1/waitlist/${id}`, data);
  return response.data;
};