import { Header } from './components/layouts/Header/Header';
import { Footer } from './components/layouts/Footer/Footer';
import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { useCategoriesStore } from './stores/categoriesStore';
import { Toaster } from 'sonner';
import { CartModal } from './components/cart/CartModal/CartModal';

export function AppLayout() {
  const { fetchCategories } = useCategoriesStore();
  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />

      <CartModal />
      <Toaster
        richColors={true}
        toastOptions={{
          style: {
            boxShadow: 'var(--small-shadow)',
            padding: '10px',
            backgroundColor: 'var(--bg-color)',
            border: 'none',
            color: 'var(--text-color)',
          },
        }}
      />
    </>
  );
}
