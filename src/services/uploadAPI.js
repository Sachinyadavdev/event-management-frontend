/**
 * Upload banner image to backend server
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - Response with uploaded file URL
 */
export const uploadBanner = async (file) => {
  try {
    const formData = new FormData();
    formData.append('banner', file);

    const response = await fetch('http://localhost:5000/api/upload/banner', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload banner');
    }

    return data;
  } catch (error) {
    console.error('Banner upload error:', error);
    throw error;
  }
};

/**
 * Delete banner image from server
 * @param {string} filename - The filename to delete
 * @returns {Promise<Object>} - Response object
 */
export const deleteBanner = async (filename) => {
  try {
    const response = await fetch(`http://localhost:5000/api/upload/banner/${filename}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete banner');
    }

    return data;
  } catch (error) {
    console.error('Banner delete error:', error);
    throw error;
  }
};
