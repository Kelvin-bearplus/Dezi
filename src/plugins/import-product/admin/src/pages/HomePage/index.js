import React, { useRef, useState } from 'react';
import '../css/home.css';

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors('File is too large. Maximum file size is 5MB.');
        setFile(null);
      } else {
        setErrors('');
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrors('Please select a file before submitting.');
      return;
    }

   

    // const API_URL =    'http://localhost:1337'; // Sử dụng API URL từ biến môi trường

    try {
      const formData = new FormData();
      formData.append('files', file);
      const token = '1c330e26b8e2090711ee01f6b6fc56b955ccdf11800b97d5e0a6119e9f24416b2aaf89286a3e20182592ff983b86988e2fa7e15a78539875ec070a2187e9ece69f84df7ec4f6f849ceab6d57ff64efc8e0576f56599a6651629be7474221a1196cccbee35449afcd5a6fe3d0c97d41dd354a1340b2f5a9b4d182b92348847631';
      console.log('API Token:', token); // Kiểm tra token 
      const response = await fetch(`/api/product-designs/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('File imported successfully');
        setTimeout(() => {
          setSuccessMessage('');
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset input file bằng ref
          }
        }, 2000);
      } else {
        const errorMessage = result.message || 'Failed to import file';
        setErrors(errorMessage);
      }
    } catch (error) {
      console.error('Error during file submission:', error);
      setErrors('An error occurred during file submission');
    }
  };

  return (
    <section className='import'>
      <div className='import-wrap'>
        <form className='import-form' onSubmit={handleSubmit}>
          <input
            type='file'
            id='file'
            className='import-form-input'
            onChange={handleFileChange}
            ref={fileInputRef} // Gắn ref vào input file
          />
          {errors && <p className='import-error'>{errors}</p>}
          {successMessage && <p className='import-success'>{successMessage}</p>}
          <input
            type='submit'
            value='Import Product'
            className='import-form-submit'
          />
        </form>
      </div>
    </section>
  );
};

export default HomePage;
