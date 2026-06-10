import axiosClient from './axiosClient';

export const getDayContent = async (domain, taskName, type, day) => {
  try {
    const response = await axiosClient.get('/admin/day_content', {
      params: { domain, task_name: taskName, type, day }
    });
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { data: null }; // Not found is handled gracefully
    }
    throw error;
  }
};

export const saveDayContent = async (payload) => {
  const response = await axiosClient.post('/admin/day_content', payload);
  return response.data;
};

export const deleteDayContent = async (domain, taskName, type, day) => {
  const response = await axiosClient.delete('/admin/day_content', {
    params: { domain, task_name: taskName, type, day }
  });
  return response.data;
};

export const uploadResource = async (fileObj, day, originalName) => {
  const formData = new FormData();
  formData.append('file', fileObj);
  formData.append('day', day);
  formData.append('original_name', originalName);

  const response = await axiosClient.post('/admin/upload_resource', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
