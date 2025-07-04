import React, { useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Definição da estrutura de dados da Kitchen
interface KitchenFormData {
  id?: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[];
  score: number;
}

interface FormState {
  name: string;
  location: string;
  capacity: number;
  equipment: string;
  score: number;
}

// Definição das propriedades do componente
interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<KitchenFormData, 'id'>) => void;
    kitchenToEdit?: KitchenFormData | null;
}

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    location: yup.string().required('Localização é obrigatória'),
    capacity: yup.number().required('Capacidade é obrigatória').min(1, 'Capacidade deve ser maior que 0'),
    equipment: yup.string().required('Equipamentos são obrigatórios'),
    score: yup.number().required('Pontuação é obrigatória').min(0, 'Pontuação não pode ser negativa').max(5, 'Pontuação não pode ser maior que 5'),
}).required();

const KitchenFormDialog: React.FC<Props> = ({ open, onClose, onSubmit, kitchenToEdit }) => {
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormState>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            location: '',
            capacity: 0,
            equipment: '',
            score: 0,
        }
    });

    useEffect(() => {
        if (open) {
            if (kitchenToEdit) {
                reset({
                    ...kitchenToEdit,
                    equipment: kitchenToEdit.equipment.join(', '),
                });
            } else {
                reset();
            }
        }
    }, [kitchenToEdit, open, reset]);

    const onFormSubmit = (data: FormState) => {
        const dataToSend = {
            ...data,
            equipment: data.equipment.split(',').map(e => e.trim()),
        };
        onSubmit(dataToSend);
    };

     return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>{kitchenToEdit ? 'Editar Cozinha' : 'Nova Cozinha'}</DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Nome da Cozinha" fullWidth margin="dense" error={!!errors.name} helperText={errors.name?.message} />
            )}
          />
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Localização" fullWidth margin="dense" error={!!errors.location} helperText={errors.location?.message} />
            )}
          />
          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Capacidade" type="number" fullWidth margin="dense" error={!!errors.capacity} helperText={errors.capacity?.message} />
            )}
          />
          <Controller
            name="equipment"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Equipamentos (separados por vírgula)" fullWidth margin="dense" error={!!errors.equipment} helperText={errors.equipment?.message} />
            )}
          />
          <Controller
            name="score"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Score" type="number" fullWidth margin="dense" error={!!errors.score} helperText={errors.score?.message} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {kitchenToEdit ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default KitchenFormDialog;