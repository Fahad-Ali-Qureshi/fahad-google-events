import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {AppStrings} from './AppStrings';

let axiosClient = axios.create();
axiosClient.defaults.baseURL = AppStrings.BaseURL;
axiosClient.defaults.timeout = 20000;

let axiosClientWithoutAuth = axios.create();
axiosClientWithoutAuth.defaults.baseURL = AppStrings.BaseURL;
axiosClientWithoutAuth.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
axiosClientWithoutAuth.defaults.timeout = 20000;

export const isInternetConnected = async () => {
  let isConnected = false;
  try {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      isConnected = true;
    } else {
      isConnected = false;
      Toast.show({
        type: 'error',
        text1: AppStrings.InternetNotReachableText,
        text2: AppStrings.CHeckInternetConnectionMessage,
      });
    }
  } catch (error) {
  } finally {
    return isConnected;
  }
};

export const UpdateAxiosClientAuthorization = (token, remove = false) => {
  if (remove) {
    delete axiosClient.defaults.headers.common['Authorization'];
  } else {
    const tokenData = 'Bearer ' + token;
    axiosClient.defaults.headers.common['Authorization'] = tokenData;
  }
};

export const MakeGetCallWithoutAuthentication = async ControllerWithMethod => {
  if (await isInternetConnected()) {
    return await axiosClientWithoutAuth.get(ControllerWithMethod);
  }
};

export const MakeGetCall = async ControllerWithMethod => {
  if (await isInternetConnected()) {
    return await axiosClient.get(ControllerWithMethod);
  }
};

export const MakePostCallWithPrimitiveParams = async (
  ControllerWithMethod,
  includeAuth = false,
) => {
  if (await isInternetConnected()) {
    if (includeAuth) {
      return await axiosClient.post(`${ControllerWithMethod}`);
    } else {
      return await axiosClientWithoutAuth.post(`${ControllerWithMethod}`);
    }
  }
};

export const MakePostCallForSingleObj = async (
  ControllerWithMethod,
  data,
  includeAuth = true,
) => {
  if (await isInternetConnected()) {
    if (includeAuth) {
      return await axiosClient.post(`${ControllerWithMethod}`, data);
    } else {
      return await axiosClientWithoutAuth.post(`${ControllerWithMethod}`, data);
    }
  }
};

export const MakeDeleteCall = async ControllerWithMethod => {
  if (await isInternetConnected()) {
    return await axiosClient.delete(ControllerWithMethod);
  }
};

export const MakePutCall = async ControllerWithMethod => {
  if (await isInternetConnected()) {
    return await axiosClient.put(ControllerWithMethod);
  }
};

export const MakePutCallForSingleObj = async (ControllerWithMethod, data) => {
  if (await isInternetConnected()) {
    return await axiosClient.put(ControllerWithMethod, data);
  }
};
