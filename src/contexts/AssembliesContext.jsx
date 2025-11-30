import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useInventory } from './InventoryContext';
import { useMovements } from './MovementsContext';

const AssembliesContext = createContext();

export const useAssemblies = () => useContext(AssembliesContext);

export const AssembliesProvider = ({ children }) => {
    const [assemblies, setAssemblies] = useState([]);
    const { products } = useInventory();
    const { addMovement } = useMovements();

    useEffect(() => {
        fetchAssemblies();
    }, []);

    const fetchAssemblies = async () => {
        try {
            const { data, error } = await supabase
                .from('assemblies')
                .select(`
        *,
        products (name, sku),
        assembly_components (
          component_id,
          quantity,
          products (name, sku)
        )
      `)
                .order('name');

            if (error) {
                console.error('Error fetching assemblies:', error);
                setAssemblies([]);
            } else {
                // Format data to match existing structure
                const formatted = (Array.isArray(data) ? data : []).map(a => ({
                    id: a.id,
                    name: a.name,
                    productId: a.product_id,
                    productName: a.products?.name,
                    components: a.assembly_components ? a.assembly_components.map(ac => ({
                        productId: ac.component_id,
                        quantity: ac.quantity,
                        productName: ac.products?.name
                    })) : []
                }));
                setAssemblies(formatted);
            }
        } catch (error) {
            console.error('Error in fetchAssemblies:', error);
            setAssemblies([]);
        }
    };

    const addAssembly = async (assembly) => {
        // 1. Insert Assembly
        const { data: assemblyData, error: assemblyError } = await supabase
            .from('assemblies')
            .insert([{
                name: assembly.name,
                product_id: assembly.productId
            }])
            .select()
            .single();

        if (assemblyError) throw assemblyError;

        // 2. Insert Components
        const componentsToInsert = assembly.components.map(c => ({
            assembly_id: assemblyData.id,
            component_id: c.productId,
            quantity: Number(c.quantity)
        }));

        const { error: componentsError } = await supabase
            .from('assembly_components')
            .insert(componentsToInsert);

        if (componentsError) throw componentsError;

        await fetchAssemblies();
    };

    const deleteAssembly = async (id) => {
        const { error } = await supabase
            .from('assemblies')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setAssemblies(prev => prev.filter(a => a.id !== id));
    };

    const produceAssembly = async (assemblyId, quantity) => {
        const assembly = assemblies.find(a => a.id === assemblyId);
        if (!assembly) throw new Error('Ensamble no encontrado');
        if (!addMovement) throw new Error('Sistema de movimientos no disponible');

        // 1. Add movement for the resulting product (IN)
        await addMovement({
            productId: assembly.productId,
            type: 'IN',
            quantity: quantity,
            notes: `Producción de ensamble: ${assembly.name}`
        });

        // 2. Add movements for components (OUT)
        for (const component of assembly.components) {
            await addMovement({
                productId: component.productId,
                type: 'OUT',
                quantity: component.quantity * quantity,
                notes: `Componente para ensamble: ${assembly.name}`
            });
        }
    };

    const value = {
        assemblies,
        addAssembly,
        deleteAssembly,
        produceAssembly
    };

    return (
        <AssembliesContext.Provider value={value}>
            {children}
        </AssembliesContext.Provider>
    );
};
