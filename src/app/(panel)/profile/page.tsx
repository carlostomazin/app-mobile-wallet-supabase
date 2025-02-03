import colors from '@/constants/colors';
import { View, Text, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { supabase } from '@/src/utils/supabase';
import { useAuth } from '@/src/app/contexts/AuthContext';
import { useState } from 'react';

export default function Profile() {
  const { setAuth, user, userData } = useAuth();

  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);

    const { data, error } = await supabase
      .from('users')
      .upsert([
        {
          id: user?.id,
          name: name,
        },
      ]);

    if (error) {
      Alert.alert('Erro ao atualizar o usuário', error.message);
    } else {
      Alert.alert('Usuário atualizado com sucesso');
      setLoading(false);
      return;
    }
  }

  async function handleSignOut() {
    setLoading(true);

    const { error } = await supabase.auth.signOut();
    setAuth(null, null);

    if (error) {
      Alert.alert('Erro ao deslogar', error.message);
      setLoading(false);
      return;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          Dev<Text style={{ color: colors.green }}>App</Text>
        </Text>
        <Text style={styles.slogan}>
          Bem-vindo de volta!
        </Text>
      </View>

      <View style={styles.form}>

        <View>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            placeholder="Nome completo..."
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Digite seu email"
            style={styles.input}
            value={email}
            editable={false}
          />
        </View>

        <Pressable style={styles.buttonUpdate} onPress={handleUpdate}>
          <Text style={styles.buttonText}>
            {loading ? 'Carregando...' : 'Atualizar'}
          </Text>
        </Pressable>

        <Pressable style={styles.buttonLogout} onPress={handleSignOut}>
          <Text style={styles.buttonText}>
            {loading ? 'Carregando...' : 'Deslogar'}
          </Text>
        </Pressable>

      </View>

    </View >
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
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  buttonUpdate: {
    backgroundColor: colors.green,
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonLogout: {
    backgroundColor: colors.red,
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
    marginBottom: 16,
  },
});