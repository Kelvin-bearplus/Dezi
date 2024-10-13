import React, {useRef,   useState } from 'react';
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

    try {
      const formData = new FormData();
      formData.append('files', file);
      const token = process.env.REACT_APP_API_TOKEN;
      const response = await fetch('/api/product-designs/import', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
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
        }, 2000)
      } else {
        setErrors(result.error || 'Failed to import file');
      }
    } catch (error) {
      setErrors('An error occurred during file submission');
    }
  };

  return (
    <section className='import'>
      <div className='import-wrap'>
        <form className='import-form' onSubmit={handleSubmit}>
          {/* <label htmlFor='file' className='import-lable-input'>Choose your file(csv)</label> */}
          <input
            type='file'
            id='file'
            className='import-form-input'
            onChange={handleFileChange}
            ref={fileInputRef} 
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
