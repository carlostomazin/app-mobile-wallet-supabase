import { supabase } from "@/src/utils/supabase";

// Gerar código de compartilhamento
export const generateShareCode = async (usuarioId: number): Promise<string | null> => {
  try {
    // Gera um código aleatório (8 caracteres do hash MD5)
    const code = Math.random().toString(36).substring(2, 10);

    // Insere o código na tabela `account_sharing`
    const { data, error } = await supabase
      .from('account_sharing')
      .insert([
        {
          usuario_id: usuarioId,
          codigo_compartilhamento: code,
          usado: false,
        },
      ]);

    if (error) {
      console.error('Erro ao gerar o código:', error);
      return null;
    }

    return code;
  } catch (error) {
    console.error('Erro inesperado:', error);
    return null;
  }
};

// Verificar e associar o código ao usuário B
export const useShareCode = async (codigo: string, usuarioBId: number): Promise<boolean> => {
  try {
    // Verificar se o código existe e ainda não foi usado
    const { data, error } = await supabase
      .from('account_sharing')
      .select('id, usuario_id, usado')
      .eq('codigo_compartilhamento', codigo)
      .eq('usado', false)
      .single();  // Pega apenas o primeiro resultado

    if (error || !data) {
      console.error('Código não encontrado ou já utilizado');
      return false;
    }

    // Atualiza o código para indicar que foi usado e associa o usuário B
    const { error: updateError } = await supabase
      .from('account_sharing')
      .update({ usado: true, usuario_compartilhado_id: usuarioBId })
      .eq('id', data.id);

    if (updateError) {
      console.error('Erro ao atualizar o código:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado ao usar o código:', error);
    return false;
  }
};


// Inserir uma despesa
export const addExpense = async (value: number, description: string, date: string, walletId: string, userId: string, userShareId: string, categoryId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          value,
          description,
          date,
          wallet_id: walletId,
          user_id: userId,
          user_share_id: userShareId,
          category_id: categoryId,
        },
      ]);

    if (error) {
      console.error('Erro ao adicionar despesa:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado ao adicionar despesa:', error);
    return false;
  }
};

// Inserir uma receita
export const addIncome = async (value: number, description: string, date: string, walletId: string, userId: string, userShareId: string, categoryId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('incomes')
      .insert([
        {
          value,
          description,
          date,
          wallet_id: walletId,
          user_id: userId,
          user_share_id: userShareId,
          category_id: categoryId,
        },
      ]);

    if (error) {
      console.error('Erro ao adicionar receita:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado ao adicionar receita:', error);
    return false;
  }
};

// Recuperar todas as despesas de um usuário
export const getExpensesByUserId = async (usuarioId: string, limit: number = 100000) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select(`*,
        categories (*),
        wallets (*)
      `)
      .eq('user_id', usuarioId)
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar despesas:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Erro inesperado ao buscar despesas:', error);
    return [];
  }
};

// Recuperar todas as receitas de um usuário
export const getIncomesByUserId = async (usuarioId: string, limit: number = 100000) => {
  try {
    const { data, error } = await supabase
      .from('incomes')
      .select(`*,
        categories (*),
        wallets (*)
      `)
      .eq('user_id', usuarioId)
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar receitas:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Erro inesperado ao buscar receitas:', error);
    return [];
  }
};



export const getTransactionsByUserId = async (usuarioId: string, limit: number = 100000) => {
  try {
    const { data, error } = await supabase
      .from('view_transactions')
      .select('*')
      .eq('user_id', usuarioId)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro inesperado ao buscar transações:', error);
    return [];
  }
};

export const getTransactionsByUserIdAndDate = async (usuarioId: string, startDate: string, endDate: string, limit: number = 100000) => {
  try {
    const { data, error } = await supabase
      .from('view_transactions')
      .select('*')
      .eq('user_id', usuarioId)
      // .eq('date', '2025-02-01')
      // .lte('date', '2025-02-28')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro inesperado ao buscar transações:', error);
    return [];
  }
};

// Obter as carteiras de um usuário
export const getWalletsByUserId = async (usuarioId: string) => {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', usuarioId);

    if (error) {
      console.error('Erro ao buscar carteiras:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Erro inesperado ao buscar carteiras:', error);
    return [];
  }
};

// Recuperar um usuário pelo ID
export const getUserById = async (usuarioId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', usuarioId)
      .single();

    if (error) {
      console.error('Erro ao buscar o usuário:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro inesperado ao buscar o usuário:', error);
    return null;
  }
};

// Recuperar categorias pelo ID do usuário
export const getCategoriesByUserIdAndType = async (usuarioId: string, type: string) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', usuarioId)
      .eq('type', type);

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Erro inesperado ao buscar categorias:', error);
    return [];
  }
};
