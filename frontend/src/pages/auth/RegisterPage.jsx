import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import '../../styles.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    // Redirect to login page after successful registration
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="register-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Create Your Account</h1>
          <p className="auth-subtitle">Join Bali Spa Guide to manage your bookings</p>

          <RegisterForm onSuccess={handleRegistrationSuccess} />

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
