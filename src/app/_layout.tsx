import { router, Stack } from 'expo-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Alert } from 'react-native';

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

function MainLayout() {

  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {

      if (session) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          Alert.alert('Erro ao buscar usuário', error.message);
          return
        } else {
          setAuth(session.user, data);
          router.replace('/(panel)/profile/page');
          return
        }
      }

      setAuth(null, null);
      router.replace('/(auth)/signin/page');
    })
  }, [])

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(auth)/signin/page"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(auth)/signup/page"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(panel)/profile/page"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}