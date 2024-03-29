import { createContext, ReactNode, useState, useEffect } from "react";

import { api } from "../services/apiClient";

import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";

import { toast } from "react-toastify";

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@projetopizza.token')
        Router.push("/")
    } catch {
        console.log("erro ao deslogar")
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() => {

        //pegar token do cookie para fazer verificação
        const { '@projetopizza.token': token } = parseCookies();

        if (!token) {
            api.get("/me").then(response => {
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                //se erro deslogamos o usuario.
                signOut();
            })
        }
        
    }, [])


    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post("/session", {
                email,
                password
            })
            //console.log(response.data);
            const { id, name, token } = response.data;

            setCookie(undefined, '@projetopizza.token', token, {
                maxAge: 60 * 60 * 24 * 30, // expira em 1 mês.
                path: "/" // Todos os caminhos terão acesso ao cookie.
            })

            setUser({
                id,
                name,
                email,
            })

            // passar para proximas requisições o nosso token.
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Logado com sucesso!")

            // Redirecionar o usuario para pagina '/deshboard'
            Router.push('/dashboard')

        } catch (err) {
            toast.error("Erro ao acessar!")
            console.log("ERRO AO ACESSAR", err);
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {

            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success("Cadatro realizado com sucesso!")

            Router.push('/')

        } catch (err) {
            toast.error("Erro ao cadastrar!")
            console.log("erro ao cadastrar", err)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}