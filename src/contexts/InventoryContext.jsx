import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('name');

            if (productsError) throw productsError;
            setProducts(productsData);

            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (categoriesError) throw categoriesError;
            setCategories(categoriesData.map(c => c.name));
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (product) => {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: product.name,
                sku: product.sku,
                category: product.category,
                description: product.description,
                price: Number(product.price),
                cost: Number(product.cost),
                stock: Number(product.stock),
                min_stock: Number(product.minStock)
            }])
            .select()
            .single();

        if (error) throw error;
        setProducts(prev => [...prev, data]);
    };

    const updateProduct = async (id, updatedProduct) => {
        const { data, error } = await supabase
            .from('products')
            .update({
                name: updatedProduct.name,
                sku: updatedProduct.sku,
                category: updatedProduct.category,
                description: updatedProduct.description,
                price: Number(updatedProduct.price),
                cost: Number(updatedProduct.cost),
                stock: Number(updatedProduct.stock),
                min_stock: Number(updatedProduct.minStock)
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === id ? data : p));
    };

    const deleteProduct = async (id) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const getProduct = (id) => {
        return products.find(p => p.id === id);
    };

    const addCategory = async (categoryName) => {
        if (categories.includes(categoryName)) return;

        const { error } = await supabase
            .from('categories')
            .insert([{ name: categoryName }]);

        if (error) throw error;
        setCategories(prev => [...prev, categoryName]);
    };

    const deleteCategory = async (categoryName) => {
        const hasProducts = products.some(p => p.category === categoryName);
        if (hasProducts) {
            throw new Error(`No se puede eliminar la categoría "${categoryName}" porque tiene productos asignados.`);
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('name', categoryName);

        if (error) throw error;
        setCategories(prev => prev.filter(c => c !== categoryName));
    };

    const value = {
        products,
        categories,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        addCategory,
        deleteCategory,
        refreshInventory: fetchData
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};
