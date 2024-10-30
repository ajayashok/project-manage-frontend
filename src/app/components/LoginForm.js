import { useEffect,useState } from 'react';
import { login } from '../../api/auth';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setResponse] = useState(null);
  const router = useRouter();

  useEffect(() => {
      setIsClient(true); // Now running only on the client
  }, []);

  useEffect(() => {
      if (isClient) {
          const token = localStorage.getItem('authToken');
          if (token) {
              router.push('/'); // Redirect if token is present
          }
      }
  }, [isClient, router]);

  if (!isClient) return null; // Avoid SSR rendering of this component

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    try {
      const response = await login(email, password);
      if (response.data.status == 'success') {
        localStorage.setItem('authToken', response.data.data.token);
        setResponse(response.data.message);
        router.push('/'); // Redirect to a protected page
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        bgcolor="#f5f5f5"
      >
        <Card sx={{ maxWidth: 400, width: '100%', padding: 3, boxShadow: 3 }}>
          <CardContent>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
            <Typography variant="h5" align="center" gutterBottom>
              Login to your Account!
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              You dont have an account?{' '}
              <Link href="/auth/register" passHref>
                <Button color="primary">Register</Button>
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
  );
};

export default LoginForm;
