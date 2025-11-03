import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenue dans le Trombinoscope Étudiant</h1>
      
      <Link to="/directory" style={styles.link}>
        <button style={styles.button}>Ajouter un étudiant</button>
      </Link>


      <p style={styles.text}>Découvrez tous les profils des étudiants de votre établissement.</p>

      <Link to="/archives" style={styles.link}>
        <button style={styles.button}>Voir les profils</button>
      </Link>
      
      <img 
        src="/acceuil.jpg" 
        alt="Illustration acceuil" 
        style={styles.image}
        className="fade-in"
      />
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px 20px',
    minHeight: '100vh',
    backgroundColor: '#f2f2f2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  text: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '30px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
  link: {
    textDecoration: 'none',
  },
  image: {
    margin: '40px auto', // Centrage vertical et horizontal
    width: '50%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease',
    display: 'block', // Nécessaire pour que margin auto fonctionne
  },
};

export default Home;