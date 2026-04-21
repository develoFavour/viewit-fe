import api from './api';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
  data: {
    success: boolean;
    message: string;
    data: T;
  };
  status: number;
}

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse = await api.get(url, config);
  return { data: response.data, status: response.status };
};

export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse = await api.post(url, data, config);
  return { data: response.data, status: response.status };
};

export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse = await api.put(url, data, config);
  return { data: response.data, status: response.status };
};

export const patch = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse = await api.patch(url, data, config);
  return { data: response.data, status: response.status };
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse = await api.delete(url, config);
  return { data: response.data, status: response.status };
};
