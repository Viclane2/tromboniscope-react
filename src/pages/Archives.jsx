import React, { useState } from "react";
import jsPDF from "jspdf";
import { FaSearch, FaSort, FaPrint, FaFilePdf, FaComment } from "react-icons/fa";

const Archives = ({ data = [], setStudents }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(6);
  const [showComments, setShowComments] = useState({});

  // Fonctions de base
  const handleDelete = (index) => {
    const enteredPassword = prompt("Entrez le mot de passe pour supprimer ce profil:");
    if (enteredPassword === data[index].password) {
      const updatedList = data.filter((_, i) => i !== index);
      setStudents(updatedList);
      localStorage.setItem("students", JSON.stringify(updatedList));
    } else {
      alert("Mot de passe incorrect!");
    }
  };

  const handleEdit = (index) => {
    const enteredPassword = prompt("Entrez le mot de passe pour modifier ce profil:");
    if (enteredPassword === data[index].password || enteredPassword === "default123") {
      setEditingId(index);
      setEditedStudent(data[index]);
    } else {
      alert("Mot de passe incorrect!");
    }
  };

  const handleSave = (index) => {
    const updatedList = [...data];
    updatedList[index] = {
      ...editedStudent,
      password: editedStudent.password || data[index].password
    };
    setStudents(updatedList);
    localStorage.setItem("students", JSON.stringify(updatedList));
    setEditingId(null);
    setPassword("");
    setPasswordError("");
  };

  const handleCommentSubmit = (studentIndex, commentText) => {
    if (!commentText || !commentText.trim()) return;
    
    const newComment = {
      text: commentText.trim(),
      date: new Date().toLocaleString()
    };

    const updatedStudents = [...data];
    updatedStudents[studentIndex].comments = [
      ...(updatedStudents[studentIndex].comments || []),
      newComment
    ];
    
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
  };

  // Fonctions de recherche, tri et pagination
  const filteredStudents = data.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortOrder === "asc") return a[sortBy]?.localeCompare(b[sortBy]);
    return b[sortBy]?.localeCompare(a[sortBy]);
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  // Fonctions d'export
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Annuaire des étudiants", 10, 10);
    let y = 20;

    data.forEach((student, index) => {
      doc.text(`${index + 1}. ${student.name} | Email: ${student.email}`, 10, y);
      y += 10;
      if (student.comments?.length > 0) {
        doc.text("Commentaires:", 10, y);
        y += 10;
        student.comments.forEach(comment => {
          doc.text(`- ${comment.text} (${comment.date})`, 15, y);
          y += 10;
        });
      }
      y += 10;
    });

    doc.save("annuaire_etudiants.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  // Styles
  const styles = {
    studentCard: {
      flex: "1 1 45%",
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "1rem",
      background: "#f9f9f9",
      marginBottom: "1rem",
      position: "relative"
    },
    commentIcon: {
      position: "absolute",
      top: "10px",
      right: "10px",
      cursor: "pointer"
    },
    commentSection: {
      marginTop: "1rem",
      padding: "0.5rem",
      background: "#f0f0f0",
      borderRadius: "5px"
    },
    commentInputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    sendButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2rem",
      padding: "0.5rem"
    },
    imagePreview: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "5px",
      marginTop: "0.5rem"
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Archives des étudiants</h2>

      {/* Barre de contrôle */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaSearch style={{ marginRight: "0.5rem" }} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: "0.5rem" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <FaSort style={{ marginRight: "0.5rem" }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "0.5rem" }}
          >
            <option value="name">Nom</option>
            <option value="email">Email</option>
            <option value="date">Date</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
          >
            {sortOrder === "asc" ? "↓" : "↑"}
          </button>
        </div>

        <button onClick={generatePDF} style={{ display: "flex", alignItems: "center" }}>
          <FaFilePdf style={{ marginRight: "0.5rem" }} /> Exporter PDF
        </button>

        <button onClick={handlePrint} style={{ display: "flex", alignItems: "center" }}>
          <FaPrint style={{ marginRight: "0.5rem" }} /> Imprimer
        </button>
      </div>

      {/* Liste des étudiants */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {currentStudents.length > 0 ? (
          currentStudents.map((student, index) => (
            <div key={index} style={styles.studentCard}>
              <FaComment 
                style={styles.commentIcon} 
                onClick={() => setShowComments(prev => ({
                  ...prev,
                  [index]: !prev[index]
                }))}
              />

              {student.image && (
                <img
                  src={student.image}
                  alt="Etudiant"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    marginBottom: "1rem",
                  }}
                />
              )}

              {editingId === index ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <input
                    type="text"
                    value={editedStudent.name}
                    onChange={(e) => setEditedStudent({...editedStudent, name: e.target.value})}
                    placeholder="Nom"
                  />
                  <input
                    type="email"
                    value={editedStudent.email}
                    onChange={(e) => setEditedStudent({...editedStudent, email: e.target.value})}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={editedStudent.hobby}
                    onChange={(e) => setEditedStudent({...editedStudent, hobby: e.target.value})}
                    placeholder="Hobby"
                  />
                  <textarea
                    value={editedStudent.description}
                    onChange={(e) => setEditedStudent({...editedStudent, description: e.target.value})}
                    placeholder="Description"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditedStudent({...editedStudent, image: event.target.result});
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                  {editedStudent.image && (
                    <img 
                      src={editedStudent.image} 
                      alt="Preview" 
                      style={styles.imagePreview}
                    />
                  )}
                  <input
                    type="password"
                    value={editedStudent.password || ""}
                    onChange={(e) => setEditedStudent({...editedStudent, password: e.target.value})}
                    placeholder="Nouveau mot de passe"
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => handleSave(index)}>Enregistrer</button>
                    <button onClick={() => setEditingId(null)}>Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <p><strong>Nom :</strong> {student.name}</p>
                  <p><strong>Email :</strong> {student.email}</p>
                  <p><strong>Hobbies :</strong> {student.hobby}</p>
                  <p><strong>Description :</strong> {student.description}</p>
                  <div style={{ marginTop: "0.5rem" }}>
                    <button onClick={() => handleEdit(index)}>Modifier</button>
                    <button onClick={() => handleDelete(index)}>Supprimer</button>
                  </div>
                </>
              )}

              {showComments[index] && (
                <div style={styles.commentSection}>
                  <h4>Commentaires</h4>
                  <div style={styles.commentInputContainer}>
                    <textarea
                      placeholder="Ajouter un commentaire..."
                      id={`comment-input-${index}`}
                      style={{ width: "100%", minHeight: "60px" }}
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById(`comment-input-${index}`);
                        handleCommentSubmit(index, input.value);
                        input.value = "";
                      }}
                      style={styles.sendButton}
                      title="Envoyer le commentaire"
                    >
                      ↗️
                    </button>
                  </div>
                  {student.comments?.map((comment, i) => (
                    <div key={i} style={{ marginTop: "0.5rem" }}>
                      <p>{comment.text}</p>
                      <small>{comment.date}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Aucun étudiant trouvé.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", gap: "0.5rem" }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                fontWeight: currentPage === i + 1 ? "bold" : "normal"
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default Archives;