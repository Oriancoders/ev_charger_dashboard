import { useGlobalContext } from '../GlobalStates/GlobalState';
export function useApi() {
  const { token } = useGlobalContext();
  console.log("Token from Global State:", token);
  return token;
}