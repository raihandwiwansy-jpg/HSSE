import axios from '@/lib/axios';

export const fetchPermitDefaults = async (): Promise<Record<string, string>> => {
  return {};
};

export const applyPermitDefaults = (data: Record<string, unknown>, defaults: Record<string, string>): Record<string, unknown> => {
  return data;
};
