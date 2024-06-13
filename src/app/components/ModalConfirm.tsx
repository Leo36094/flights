import styles from "./modal.module.css";
import { Flex, Box, Button, Heading, Text } from "@chakra-ui/react";
import type { ModalType } from "../context/modalContext";

type ModalConfirm = ModalType & {
  submit: () => void;
  close: () => void;
};

export default function ModalConfirm(props: ModalConfirm) {
  const { submit, message, close } = props;
  const title = `查不到『${message}』航班資訊`;
  const desc = `請確認航班資訊、起飛時間等。你也可以直接填寫此航班作為機場接送資訊`;
  return (
    <div className={styles["modal-item"]}>
      <Flex direction="column">
        <Heading>{title}</Heading>
        <Text fontSize="md">{desc}</Text>
        <Box my={2}>
          <Button width="100%" colorScheme="blue" onClick={submit}>
            確認航班資訊並送出
          </Button>
        </Box>
        <Box my={2}>
          <Button width="100%" onClick={close}>
            重新填寫
          </Button>
        </Box>
      </Flex>
    </div>
  );
}
