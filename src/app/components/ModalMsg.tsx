import styles from "./modal.module.css";
import type { ModalType } from "../context/modalContext";

function ModalMsg(props: ModalType) {
  return (
    <div className={styles["modal-item"]}>
      <h1>{props.message}</h1>
    </div>
  );
}

export default ModalMsg;
