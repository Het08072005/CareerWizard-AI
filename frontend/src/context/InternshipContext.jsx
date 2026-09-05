import { useCallback, useEffect, useState } from 'react';
import { getInternshipDashboard } from '../api/internshipApi';
import { InternshipContext } from './internshipContextValue';

export function InternshipProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getInternshipDashboard());
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Internship workspace could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return (
    <InternshipContext.Provider value={{ data, loading, error, reload }}>
      {children}
    </InternshipContext.Provider>
  );
}
