'use client';
import { useReducer } from 'react';
import { Container, Box, Center, Heading, Button } from '@chakra-ui/react';
import FormInputField from './components/FormInputField';
import FormTextareaField from './components/FormTextareaField';
import styles from './page.module.css';

enum FormFieldEnum {
  flightsNumber = 'flightsNumber',
  username = 'username',
  phone = 'phone',
  idNumber = 'idNumber',
  remark = 'remark',
}

type FormState = {
  flightsNumber: { value: string; isError: boolean };
  username: { value: string; isError: boolean };
  phone: { value: string; isError: boolean };
  idNumber: { value: string; isError: boolean };
  remark: { value: string; isError: boolean };
};

type FormAction = {
  type: 'update';
  field: FormFieldEnum;
  value: string;
};

const formState: FormState = {
  flightsNumber: { value: '', isError: false },
  username: { value: '', isError: false },
  phone: { value: '', isError: false },
  idNumber: { value: '', isError: false },
  remark: { value: '', isError: false },
};

const formInputFileds = (form: FormState) => {
  return [
    {
      label: '航班編號',
      inputType: 'text',
      inputValue: form.flightsNumber.value,
      isError: form.flightsNumber.isError,
      field: FormFieldEnum.flightsNumber,
    },
    {
      label: '姓名',
      inputType: 'text',
      inputValue: form.username.value,
      isError: form.username.isError,
      field: FormFieldEnum.username,
    },
    {
      label: '手機號碼',
      inputType: 'text',
      inputValue: form.phone.value,
      isError: form.phone.isError,
      field: FormFieldEnum.phone,
    },
    {
      label: '身分證字號',
      inputType: 'text',
      inputValue: form.idNumber.value,
      isError: form.idNumber.isError,
      field: FormFieldEnum.idNumber,
    },
    {
      label: '備註',
      inputType: 'textarea',
      inputValue: form.remark.value,
      isError: false,
      field: FormFieldEnum.remark,
    },
  ];
};

// rule for id & flights number
const ruleWithCharAndNum = /^[A-Za-z0-9]+$/;
const ruleWithPhone = /^[0-9]{10}$/;
// name rule only accept english and space
const ruleWithName = /^[A-Za-z\s]+$/;

export default function Home() {
  // set up useReducer for form
  const [form, dispatch] = useReducer(
    (state: FormState, action: FormAction) => {
      switch (action.type) {
        case 'update':
          const isValid = validateFormField(action.field, action.value);
          return {
            ...state,
            [action.field]: { value: action.value, isError: !isValid },
          };
        default:
          return state;
      }
    },
    formState,
  );

  function validateFormField(label: FormFieldEnum, value: string): boolean {
    switch (label) {
      case FormFieldEnum.flightsNumber:
        return ruleWithCharAndNum.test(value);
      case FormFieldEnum.username:
        return ruleWithName.test(value);
      case FormFieldEnum.phone:
        return ruleWithPhone.test(value);
      case FormFieldEnum.idNumber:
        return ruleWithCharAndNum.test(value);
      default:
        return true;
    }
  }
  const dropArea = '桃園國際機場 第一航廈';

  function submitForm() {
    const isValid = Object.values(form).every((field) => !field.isError);
    if (isValid) {
      // submit form
      console.log('submit form', form);
    } else {
      // show error message
      console.log('form is invalid');
    }
  }

  return (
    <Box p={4} className={styles.heading}>
      <Container>
        <Center mb={8}>
          <Heading as='h4' size='md'>
            送機行程
          </Heading>
        </Center>
        <Heading my={4} as='h6' size='sm'>
          送機計畫
        </Heading>
        <Box my={4}>
          <FormInputField
            isDisabled
            label='下車機場'
            inputType='text'
            inputValue={dropArea}
            isError={false}
            onInputChange={() => {}}
          />
        </Box>
        <Box my={4}>
          <FormInputField
            label={formInputFileds(form)[0].label}
            inputType='text'
            inputValue={form.flightsNumber.value}
            isError={form.flightsNumber.isError}
            onInputChange={(e) =>
              dispatch({
                type: 'update',
                field: FormFieldEnum.flightsNumber,
                value: e.currentTarget.value,
              })
            }
          />
        </Box>
        <Heading as='h6' size='sm'>
          旅客資訊
        </Heading>
        {formInputFileds(form)
          .slice(1, -1)
          .map((field) => (
            <Box my={4} key={field.field}>
              <FormInputField
                label={field.label}
                inputType={field.inputType}
                inputValue={field.inputValue}
                isError={field.isError}
                onInputChange={(e) =>
                  dispatch({
                    type: 'update',
                    field: field.field,
                    value: e.currentTarget.value,
                  })
                }
              />
            </Box>
          ))}
        <Box my={4}>
          <FormTextareaField
            label={formInputFileds(form).slice(-1)[0].label}
            inputValue={form.remark.value}
            onInputChange={(e) =>
              dispatch({
                type: 'update',
                field: FormFieldEnum.remark,
                value: e.currentTarget.value,
              })
            }
          />
        </Box>
        <Box my={4} onClick={submitForm}>
          <Button width='100%' colorScheme='blue'>
            下一步
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
