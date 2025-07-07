import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Container, Snackbar, Alert, Grid,
  FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cnpj: string;
  userRole: 'CHEF' | 'RESTAURANT'; 
}

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  email: yup.string().email('Insira um email válido').required('O email é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('A senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
    .required('A confirmação de senha é obrigatória'),
  cnpj: yup.string().required('O CNPJ é obrigatório'),
  userRole: yup.string().oneOf(['CHEF', 'RESTAURANT'], 'Selecione um papel válido').required('O papel é obrigatório'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      cnpj: '',
      userRole: 'RESTAURANT',
    },
  });

  const onFormSubmit = async (data: RegisterFormInputs) => {
    setApiError('');
    try {
      const { name, email, password, cnpj, userRole } = data;
      await api.post('/restaurants/', { name, email, password, cnpj, userRole });

      setSuccessMessage('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao realizar o cadastro.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Cadastro - GastroHub
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 3, width: '100%' }}>
          <Controller name="name" control={control} render={({ field }) => ( <TextField {...field} required fullWidth label="Nome Completo" margin="normal" error={!!errors.name} helperText={errors.name?.message} /> )} />
          
          <FormControl fullWidth margin="normal" error={!!errors.userRole}>
            <InputLabel id="userRole-label">Eu sou um...</InputLabel>
            <Controller
              name="userRole"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="userRole-label"
                  label="Eu sou um..."
                >
                  <MenuItem value="RESTAURANT">Restaurante</MenuItem>
                </Select>
              )}
            />
            {errors.userRole && <FormHelperText>{errors.userRole.message}</FormHelperText>}
          </FormControl>

          <Controller name="email" control={control} render={({ field }) => ( <TextField {...field} required fullWidth label="Endereço de Email" margin="normal" error={!!errors.email} helperText={errors.email?.message} /> )} />
          <Controller name="cnpj" control={control} render={({ field }) => ( <TextField {...field} required fullWidth label="CNPJ" margin="normal" error={!!errors.cnpj} helperText={errors.cnpj?.message} /> )}/>
          <Controller name="password" control={control} render={({ field }) => ( <TextField {...field} required fullWidth label="Senha" type="password" margin="normal" error={!!errors.password} helperText={errors.password?.message} /> )} />
          <Controller name="confirmPassword" control={control} render={({ field }) => ( <TextField {...field} required fullWidth label="Confirmar Senha" type="password" margin="normal" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} /> )} />
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cadastrar
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Já tem uma conta? Faça login
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
      <Snackbar open={!!apiError || !!successMessage} autoHideDuration={6000} onClose={() => { setApiError(''); setSuccessMessage(''); }}>
        <Alert severity={apiError ? 'error' : 'success'} sx={{ width: '100%' }}>
          {apiError || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;