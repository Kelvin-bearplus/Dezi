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
      const token = '5bd87932f4379adc7a656ca79fdc4c3c105b34425b3fe227db87c11e41ad147e15561450110c5acffd5e1a306497dacd78d03f48ffa00604aa032fe43e9be2d4162126084c2575849b52a19cab167a87d56e38a15b8aef56be0e3642d1cdf811d2dd4a51cc1652edc1b8cca7bc202dd992a1b85a2ee452e069aa58ab81990452';
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
