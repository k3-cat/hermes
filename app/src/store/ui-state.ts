import { atom, useSetAtom } from "jotai"

const ALoadingCount = atom(0);
const setCount = useSetAtom(ALoadingCount);
export const increaseLoadingCount = () => setCount(c => c += 1);
export const decreaseLoadingCount = () => setCount(c => c -= 1);

export const AIsLoading = atom((get) => get(ALoadingCount) > 0);
