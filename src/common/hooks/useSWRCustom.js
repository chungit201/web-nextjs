import useSWR from "swr";
import sendRequest from "../services/RequestService";

export default function useSWRCustom( key, method, option = {}, shouldFetch = true) {
  const {data, mutate, error} = useSWR(shouldFetch? [key, method, option] : null, sendRequest)
  const loading = !data && !error;
  return {
    loading,
    data,
    error,
    mutate
  }
}
