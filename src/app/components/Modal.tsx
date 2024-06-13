"use client";
import { useContext } from "react";
import { ModalContext, ModalEnum } from "../context/modalContext";
import styles from "./modal.module.css";
import ModalConfirm from "./ModalConfirm";
import ModalSuccess from "./ModalSuccess";
import ModalMsg from "./ModalMsg";
import type { ModalType } from "../context/modalContext";

export default function Modal() {
  const { modalStack, popModal, openModal } = useContext(
    ModalContext
  ) || {
    modalStack: [],
  };
  const redirectToSucess = () => {
    if (!openModal || !popModal) return;
    popModal();
    openModal(ModalEnum.Success);
  };

  const components: Record<
    ModalEnum,
    (props: ModalType) => JSX.Element
  > = {
    [ModalEnum.Confirm]: (props: ModalType) => (
      <ModalConfirm
        submit={() => redirectToSucess()}
        close={() => popModal && popModal()}
        {...props}
      />
    ),
    [ModalEnum.Success]: () => <ModalSuccess />,
    [ModalEnum.Message]: (props: ModalType) => (
      <ModalMsg {...props} />
    ),
  };

  return modalStack.length === 0 ? null : (
    <div className={styles.modals}>
      <div className={styles["modal-mask"]} onClick={popModal}></div>
      {modalStack.map((modal, index) => {
        const CurrentModal = components[modal.type];
        return (
          modalStack.length === index + 1 && (
            <CurrentModal key={modal.id} {...modal} />
          )
        );
      })}
    </div>
  );
}
