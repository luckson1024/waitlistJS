import api from './api';
import { WaitlistFormData } from '../types/waitlist';

export const captureEmail = async (email: string) => {
  const response = await api.post('/waitlist/email-capture', { email });
  return response.data;
};

export const updateWaitlistEntry = async (id: string, data: WaitlistFormData) => {
  const response = await api.put(`/waitlist/${id}`, data);
  return response.data;
};

export const deleteWaitlistEntry = async (id: number) => {
  const response = await api.delete(`/waitlist/${id}`);
  return response.data;
};

export const bulkDeleteWaitlistEntries = async (ids: number[]) => {
  const response = await api.post('/waitlist/bulk-delete', { ids });
  return response.data;
};