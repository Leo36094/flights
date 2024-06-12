import { createContext, useReducer, useCallback, useMemo } from 'react';

export enum ModalEnum {
  Confirm = 'ModalConfirm',
  Success = 'ModalSuccess',
}
export type ModalType = {
  type: ModalEnum;
  id: string;
};

export interface ModalContextType {
  modalStack: ModalType[];
  openModal: (type: ModalEnum) => void;
  popModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export enum ModalAction {
  Open = 'OPEN_MODAL',
  Pop = 'POP_MODAL',
}

function modalReducer(
  state: ModalType[],
  action: { type: ModalAction; modal?: ModalEnum; id?: string },
) {
  switch (action.type) {
    case ModalAction.Open:
      return [...state, { type: ModalEnum.Confirm, id: Date.now().toString() }];
    case ModalAction.Pop:
      return state.slice(0, -1);
    default:
      return state;
  }
}

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalStack, dispatch] = useReducer(modalReducer, []);

  const openModal = useCallback((type: ModalEnum) => {
    dispatch({
      type: ModalAction.Open,
      modal: type,
      id: Date.now().toString(),
    });
  }, []);
  const popModal = useCallback(() => {
    dispatch({ type: ModalAction.Pop });
  }, []);
  const value = useMemo(
    () => ({ modalStack, openModal, popModal }),
    [modalStack, openModal, popModal],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
