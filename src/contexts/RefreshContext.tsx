import { createContext, useContext, useState, useCallback } from 'react';

interface RefreshContextType {
  refreshUsers: () => void;
  refreshOrders: () => void;
  refreshProducts: () => void;
  registerUsersRefresh: (fn: () => void) => void;
  registerOrdersRefresh: (fn: () => void) => void;
  registerProductsRefresh: (fn: () => void) => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [usersRefreshFn, setUsersRefreshFn] = useState<(() => void) | null>(null);
  const [ordersRefreshFn, setOrdersRefreshFn] = useState<(() => void) | null>(null);
  const [productsRefreshFn, setProductsRefreshFn] = useState<(() => void) | null>(null);

  const refreshUsers = useCallback(() => {
    usersRefreshFn?.();
  }, [usersRefreshFn]);

  const refreshOrders = useCallback(() => {
    ordersRefreshFn?.();
  }, [ordersRefreshFn]);

  const refreshProducts = useCallback(() => {
    productsRefreshFn?.();
  }, [productsRefreshFn]);

  return (
    <RefreshContext.Provider
      value={{
        refreshUsers,
        refreshOrders,
        refreshProducts,
        registerUsersRefresh: setUsersRefreshFn,
        registerOrdersRefresh: setOrdersRefreshFn,
        registerProductsRefresh: setProductsRefreshFn,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within RefreshProvider');
  }
  return context;
}




