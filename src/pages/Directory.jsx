import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Composants stylisés avec styled-components
const FormContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputField = styled(motion.input)`
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    outline: none;
  }
`;

const TextAreaField = styled(motion.textarea)`
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    outline: none;
  }
`;

const FileInputWrapper = styled(motion.div)`
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
`;

const FileInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputLabel = styled.label`
  display: block;
  padding: 12px 15px;
  background: #f8f9fa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
    border-color: #007bff;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 15px;
  background: linear-gradient(135deg, #007bff, #0062cc);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.3);
  }
`;

const ImagePreview = styled(motion.img)`
  display: block;
  max-width: 200px;
  max-height: 200px;
  margin: 1rem auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
`;

const Directory = ({ students, setStudents }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hobby: "",
    description: "",
    image: "",
    date: new Date().toLocaleDateString(),
    password: "default123",
    comments: []
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = { ...formData };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    setFormData({
      name: "",
      email: "",
      hobby: "",
      description: "",
      image: "",
      date: new Date().toLocaleDateString(),
      password: "default123",
      comments: []
    });

    navigate("/archives");
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <FormContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Ajouter un étudiant</h2>
      
      <StyledForm onSubmit={handleSubmit}>
        <InputField
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom complet"
          required
          variants={inputVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        />
        
        <InputField
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Adresse email"
          required
          variants={inputVariants}
          custom={1}
          initial="hidden"
          animate="visible"
        />
        
        <InputField
          type="text"
          name="hobby"
          value={formData.hobby}
          onChange={handleChange}
          placeholder="Hobbie"
          variants={inputVariants}
          custom={2}
          initial="hidden"
          animate="visible"
        />
        
        <TextAreaField
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description personnelle"
          rows={4}
          variants={inputVariants}
          custom={3}
          initial="hidden"
          animate="visible"
        />
        
        <FileInputWrapper variants={inputVariants} custom={4} initial="hidden" animate="visible">
          <FileInput
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            id="image-upload"
          />
          <FileInputLabel htmlFor="image-upload">
            {formData.image ? "Changer l'image" : "Choisir une image"}
          </FileInputLabel>
        </FileInputWrapper>
        
        {formData.image && (
          <ImagePreview
            src={formData.image}
            alt="Preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
        
        <SubmitButton
          type="submit"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Enregistrer
        </SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default Directory;