import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { RestaurantProfile } from '../types';

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  email: yup.string().email('Insira um email válido').required('O email é obrigatório'),
  cnpj: yup.string().required('O CNPJ é obrigatório'),
  password: yup.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
    .when('password', (password, field) =>
      password && password[0] ? field.required('Confirme a nova senha') : field
    ),
});

type FormValues = yup.InferType<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<FormValues>) => void;
  userToEdit: RestaurantProfile | null;
}

const ProfileEditDialog: React.FC<Props> = ({ open, onClose, onSubmit, userToEdit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { 
      name: '',
      email: '',
      cnpj: '',
      password: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    if (userToEdit) {
      reset({
        name: userToEdit.name,
        email: userToEdit.email,
        cnpj: userToEdit.cnpj,
      });
    } else {
      reset({ name: '', email: '', cnpj: '', password: '', confirmPassword: '' });
    }
  }, [userToEdit, open, reset]);

  const onFormSubmit = (data: FormValues) => {
    const dataToSend: Partial<FormValues> = {
      name: data.name,
      email: data.email,
      cnpj: data.cnpj,
    };

    if (data.password) {
      dataToSend.password = data.password;
    }

    onSubmit(dataToSend);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
            <Controller name="name" control={control} render={({ field }) => ( <TextField {...field} label="Nome do Restaurante" fullWidth margin="dense" error={!!errors.name} helperText={errors.name?.message} /> )} />
            <Controller name="email" control={control} render={({ field }) => ( <TextField {...field} label="Email" type="email" fullWidth margin="dense" error={!!errors.email} helperText={errors.email?.message} /> )} />
            <Controller name="cnpj" control={control} render={({ field }) => ( <TextField {...field} label="CNPJ" fullWidth margin="dense" error={!!errors.cnpj} helperText={errors.cnpj?.message} /> )} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Deixe os campos abaixo em branco se não quiser alterar a senha.
            </Typography>
            <Controller name="password" control={control} render={({ field }) => ( <TextField {...field} label="Nova Senha" type="password" fullWidth margin="dense" error={!!errors.password} helperText={errors.password?.message} /> )} />
            <Controller name="confirmPassword" control={control} render={({ field }) => ( <TextField {...field} label="Confirmar Nova Senha" type="password" fullWidth margin="dense" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} /> )} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar Alterações</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileEditDialog;