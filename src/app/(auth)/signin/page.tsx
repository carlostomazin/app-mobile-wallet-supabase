import colors from '@/constants/colors';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { supabase } from '@/src/utils/supabase';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'

import Routes from '@/constants/routes'

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '1077774786938-utn5jrof8j0bfupqlo7980n1u3g4jdg2.apps.googleusercontent.com',
  })

  async function handleSingIn() {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Erro', error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace(Routes.profile);
  }

  async function googleSingIn() {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
        })
        if (error) {
          console.log(error)
        }
      } else {
        throw new Error('no ID token present!')
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancelled the login flow')
        return;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('operation (e.g. sign in) is in progress already')

      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated')
        return;
      } else {
        console.log('some other error happened', error)
        return;
      }
    }
    setLoading(false);
    router.replace(Routes.home);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          Dev<Text style={{ color: colors.green }}>App</Text>
        </Text>
        <Text style={styles.slogan}>
          O futuro da programação
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Digite seu email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="Digite sua senha"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={styles.button} onPress={handleSingIn}>
          <Text style={styles.buttonText}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Text>
        </Pressable>

        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={googleSingIn}
          disabled={loading}
          style={{ width: '100%', marginTop: 16 }}
        />

        <Link href={Routes.signUp} style={styles.link}>
          <Text style={{ color: colors.green, textAlign: 'center' }}>
            Criar uma conta
          </Text>
        </Link>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    backgroundColor: colors.zinc
  },
  header: {
    paddingLeft: 14,
    paddingRight: 14,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 34,
    color: colors.white,
    marginBottom: 34,
  },
  form: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
  },
  label: {
    color: colors.zinc,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 14,
  },
  button: {
    backgroundColor: colors.green,
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
  }
});