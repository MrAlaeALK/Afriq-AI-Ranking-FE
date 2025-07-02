export const handleApiResponse = (response) => {
  if(response.data.status === "success"){
    return response.data.data;
  }
  throw new Error(response.data?.message);
}

export const handleApiError = (error, fallbackMessage) => {
  // Preserve the original error structure so components can access response status and data
  if (error.response) {
    // Server responded with an error status
    throw error;
  } else {
    // Network error or other issue - create a new error with fallback message
    throw new Error(fallbackMessage || error.message);
  }
}