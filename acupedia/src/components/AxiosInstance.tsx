import { resolveOfflineAxios } from 'mocks/offlineData';

/**
 * 오프라인 모드.
 * api.acupedia.co.kr 로 나가던 axios 인스턴스는 아래에 주석으로 남겨 두었습니다.
 * 로그인, 회원가입, 댓글, 관리자 저장 같은 변경 요청도 네트워크를 타지 않고
 * 로컬 샘플 응답을 반환합니다.
 */

// import Axios from 'axios';
// import { isMobile } from 'react-device-detect';
// import { toast } from 'react-toastify';
//
// const axiosInstance = Axios.create({
//   baseURL: 'https://api.acupedia.co.kr'
// });
// axiosInstance.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );
// axiosInstance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (!error.response) {
//       if (isMobile) {
//         alert('네트워크 에러');
//       } else {
//         toast.error('네트워크 에러');
//       }
//     } else {
//       console.log(error.response);
//       if (error.response.data.data.message) {
//         if (isMobile) {
//           alert(error.response.data.data.message);
//         } else {
//           toast.error(error.response.data.data.message);
//         }
//       } else {
//         if (isMobile) {
//           alert('오류가 발생하였습니다.');
//         } else {
//           toast.error('오류가 발생하였습니다.');
//         }
//       }
//       return Promise.reject(error);
//     }
//   }
// );

const offlineRequest = (url: string) => resolveOfflineAxios(url);

const axiosInstance = {
  get: (url: string, _config?: unknown) => offlineRequest(url),
  post: (url: string, _body?: unknown, _config?: unknown) => offlineRequest(url),
  put: (url: string, _body?: unknown, _config?: unknown) => offlineRequest(url),
  delete: (url: string, _config?: unknown) => offlineRequest(url),
  defaults: {
    withCredentials: false,
  },
};

export default axiosInstance;
