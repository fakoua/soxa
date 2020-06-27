import { CancelToken } from "../cancel/CancelToken.ts";

export interface  Config {
    baseURL?: string,
    transformRequest?: Array<any>,
    transformResponse?: Array<any>,
    headers?: any,
    params?: any,
    paramsSerializer?: any,
    data?: any,
    timeout?: number,
    auth?: any,
    responseType?: string,
    responseEncoding?: string,
    onUploadProgress?: any,
    onDownloadProgress?: any,
    maxContentLength?: number,
    validateStatus?: any,
    maxRedirects?: number,
    socketPath?: string,
    cancelToken?: CancelToken,
}
