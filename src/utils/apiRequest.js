// utils/apiRequest.js

import apiClient from "./apiClient";
import { handleApiResponse, handleApiError } from "./apiUtils";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1"; 

// Protected
export const get = async (url, fallbackMessage) => {
  try {
    const response = await apiClient.get(url);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, fallbackMessage);
  }
};

export const post = async (url, data, fallbackMessage) => {
  try {
    const response = await apiClient.post(url, data);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, fallbackMessage);
  }
};

export const del = async (url, fallbackMessage) => {
  try {
    const response = await apiClient.delete(url);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, fallbackMessage);
  }
};

export const upload = async (url, formData, fallbackMessage) => {
  try {
    const response = await apiClient.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, fallbackMessage);
  }
};

// public
export const postRaw = async (url, data, fallbackMessage) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${url}`, data);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, fallbackMessage);
  }
};

export const getRaw = async (url, fallbackMessage) => {
    try {
    const response = await axios.get(`${API_BASE_URL}${url}`);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, fallbackMessage);
  }
}
