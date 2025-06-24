export const handleApiResponse = (response) => {
  if(response.data.status === "success"){
    return response.data.data;
  }
  throw new Error(response.data?.message);
}

export const handleApiError = (error, fallbackMessage) => {
  throw new Error(error.response?.data?.message || fallbackMessage);
}