import { useEffect,useState } from 'react';
import { register } from '../../api/auth';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setMessage] = useState(null);
  const router = useRouter();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const response = await register(name, email, password);
      console.log('Registration successful:', response.data);
      setMessage(response.data.message);
      router.push('/auth/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
              Signup your Account!
            </Typography>
            <form onSubmit={handleRegister}>
              <TextField
                label="Name"
                type="text"
                fullWidth
                margin="normal"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                Register
              </Button>
            </form>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link href="/auth/login" passHref>
                <Button color="primary">Login</Button>
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
  );
};

export default RegisterForm;