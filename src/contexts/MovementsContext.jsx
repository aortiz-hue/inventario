import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useInventory } from './InventoryContext';

const MovementsContext = createContext();

export const useMovements = () => useContext(MovementsContext);

export const MovementsProvider = ({ children }) => {
    const [movements, setMovements] = useState([]);
    const { products, refreshInventory } = useInventory();

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        const { data, error } = await supabase
            .from('movements')
            .select(`
        *,
        products (name, sku)
      `)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching movements:', error);
        } else {
            // Flatten structure for compatibility
            const formatted = data.map(m => ({
                ...m,
                productId: m.product_id,
                productName: m.products?.name || 'Producto Eliminado',
                productSku: m.products?.sku || '---'
            }));
            setMovements(formatted);
        }
    };

    const addMovement = async (movement) => {
        // 1. Insert movement
        const { data: movementData, error: movementError } = await supabase
            .from('movements')
            .insert([{
                product_id: movement.productId,
                type: movement.type,
                quantity: Number(movement.quantity),
                date: new Date().toISOString(),
                notes: movement.notes
            }])
            .select()
            .single();

        if (movementError) throw movementError;

        // 2. Update product stock
        // We fetch the current product stock first to be safe, or rely on what we have in context
        // Ideally this should be server-side, but client-side for now.
        const product = products.find(p => p.id === movement.productId);
        if (product) {
            const newStock = movement.type === 'IN'
                ? Number(product.stock) + Number(movement.quantity)
                : Number(product.stock) - Number(movement.quantity);

            const { error: stockError } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', movement.productId);

            if (stockError) console.error('Error updating stock:', stockError);
        }

        // Refresh movements list and inventory
        await fetchMovements();
        if (refreshInventory) await refreshInventory();
    };

    const value = {
        movements,
        addMovement
    };

    return (
        <MovementsContext.Provider value={value}>
            {children}
        </MovementsContext.Provider>
    );
};
