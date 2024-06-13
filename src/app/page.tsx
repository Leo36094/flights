"use client";
import {
  useReducer,
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  Container,
  Box,
  Center,
  Heading,
  Button,
} from "@chakra-ui/react";

import FormInputField from "./components/FormInputField";
import FormTextareaField from "./components/FormTextareaField";
import Modal from "./components/Modal";
import styles from "./page.module.css";
import useApi from "./hooks/useApi";

import { ModalContext, ModalEnum } from "./context/modalContext";
import type { Flight } from "./apiTypes";

enum FormFieldEnum {
  flightsNumber = "flightsNumber",
  username = "username",
  phone = "phone",
  idNumber = "idNumber",
  remark = "remark",
}

type FormField = {
  value: string;
  isError: boolean;
  required: boolean;
  rule?: RegExp;
};

type FormState = {
  flightsNumber: FormField;
  username: FormField;
  phone: FormField;
  idNumber: FormField;
  remark: FormField;
};

enum FormActionEnum {
  update = "update",
  error = "error",
  reset = "reset",
}

type FormAction = {
  type: FormActionEnum;
  field?: FormFieldEnum;
  value: string | boolean;
};

// rule for id & flights number
const ruleWithCharAndNum = /^[A-Za-z0-9]+$/;
// rule for any number
const ruleWithPhone = /^[0-9]*$/;
// name rule only accept english and space
const ruleWithName = /^[A-Za-z\s]+$/;
const dropArea = "桃園國際機場 第一航廈";
const endpoint =
  "https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/TPE?$orderby=ScheduleDepartureTime&$format=JSON";
const formState: FormState = {
  flightsNumber: {
    value: "",
    isError: false,
    required: true,
    rule: ruleWithCharAndNum,
  },
  username: {
    value: "",
    isError: false,
    required: true,
    rule: ruleWithName,
  },
  phone: {
    value: "",
    isError: false,
    required: true,
    rule: ruleWithPhone,
  },
  idNumber: {
    value: "",
    isError: false,
    required: true,
    rule: ruleWithCharAndNum,
  },
  remark: { value: "", isError: false, required: false },
};

const formInputFileds = (form: FormState) => {
  return [
    {
      label: "航班編號",
      inputType: "text",
      inputValue: form.flightsNumber.value,
      isError: form.flightsNumber.isError,
      field: FormFieldEnum.flightsNumber,
    },
    {
      label: "姓名",
      inputType: "text",
      inputValue: form.username.value,
      isError: form.username.isError,
      field: FormFieldEnum.username,
    },
    {
      label: "手機號碼",
      inputType: "text",
      inputValue: form.phone.value,
      isError: form.phone.isError,
      field: FormFieldEnum.phone,
    },
    {
      label: "身分證字號",
      inputType: "text",
      inputValue: form.idNumber.value,
      isError: form.idNumber.isError,
      field: FormFieldEnum.idNumber,
    },
    {
      label: "備註",
      inputType: "textarea",
      inputValue: form.remark.value,
      isError: false,
      field: FormFieldEnum.remark,
    },
  ];
};

export default function Home() {
  // set up useReducer for form
  const { openModal, openMessageModal, openConfirmModal } =
    useContext(ModalContext) || {};
  const [form, dispatch] = useReducer(
    (state: FormState, action: FormAction) => {
      switch (action.type) {
        case FormActionEnum.update:
          if (!action.field) return state;
          const isValid = validateFormField(
            action.field as FormFieldEnum,
            action.value as string
          );
          return {
            ...state,
            [action.field]: {
              ...state[action.field],
              value: action.value,
              isError: !isValid,
            },
          };
        case FormActionEnum.error:
          if (!action.field) return state;
          return {
            ...state,
            [action.field]: {
              ...state[action.field],
              isError: action.value as boolean,
            },
          };
        case FormActionEnum.reset:
          return formState;
        default:
          return state;
      }
    },
    formState
  );
  const { data, loading, error, fetchData, clearError } =
    useApi<Flight[]>();
  const requiredFields = useMemo(
    () =>
      formInputFileds(form)
        .filter((field) => {
          return form[field.field].required;
        })
        .map((field) => {
          return {
            field: field.field,
            value: field.inputValue,
            rule: form[field.field].rule as RegExp,
          };
        }),
    [form]
  );
  const updateField = (field: FormFieldEnum, value: string) => {
    dispatch({
      type: FormActionEnum.update,
      field: field,
      value: value,
    });
  };

  function validateFormField(
    label: FormFieldEnum,
    value: string
  ): boolean {
    const field = formState[label];
    if (field.required && value === "") {
      return false;
    }
    if (
      typeof field.rule !== "undefined" &&
      !field.rule.test(value)
    ) {
      return false;
    }
    return true;
  }
  const getErrorFields = (
    fields: {
      field: FormFieldEnum;
      value: string;
      rule: RegExp;
    }[]
  ): FormFieldEnum[] => {
    let errorFileds: FormFieldEnum[] = [];

    fields.forEach((field) => {
      if (field.value === "") {
        errorFileds.push(field.field);
      } else if (!field.rule.test(field.value)) {
        errorFileds.push(field.field);
      }
    });
    return errorFileds;
  };
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  const submitForm = useCallback(async () => {
    const errorFieldsList = getErrorFields(requiredFields);

    if (errorFieldsList.length === 0) {
      await fetchData(endpoint);
      setTriggerSubmit(true);
    } else {
      errorFieldsList.forEach((field) => {
        dispatch({ type: FormActionEnum.error, field, value: true });
      });
    }
  }, [requiredFields, fetchData]);
  const userFlight = useMemo(
    () => form.flightsNumber.value,
    [form.flightsNumber.value]
  );
  const canSubmit = useMemo(() => {
    return getErrorFields(requiredFields).length === 0;
  }, [requiredFields]);
  useEffect(() => {
    if (!canSubmit || !triggerSubmit) return;
    if (error) {
      if (openMessageModal) openMessageModal(error);
      clearError();
      return;
    }
    if (data && Array.isArray(data)) {
      let isFlightValid = false;
      for (const flight of data) {
        const { AirlineID, FlightNumber } = flight;
        if (AirlineID + FlightNumber === userFlight) {
          isFlightValid = true;
          break;
        }
      }
      if (!openModal || !openConfirmModal) return;
      if (isFlightValid) {
        openModal(ModalEnum.Success);
      } else {
        openConfirmModal(userFlight);
      }
      // reset form
      dispatch({
        type: FormActionEnum.reset,
        value: "",
      });
      setTriggerSubmit(false);
    }
  }, [
    error,
    canSubmit,
    triggerSubmit,
    data,
    openModal,
    userFlight,
    openMessageModal,
    openConfirmModal,
    clearError,
  ]);

  return (
    <>
      <Box p={4} className={styles.heading} maxH={"100vh"}>
        <Container>
          <Center mb={8}>
            <Heading as="h4" size="md">
              送機行程
            </Heading>
          </Center>
          <Heading my={4} as="h6" size="sm">
            送機計畫
          </Heading>
          <Box my={4}>
            <FormInputField
              isDisabled
              label="下車機場"
              inputType="text"
              inputValue={dropArea}
              isError={false}
              onInputChange={() => {}}
            />
          </Box>
          <Box my={4}>
            <FormInputField
              label={formInputFileds(form)[0].label}
              inputType="text"
              inputValue={form.flightsNumber.value}
              isError={form.flightsNumber.isError}
              onInputChange={(e) =>
                updateField(
                  FormFieldEnum.flightsNumber,
                  e.currentTarget.value
                )
              }
            />
          </Box>
          <Heading as="h6" size="sm">
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
                    updateField(field.field, e.currentTarget.value)
                  }
                />
              </Box>
            ))}
          <Box my={4}>
            <FormTextareaField
              label={formInputFileds(form).slice(-1)[0].label}
              inputValue={form.remark.value}
              onInputChange={(e) =>
                updateField(
                  FormFieldEnum.remark,
                  e.currentTarget.value
                )
              }
            />
          </Box>
          <Box my={4} onClick={submitForm}>
            <Button
              isLoading={loading}
              width="100%"
              colorScheme="blue"
            >
              下一步
            </Button>
          </Box>
        </Container>
      </Box>
      <Modal />
    </>
  );
}
