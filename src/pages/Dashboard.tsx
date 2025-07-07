import React, {useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Container,
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Button,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Stack,
} from '@mui/material';

import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../api/axios';
import KitchenFormDialog from '../components/KitchenFormDialog';
import Header from '../components/Header';

// Definição da estrutura de dados da Kitchen
interface Kitchen {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[];
  score: number;
}

const Dashboard: React.FC = () => {
    // Estados para armazenar os dados, o carregamento e os erros
    const [kitchens, setKitchens] = useState<Kitchen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para gerenciar o formulário de edição/criação
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingKitchen, setEditingKitchen] = useState<Kitchen | null>(null);

    // Estados para a confirmação de exclusão
    const [kitchenToDelete, setKitchenToDelete] = useState<Kitchen | null>(null);

     // Estado para notificações
    const [notification, setNotification] = useState<string | null>(null);

    // Função para carregar as cozinhas do backend
    const loadKitchens = async () => {
        try {
            setLoading(true);
            const response = await api.get('/kitchens'); // Faz a chamada GET para a rota /kitchens
            setKitchens(response.data); // Armazena os dados recebidos no estado
        } catch (err) {
            setError('Falha ao carregar as cozinhas'); // Define a mensagem de erro
        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    };

    // O useEffect chama a função loadKitchens quando o componente é montado
    useEffect(() => {
        loadKitchens();
    }, []);

    const handleOpenDialog = (kitchen: Kitchen | null) => {
        setEditingKitchen(kitchen);
        setIsDialogOpen(true)
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleSubmit = async (data: Omit<Kitchen, 'id'>) => {
        try {
            if (editingKitchen) {
                // Modo de edição (PUT)
                await api.put(`/kitchens/${editingKitchen.id}`, data);
                setNotification('Cozinha atualizada com sucesso!');
            } else {
                // Modo de criação (POST)
                await api.post('/kitchens', data);
                setNotification('Cozinha criada com sucesso!');
            }
            handleCloseDialog(); // Fecha o diálogo após a submissão
            loadKitchens(); // Recarrega as cozinhas
        } catch (err) {
            setError('Falha ao salvar a cozinha'); // Define a mensagem de erro
        }
    };

    // Abre o diálogo de confirmação de exclusão
    const handleOpenDeleteConfirm = (kitchen: Kitchen) => {
        setKitchenToDelete(kitchen);
    };

    // Fecha o diálogo de confirmação de exclusão
    const handleCloseDeleteConfirm = () => {
        setKitchenToDelete(null);
    };

    // Executa a exclusão após a confirmação
    const handleDelete = async () => {
        if (!kitchenToDelete) return;
        try {
            await api.delete(`/kitchens/${kitchenToDelete.id}`); // Faz a chamada DELETE para a rota /kitchens/:id
            setNotification('Cozinha excluída com sucesso!');
            handleCloseDeleteConfirm(); // Fecha o diálogo de confirmação
            loadKitchens(); // Recarrega as cozinhas após a exclusão
        } catch (err) {
            setError('Falha ao excluir a cozinha'); // Define a mensagem de erro
        }      
    };

    // Lógica de renderização
    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center"
                alignItems="center"
                height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Usando Stack para o cabeçalho da página, como no seu exemplo */}
                <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mb={3}
                >
                    <Typography variant="h4">Painel de Cozinhas</Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<Add />} 
                        onClick={() => handleOpenDialog(null)}
                    >
                        Nova Cozinha
                    </Button>
                </Stack>

                {/* Lógica de Carregamento e Erro */}
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    // Usando o layout Grid com a propriedade 'size', conforme sua referência
                    <Grid container spacing={3}>
                        {kitchens.map((kitchen) => (
                            <Grid size={12} key={kitchen.id}>
                                <Card>
                                    <CardHeader
                                        title={kitchen.name}
                                        action={
                                            <>
                                                <IconButton onClick={() => handleOpenDialog(kitchen)}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton onClick={() => handleOpenDeleteConfirm(kitchen)}>
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        }
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            {kitchen.location}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Diálogos e Notificações */}
                <KitchenFormDialog
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    onSubmit={handleSubmit}
                    kitchenToEdit={editingKitchen}
                />

                <Dialog
                    open={!!kitchenToDelete}
                    onClose={handleCloseDeleteConfirm}
                >
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Você tem certeza que deseja excluir a cozinha "{kitchenToDelete?.name}"?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteConfirm}>Cancelar</Button>
                        <Button onClick={handleDelete} color="error" variant="contained">
                            Confirmar Exclusão
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={!!notification}
                    autoHideDuration={6000}
                    onClose={() => setNotification(null)}
                    message={notification}
                />
            </Container>
        </>
    );
};

export default Dashboard;