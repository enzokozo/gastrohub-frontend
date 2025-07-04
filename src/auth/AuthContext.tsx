import React, { createContext, useContext, useState, useEffect } from 'react';

// Define o formato do nosso contexto de autenticação
interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cria o provedor do contexto de autenticação
export function AuthProvider({ children }: {children: React.ReactNode}) {
    // Inicializa o estado do token, buscando do localStorage para manter o usuário logado
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    // Efeito que sincroniza o estado do token com o localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Função para fazer logout, limpando o token
    const logout = () => {
        setToken(null);
    };

    // Valor do contexto que será fornecido aos componentes filhos
    const value = { token, setToken, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook customizador para facilitar o uso do contexto de autenticação nos componentes
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}