import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Container, Snackbar, Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface LoginFormInputs {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Por favor, insira um email válido').required('O email é obrigatório'),
  password: yup.string().required('A senha é obrigatória'),
});

const Login: React.FC = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onFormSubmit = async (data: LoginFormInputs) => {
    setApiError('');
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { token } = response.data;
      if (token) {
        setToken(token);
        navigate('/');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Container component="main" >
      <Box >
        <Typography component="h1" variant="h5">
          Login - GastroHub
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Não tem uma conta? Cadastre-se
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
      <Snackbar open={!!apiError} autoHideDuration={6000} onClose={() => setApiError('')}>
        <Alert onClose={() => setApiError('')} severity="error" sx={{ width: '100%' }}>
          {apiError}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;