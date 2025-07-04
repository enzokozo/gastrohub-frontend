import axios from 'axios';

// Cria uma instância do Axios com a URL base
const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Adiciona o interceptor de requisição
api.interceptors.request.use(
    (config) => {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Se o token existir, adiciona-o ao cabeçalho Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Retorna a configuração modificada
    },
    (error) => {
        // Em caso de erro na configuração de requisição
        return Promise.reject(error); // Rejeita a promessa com o erro
    }
);

export default api;