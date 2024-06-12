import { FormControl, FormLabel, Textarea } from '@chakra-ui/react';

export default function FormField(props: {
  label: string;
  inputValue: string;
  isDisabled?: boolean;
  onInputChange?: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}) {
  const { label, inputValue, onInputChange, isDisabled } = props;

  return (
    <FormControl>
      <FormLabel style={{ fontSize: '0.9rem' }}>{label}</FormLabel>
      <Textarea
        isDisabled={isDisabled}
        value={inputValue}
        {...(onInputChange && { onChange: (e) => onInputChange(e) })}
      />
    </FormControl>
  );
}
