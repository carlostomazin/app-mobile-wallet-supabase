import colors from '@/constants/colors';
import AntDesign from '@expo/vector-icons/AntDesign';

import { usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactionsByUserIdAndDate, getWalletsByUserId } from '@/src/utils/supabase_db';

export default function Home() {
  const { setAuth, user, userData } = useAuth();

  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const pathname = usePathname();

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  interface Transaction {
    id: string;
    description: string;
    value: number;
    category_name: string,
    wallet_name: string,
    type: string
    date: Date
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Changed order from ${year}-${day}-${month}
  };

  const fetchTransactions = async () => {
    if (!user) return;
    const startDate = formatDate(new Date(new Date().getFullYear(), selectedMonth, 1));
    const endDate = formatDate(new Date(new Date().getFullYear(), selectedMonth + 1, 0));
    const transactions = await getTransactionsByUserIdAndDate(user.id, startDate, endDate);
    setTransactions(transactions);
  };

  const calculateBalanceIncomeExpense = () => {
    const result = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.value;
        } else {
          acc.expense += transaction.value;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  
    setIncome(result.income);
    setExpense(Math.abs(result.expense));
    setBalance(result.income - Math.abs(result.expense));
  };

  useEffect(() => {
    calculateBalanceIncomeExpense();
    fetchTransactions();
  }, [pathname, selectedMonth]);

  useEffect(() => {
    calculateBalanceIncomeExpense();
  }, [transactions]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.monthSelector}
          onPress={() => setShowMonthPicker(true)}
        >
          <Text style={styles.headerText}>{months[selectedMonth]}</Text>
          <AntDesign name="down" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalView}>
          <FlatList
            data={months}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.monthItem}
                onPress={() => {
                  setSelectedMonth(index);
                  setShowMonthPicker(false);
                }}
              >
                <Text style={[
                  styles.monthItemText,
                  selectedMonth === index && styles.selectedMonth
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>


      <View style={styles.balanceContainer}>
        <Text style={styles.incomeExpenseText}>Saldo em contas</Text>
        <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>
      </View>

      <View style={styles.incomeExpenseContainer}>
        <View>
          <Text style={styles.incomeExpenseText}>Receitas</Text>
          <Text style={[styles.incomeExpenseValue, { color: colors.green }]}>R$ {income.toFixed(2)}</Text>
        </View>
        <View>
          <Text style={styles.incomeExpenseText}>Despesas</Text>
          <Text style={[styles.incomeExpenseValue, { color: colors.red }]}>R$ {expense.toFixed(2)}</Text>
        </View>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* <ScrollView style={{ flex: 1, backgroundColor: colors.white }}> */}
        <View style={styles.body}>


          <View style={styles.transactionsList}>
            <Text style={styles.transactionName}>Transções recentes</Text>
            <FlatList
              data={transactions.slice(0, 5)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <View style={styles.transactionIcon} />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionName}>{item.description}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: item.type === 'income' ? colors.green : colors.red }
                    ]}
                  >
                    R$ {Math.abs(item.value).toFixed(2)}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>


    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: colors.zinc,
  },
  header: {
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 20,
    alignSelf: 'center',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  incomeExpenseText: {
    fontSize: 15,
    color: colors.white,
  },
  incomeExpenseValue: {
    fontSize: 25,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd', // Placeholder icon background
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
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
  transactionsList: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 15,
    elevation: 5
  },
  monthSelector: {
    padding: 10,
    flexDirection: 'row',
    gap: 15
  },
  modalView: {
    margin: 20,
    marginTop: 100,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  monthItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthItemText: {
    fontSize: 16,
    color: colors.zinc,
    textAlign: 'center',
  },
  selectedMonth: {
    color: colors.green,
    fontWeight: 'bold',
  },
});