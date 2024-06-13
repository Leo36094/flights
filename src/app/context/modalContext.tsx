import {
  createContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";

export enum ModalEnum {
  Confirm = "ModalConfirm",
  Success = "ModalSuccess",
  Message = "ModalMsg",
}
export type ModalType = {
  type: ModalEnum;
  id: string;
  message?: string;
};

export interface ModalContextType {
  modalStack: ModalType[];
  openModal: (type: ModalEnum) => void;
  popModal: () => void;
  openMessageModal: (message: string) => void;
  openConfirmModal: (message: string) => void;
}

export const ModalContext = createContext<
  ModalContextType | undefined
>(undefined);

export enum ModalAction {
  Open = "OPEN_MODAL",
  Pop = "POP_MODAL",
  Message = "MESSAGE_MODAL",
  Confirm = "MESSAGE_CONFIRM",
}

function modalReducer(
  state: ModalType[],
  action: {
    type: ModalAction;
    modal?: ModalEnum;
    id?: string;
    message?: string;
  }
) {
  switch (action.type) {
    case ModalAction.Open:
      return [
        ...state,
        {
          type: action.modal as ModalEnum,
          id: Date.now().toString(),
        },
      ];
    case ModalAction.Pop:
      return state.slice(0, -1);
    case ModalAction.Message:
      return [
        ...state,
        {
          type: ModalEnum.Message,
          id: Date.now().toString(),
          message: action.message,
        },
      ];
    case ModalAction.Confirm:
      return [
        ...state,
        {
          type: ModalEnum.Confirm,
          id: Date.now().toString(),
          message: action.message,
        },
      ];
    default:
      return state;
  }
}

export const ModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [modalStack, dispatch] = useReducer(modalReducer, []);

  const openModal = useCallback((type: ModalEnum) => {
    dispatch({
      type: ModalAction.Open,
      modal: type,
      id: Date.now().toString(),
    });
  }, []);
  const openMessageModal = useCallback((message: string) => {
    dispatch({
      type: ModalAction.Message,
      modal: ModalEnum.Message,
      id: Date.now().toString(),
      message,
    });
  }, []);
  const openConfirmModal = useCallback((message: string) => {
    dispatch({
      type: ModalAction.Confirm,
      modal: ModalEnum.Confirm,
      id: Date.now().toString(),
      message,
    });
  }, []);
  const popModal = useCallback(() => {
    dispatch({ type: ModalAction.Pop });
  }, []);
  const value = useMemo(
    () => ({
      modalStack,
      openModal,
      popModal,
      openMessageModal,
      openConfirmModal,
    }),
    [
      modalStack,
      openModal,
      popModal,
      openMessageModal,
      openConfirmModal,
    ]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};
