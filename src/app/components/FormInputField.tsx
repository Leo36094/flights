import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';

export default function FormField(props: {
  label: string;
  inputType: string;
  inputValue: string;
  isError: boolean;
  isDisabled?: boolean;
  onInputChange: (e: React.FormEvent<HTMLInputElement>) => void;
}) {
  const { label, inputType, inputValue, isError, onInputChange, isDisabled } =
    props;

  return (
    <FormControl isInvalid={isError}>
      <FormLabel style={{ fontSize: '0.9rem' }}>{label}</FormLabel>
      <Input
        isDisabled={isDisabled}
        type={inputType}
        value={inputValue}
        onChange={(e) => onInputChange(e)}
      />
      {!isError && <FormErrorMessage>Email is required.</FormErrorMessage>}
    </FormControl>
  );
}
