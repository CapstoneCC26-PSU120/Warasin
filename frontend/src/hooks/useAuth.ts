import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { z } from 'zod';

// Zod schemas
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// API functions
const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};

const login = async (input: LoginInput) => {
  const { data } = await api.post('/auth/login', input);
  return data.user;
};

const register = async (input: RegisterInput) => {
  const { data } = await api.post('/auth/register', input);
  return data.user;
};

const logout = async () => {
  await api.post('/auth/logout');
};

// Hooks
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
    },
  });
};
