import { atom, useSetAtom } from "jotai"

const loadingCount = atom(0);
const setCount = useSetAtom(loadingCount);
export const beforeLoadingHandler = () => setCount(c => c += 1);
export const afterLoadingHandler = () => setCount(c => c -= 1);

export const isLoading = atom((get) => get(loadingCount) > 0);
