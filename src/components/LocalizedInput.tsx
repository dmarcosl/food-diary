import React from 'react';
import { useIntl } from 'react-intl';

interface LocalizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  translationId: string;
}

export const LocalizedInput: React.FC<LocalizedInputProps> = ({ translationId, ...props }) => {
  const intl = useIntl();
  
  return (
    <input
      {...props}
      placeholder={intl.formatMessage({ id: translationId })}
    />
  );
}; 