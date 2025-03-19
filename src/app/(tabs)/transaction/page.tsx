import colors from '@/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Switch, TouchableOpacity, FlatList, Modal, Keyboard, TouchableWithoutFeedback, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import Routes from '@/constants/routes';
import { addExpense, addIncome, getCategoriesByUserIdAndType, getWalletsByUserId } from '@/src/utils/supabase_db';
import { useAuth } from '@/src/app/contexts/AuthContext';
import { CustomModal } from '@/components/CustomModal';


export default function Transacao() {
  const { setAuth, user, userData } = useAuth();

  const [value, setValue] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [date, setDate] = useState<string>();
  const [wallet, setWallet] = useState<item>();
  const [itemsWallet, setItemsWallet] = useState<item[]>([]);
  const [categoria, setCategoria] = useState<item>();
  const [itemsCategory, setItemsCategory] = useState<item[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<'despesa' | 'receita'>('despesa')
  const [typesCategories] = useState({
    "despesa": "expense",
    "receita": "income"
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisibleWallet, setModalVisibleWallet] = useState(false);
  const [modalVisibleCategory, setModalVisibleCategory] = useState(false);
  const pathname = usePathname();

  const toggleSwitch = (previousState: boolean) => {
    setIsEnabled(previousState => !previousState);
    setText(previousState ? "receita" : "despesa")
  }

  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateSelect = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      const formattedDate = selectedDate.toLocaleDateString('pt-BR');
      setDate(formattedDate);
    }
  };

  const openModal = (type: string) => {
    if (type == "wallet") {
      setModalVisibleWallet(true)
    } else {
      setModalVisibleCategory(true)
    }
  };

  const handleSelect = (item: item, type: string) => {
    if (type == "wallet") {
      setModalVisibleWallet(false)
      setWallet(item);
    } else {
      setModalVisibleCategory(false)
      setCategoria(item);
    }
  };

  interface item {
    id: string,
    label: string,
  }

  function defaultValues() {
    setValue(undefined);
    setDescription(undefined);
    setDate(undefined);
    setCategoria(undefined);
    setWallet(undefined);
    setIsEnabled(false);
    setText("despesa")
  }

  async function loadCategories() {
    if (!user) return;
    const categories = await getCategoriesByUserIdAndType(user.id, typesCategories[text]);
    if (categories) {
      // Transform the categories to match the expected format
      const formattedCategories = categories.map(category => ({
        id: category.id,
        label: category.name
      }));
      setItemsCategory(formattedCategories);
    }
  }

  async function loadWallets() {
    if (!user?.id) return;
    const wallets = await getWalletsByUserId(user?.id);
    if (wallets) {
      // Transform the categories to match the expected format
      const formattedCategories = wallets.map(wallet => ({
        id: wallet.id,
        label: wallet.name
      }));
      setItemsWallet(formattedCategories);
    }
  }

  async function handleAddTransacao(type: string) {
    setLoading(true);
    if (value == undefined || value == '0') {
      Alert.alert('Error', 'Value is required');
      setLoading(false);
      return;
    }

    if (description === undefined) {
      Alert.alert('Error', 'Description is required');
      setLoading(false);
      return;
    }

    if (date === undefined) {
      Alert.alert('Error', 'Date is required');
      setLoading(false);
      return;
    }

    if (wallet === undefined) {
      Alert.alert('Error', 'Wallet is required');
      setLoading(false);
      return;
    }

    if (categoria === undefined) {
      Alert.alert('Error', 'Category is required');
      setLoading(false);
      return;
    }

    if (!user) return;

    if (type == "despesa") {
      const data = await addExpense(
        parseFloat(value),
        description,
        date,
        wallet?.id,
        user?.id,
        user?.id,
        categoria?.id
      );
      if (!data) {
        Alert.alert('Error add expense');
        setLoading(false);
        return;
      }
    } else {
      const data = await addIncome(
        parseFloat(value),
        description,
        date,
        wallet?.id,
        user?.id,
        user?.id,
        categoria?.id
      );
      if (!data) {
        Alert.alert('Error add income');
        setLoading(false);
        return;
      }
    }

    defaultValues();
    router.push(Routes.home);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
    loadWallets();
  }, [pathname, text]);

  useEffect(() => {
    defaultValues()
  }, [pathname]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={isEnabled ? "trending-up" : "trending-down"} size={30} color={colors.white} />
        <Text style={styles.headerText}>Nova {text}</Text>

        <Switch
          trackColor={{ false: colors.white, true: colors.white }}
          thumbColor={isEnabled ? colors.green : colors.red}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{ flex: 1, marginRight: 20 }}
        />
      </View>

      <View style={styles.headerValue}>
        <Text style={styles.titleText}>Valor da {text}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.valueText}>R$ </Text>
          <TextInput
            style={styles.valueText}
            placeholder="0,00"
            placeholderTextColor={colors.white}
            keyboardType='numeric'
            value={value}
            onChangeText={setValue}
          />
        </View>
      </View>

      <View style={styles.body}>
        <View style={{ margin: 25, gap: 30 }}>

          <View style={styles.itemGrid}>
            <Entypo name="text" size={25} color={colors.gray} />
            <TextInput
              placeholder="Descrição"
              placeholderTextColor={colors.gray}
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.itemGrid}>
            <Fontisto name="date" size={25} color={colors.gray} />
            <Pressable
              style={[styles.input, { justifyContent: 'center' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ fontSize: 23, color: date ? '#000' : colors.gray }}>
                {date || 'Data'}
              </Text>
            </Pressable>
          </View>

          <TouchableOpacity style={styles.itemGrid} onPress={() => openModal("wallet")}>
            <AntDesign name="wallet" size={25} color={colors.gray} />
            <Text style={[styles.input, { color: wallet ? '#000' : colors.gray }]}>
              {wallet?.label || 'Carteira'}
            </Text>
          </TouchableOpacity>

          <CustomModal
            visible={modalVisibleWallet}
            onClose={() => setModalVisibleWallet(false)}
            onSelect={(item) => handleSelect(item, "wallet")}
            items={itemsWallet}
            title="Carteiras"
          />

          <TouchableOpacity style={styles.itemGrid} onPress={() => openModal("category")}>
            <AntDesign name="tagso" size={25} color={colors.gray} />
            <Text style={[styles.input, { color: categoria ? '#000' : colors.gray }]}>
              {categoria?.label || 'Categoria'}
            </Text>
          </TouchableOpacity>

          <CustomModal
            visible={modalVisibleCategory}
            onClose={() => setModalVisibleCategory(false)}
            onSelect={(item) => handleSelect(item, "category")}
            items={itemsCategory}
            title="Categorias"
          />

          {showDatePicker && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              onChange={handleDateSelect}
            />
          )}

          <TouchableOpacity onPress={() => handleAddTransacao(text)} style={{ alignSelf: 'center' }}>
            <Ionicons
              name="checkmark-circle"
              size={70}
              color={loading ? colors.green : colors.zinc} />
          </TouchableOpacity>

        </View>
      </View>
    </View >
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: colors.zinc,
  },
  header: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 20,
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
  },
  headerValue: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  titleText: {
    color: colors.white,
    fontSize: 15,
  },
  valueText: {
    color: colors.white,
    fontSize: 40,
  },
  itemGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    gap: 15,
    paddingBottom: 10
  },
  input: {
    flex: 1,
    fontSize: 23,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

});