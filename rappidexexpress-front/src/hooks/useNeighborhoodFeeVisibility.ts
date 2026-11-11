import { useContext, useEffect, useState } from 'react';
import { DeliveryContext } from '../context/DeliveryContext';
import api from '../services/api';

/**
 * Exibe recursos de bairros para lojistas somente quando a cidade vinculada
 * usa a modalidade "por bairro". A API /city já restringe lojistas à sua cidade.
 * Na ausência de confirmação (carregamento/erro), mantém esses recursos ocultos.
 */
export function useNeighborhoodFeeVisibility(): boolean {
  const { token, permission } = useContext(DeliveryContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isShopkeeper = permission === 'shopkeeper' || permission === 'shopkeeperadmin';
    let active = true;

    setVisible(false);
    if (token && isShopkeeper) {
      api.get('/city', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          if (!active) return;
          const cities = Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data) ? response.data : [];
          setVisible(cities.length === 1 && cities[0]?.feeMode === 'neighborhood');
        })
        .catch(() => {
          if (active) setVisible(false);
        });
    }

    return () => { active = false; };
  }, [token, permission]);

  return visible;
}
