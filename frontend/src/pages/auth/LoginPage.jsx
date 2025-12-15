import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import '../../styles.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    // Redirect based on user role
    const user = data.user || JSON.parse(localStorage.getItem('user'));

    if (user && user.role === 'spa_owner') {
      navigate('/spa-owner');
    } else if (user && user.role === 'admin') {
      navigate('/admin'); // Admin page (to be created later)
    } else {
      navigate('/account'); // Regular users
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Login to your Bali Spa Guide account</p>

          <LoginForm onSuccess={handleLoginSuccess} />

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
