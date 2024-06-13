import styles from "./modal.module.css";
import { Heading, Flex } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { memo } from "react";

function ModalSuccess() {
  return (
    <div className={styles["modal-item"]}>
      <Flex direction="column" align="center" flexGrow="grow">
        <CheckCircleIcon w={12} h={12} color="green.500" />
        <Heading as="h2" size="lg" mt={4}>
          Success
        </Heading>
      </Flex>
    </div>
  );
}
export default memo(ModalSuccess);
