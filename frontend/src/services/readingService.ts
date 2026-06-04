// src/services/readingService.ts
import api from '../utils/axiosConfig';
import type { Reading, ReadingStats } from '../types';

const parseBlobError = async (blob: Blob) => {
  const rawText = await new Response(blob).text();
  try {
    const json = JSON.parse(rawText);
    return json.message || rawText;
  } catch {
    return rawText;
  }
};

const assertAudioBlob = async (response: { data: Blob; headers: any }) => {
  const contentType = response.headers['content-type'] || response.headers['Content-Type'];
  if (!contentType || !contentType.toString().startsWith('audio/')) {
    const message = await parseBlobError(response.data);
    throw new Error(message || 'Server did not return audio content');
  }
  return response.data;
};

export const readingService = {
  async speakText(text: string): Promise<Blob> {
    const response = await api.post('/read/text',
      { text, return_audio: true },
      { responseType: 'blob' }
    );
    return await assertAudioBlob(response);
  },

  async speakVisitorText(text: string): Promise<Blob> {
    const response = await api.post('/read/visitor',
      { text },
      { responseType: 'blob' }
    );
    return await assertAudioBlob(response);
  },
  
  async getReadingStats(): Promise<ReadingStats> {
    const response = await api.get('/read/stats');
    return response.data;
  },
  
  async getReadingHistory(page: number = 1, limit: number = 10): Promise<{
    readings: Reading[];
    total: number;
  }> {
    const response = await api.get('/read/history', {
      params: { page, limit }
    });
    return response.data;
  },
  
  async searchReadings(query: string): Promise<Reading[]> {
    const response = await api.get('/read/search', {
      params: { q: query }
    });
    return response.data;
  }
};