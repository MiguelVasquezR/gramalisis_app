import { ReactNode, createContext, useContext, useMemo, useReducer } from 'react';
import type { Entry } from '../lib/entries';

type AppState = {
  entries: Entry[];
  currentUser: User | null;
};

const initialState: AppState = {
  entries: [],
  currentUser: null,
};

type Action =
  | { type: 'SET_ENTRIES'; payload: Entry[] }
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'RESET' }
  | { type: 'SET_USER'; payload: User | null };

const AppStoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries] };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

type Props = {
  children: ReactNode;
};

export const AppStoreProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppDispatch = () => useContext(AppStoreContext).dispatch;
export const useAppSelector = <T,>(selector: (state: AppState) => T) =>
  selector(useContext(AppStoreContext).state);
