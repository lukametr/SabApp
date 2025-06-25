import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';
import { ROUTES, FILE_TYPES, MAX_FILE_SIZE, ERROR_MESSAGES } from '@/constants';

export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(ROUTES.LOGIN);
    }
  }, [user, loading, router]);

  return { user, loading };
};

export const useForm = <T extends Record<string, unknown>>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
  };

  return {
    values,
    errors,
    setErrors,
    handleChange,
    reset,
  };
};

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(ERROR_MESSAGES.FILE_TOO_LARGE);
      setFile(null);
      return;
    }

    const fileType = selectedFile.type;
    if (!Object.values(FILE_TYPES).includes(fileType)) {
      setError(ERROR_MESSAGES.INVALID_FILE_TYPE);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  return {
    file,
    error,
    handleFileChange,
  };
}; 