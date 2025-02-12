import React, { useState } from 'react';
import axios from 'axios';

const PDFQuestionGenerator = () => {
  const [file, setFile] = useState(null);
  const [marks, setMarks] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleMarksChange = (event) => {
    setMarks(event.target.value);
  };

  const handleGenerateQuestions = async () => {
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('marks', marks);

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload_pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const questionsText = response.data.questions;
        const questionsArray = questionsText.split("\n");
        setQuestions(questionsArray);
      } else {
        setError('Error generating questions. Please try again.');
      }
    } catch (error) {
      setError('Error generating questions. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>PDF Question Generator</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <br />
      <input
        type="number"
        min="1"
        max="20"
        value={marks}
        onChange={handleMarksChange}
        placeholder="Enter Marks Per Question"
      />
      <br />
      <button onClick={handleGenerateQuestions}>Generate Questions</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        {questions.length > 0 && (
          <ol>
            {questions.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default PDFQuestionGenerator;
