import { createContext, useContext, useMemo, useState } from 'react';
import { authTokenKey, getMe, login, register } from './api.js';

const Ctx = createContext(null);
const storedUser = () => { try { return JSON.parse(localStorage.getItem('ranktel-auth-user')) || null; } catch { return null; } };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const save = (result) => {
    localStorage.setItem(authTokenKey, result.token);
    localStorage.setItem('ranktel-auth-user', JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  };
  const signIn = async (credentials) => save(await login(credentials));
  const signUp = async (credentials) => save(await register(credentials));
  const signOut = () => { localStorage.removeItem(authTokenKey); localStorage.removeItem('ranktel-auth-user'); setUser(null); };
  const refresh = async () => { const result = await getMe(); setUser(result.user); return result.user; };
  const value = useMemo(() => ({ user, signIn, signUp, signOut, refresh }), [user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
