// src/services/imageUploadService.ts

export const imageUploadService = {
  uploadImage: async (file: File): Promise<string | null> => {
    const CLOUD_NAME = 'dk04mogex'; // <-- Replace with your Cloudinary cloud name
    const UPLOAD_PRESET = 'skyon-app'; // <-- Replace with your upload preset

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      return data.secure_url; // This is the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  },
};