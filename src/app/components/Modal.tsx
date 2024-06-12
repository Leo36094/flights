'use client';
import { useContext } from 'react';
import { ModalContext, ModalEnum } from '../context/modalContext';
import styles from './modal.module.css';
import ModalConfirm from './ModalConfirm';
import ModalSuccess from './ModalSuccess';

export default function Modal() {
  const { modalStack, popModal } = useContext(ModalContext) || { modalStack: [] };
  const components: Record<ModalEnum, () => JSX.Element> = {
    [ModalEnum.Confirm]: () => <ModalConfirm />,
    [ModalEnum.Success]: () => <ModalSuccess />,
  };

  return modalStack.length === 0 ? null : (
    <div className={styles.modals}>
      <div className={styles['modal-mask']} onClick={popModal}></div>
      {modalStack.map((modal, index) => {
        const CurrentModal = components[modal.type];
        return <CurrentModal key={index} />;
      })}
    </div>
  );
}
