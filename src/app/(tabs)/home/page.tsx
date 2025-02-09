import colors from '@/constants/colors';
import { supabase } from '@/src/utils/supabase';
import AntDesign from '@expo/vector-icons/AntDesign';

import { usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';

export default function Home() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
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
    descricao: string;
    tipo: 'receita' | 'despesa';
    valor: number;
    created_at: string;
  }

  const fetchFinancialData = async () => {
    try {
      const startDate = new Date(new Date().getFullYear(), selectedMonth, 1).toISOString();
      const endDate = new Date(new Date().getFullYear(), selectedMonth + 1, 0).toISOString();

      // Fetch income (positive transactions)
      const { data: incomeData, error: incomeError } = await supabase
        .from('transacoes')
        .select('valor')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('tipo', 'receita')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (incomeError) throw incomeError;

      // Fetch expenses (negative transactions)
      const { data: expenseData, error: expenseError } = await supabase
        .from('transacoes')
        .select('valor')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('tipo', 'despesa')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (expenseError) throw expenseError;

      // Calculate totals
      const totalIncome = incomeData?.reduce((sum, item) => sum + item.valor, 0) || 0;
      const totalExpense = Math.abs(expenseData?.reduce((sum, item) => sum + item.valor, 0) || 0);

      setIncome(totalIncome);
      setExpense(totalExpense);
      setBalance(totalIncome - totalExpense);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const startDate = new Date(new Date().getFullYear(), selectedMonth, 1).toISOString();
      const endDate = new Date(new Date().getFullYear(), selectedMonth + 1, 0).toISOString();

      const { data: transactionsData, error } = await supabase
        .from('transacoes')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchFinancialData();
    fetchTransactions();
  }, [pathname, selectedMonth]);


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

      <View style={styles.transactionsList}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.transactionItem}>
              <View style={styles.transactionIcon} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>{item.descricao}</Text>
                <Text style={styles.transactionDescription}>{item.tipo}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: item.tipo === 'receita' ? colors.green : colors.red }
                ]}
              >
                R$ {Math.abs(item.valor).toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

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
  transactionsList: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
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