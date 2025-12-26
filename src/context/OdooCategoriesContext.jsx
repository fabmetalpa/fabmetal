// context/OdooCategoriesContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const OdooCategoriesContext = createContext();

export const OdooCategoriesProvider = ({ children, initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories || []);
  
  // Si no hay categorías iniciales, intentar obtenerlas del localStorage
  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      const stored = localStorage.getItem('odooCategories');
      if (stored) {
        try {
          setCategories(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing stored categories:', error);
        }
      }
    } else {
      // Guardar en localStorage para otras páginas
      localStorage.setItem('odooCategories', JSON.stringify(initialCategories));
    }
  }, [initialCategories]);

  // Función para actualizar categorías si es necesario
  const updateCategories = (newCategories) => {
    setCategories(newCategories);
    localStorage.setItem('odooCategories', JSON.stringify(newCategories));
  };

  return (
    <OdooCategoriesContext.Provider value={{ categories, updateCategories }}>
      {children}
    </OdooCategoriesContext.Provider>
  );
};

// Hook personalizado para usar las categorías
export const useOdooCategories = () => {
  const context = useContext(OdooCategoriesContext);
  if (!context) {
    throw new Error('useOdooCategories debe usarse dentro de OdooCategoriesProvider');
  }
  return context;
};