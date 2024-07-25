// OcrComponent.js
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OcrComponent = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [ocrResult, setOcrResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        recognizeText(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const recognizeText = (image) => {
    setLoading(true);
    Tesseract.recognize(
      image,
      'chi_sim+eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      setLoading(false);
      setOcrResult(text);
    }).catch((error) => {
      setLoading(false);
      console.error(error);
    });
  };

  return (
    <div className="ocr-component">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {loading && <p>识别中，请稍候...</p>}
      {ocrResult && <p>识别结果：{ocrResult}</p>}
    </div>
  );
};

export default OcrComponent;
