import useSWRCustom from "./useSWRCustom";
import {env} from "../configs/EnvironmentConfig";

export const usePost = (options) => {
  return useSWRCustom("/api/posts", "get", options);
}

export const useUser = (options) => {
  return useSWRCustom("/api/users", "get", options);
}

export const useRole = (options) => {
  return useSWRCustom("/api/roles", "get", options);
}

export const useReport = (options) => {
  return useSWRCustom("/api/reports", "get", options);
}

export const useRequest = (options) => {
  return useSWRCustom("/api/requests", "get", options);
}

export const useNote = (options) => {
  return useSWRCustom("/api/notes", "get", options);
}

export const useComments = (options) => {
  return useSWRCustom("/api/comments", "get", options);
}