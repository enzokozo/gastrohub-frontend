import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, CircularProgress, Alert, Button, Divider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import ProfileEditDialog from '../components/ProfileEditDialog';

interface RestaurantData {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  score: number;
}
interface DecodedToken {
  id: number;
  role: string;
}

const Profile: React.FC = () => {
  const { token, logout } = useAuth(); 
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchProfileData = async () => {
    if (!token) {
      setError('Token não encontrado. Por favor, faça login novamente.');
      setLoading(false);
      return;
    }
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      if (!userId) {
        throw new Error('ID do usuário não encontrado no token.');
      }
      const response = await api.get<RestaurantData>(`/restaurants/${userId}`);
      setRestaurant(response.data);
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [token]);

  const handleEditSubmit = async (data: Partial<{ password?: string; confirmPassword?: string; name?: string; email?: string; cnpj?: string; }>) => {
    if (!restaurant) return;
    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.email !== undefined) payload.email = data.email;
    if (data.cnpj !== undefined) payload.cnpj = data.cnpj;
    if (data.password !== undefined) payload.password = data.password;
    if (data.confirmPassword !== undefined) payload.confirmPassword = data.confirmPassword;
    try {
      await api.put(`/restaurants/${restaurant.id}`, payload);
      setNotification('Perfil atualizado com sucesso!');
      setIsEditOpen(false);
      fetchProfileData();
    } catch (err) {
      setNotification('Erro ao atualizar o perfil.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!restaurant) return;
    try {
      await api.delete(`/restaurants/${restaurant.id}`);
      setNotification('Conta excluída com sucesso. Você será desconectado.');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setNotification('Erro ao excluir a conta.');
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Meu Perfil
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {restaurant && (
          <Card>
            <CardContent>
              <Typography variant="h6">Nome:</Typography>
              <Typography color="text.secondary" gutterBottom>{restaurant.name}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Email:</Typography>
              <Typography color="text.secondary" gutterBottom>{restaurant.email}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">CNPJ:</Typography>
              <Typography color="text.secondary" gutterBottom>{restaurant.cnpj}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Score:</Typography>
              <Typography color="text.secondary">{restaurant.score}</Typography>
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={() => setIsEditOpen(true)}>Editar Perfil</Button>
              <Button variant="outlined" color="error" onClick={() => setIsDeleteConfirmOpen(true)}>Excluir Conta</Button>
            </Box>
          </Card>
        )}
      </Container>
      
      {restaurant && (
        <ProfileEditDialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditSubmit}
          userToEdit={restaurant}
        />
      )}

      <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir sua conta? Esta ação é permanente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        message={notification}
      />
    </>
  );
};

export default Profile;