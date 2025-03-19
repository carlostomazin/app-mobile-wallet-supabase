import { router, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/src/app/contexts/AuthContext';
import { useEffect } from 'react';
import { supabase } from '@/src/utils/supabase';
import { getUserById } from '@/src/utils/supabase_db';

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
        const user = await getUserById(session.user.id);

        if (user) {
          setAuth(session.user, user);
          router.replace('/(tabs)/home/page');
          return;
        } else {
          console.log('Usuário não encontrado ou ocorreu um erro');
        }
      }

      setAuth(null, null);
      router.replace('/(auth)/signin/page');
    })
  }, [])

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)/signin/page" />
      <Stack.Screen name="(auth)/signup/page" />
    </Stack>
  );
}