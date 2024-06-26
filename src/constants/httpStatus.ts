export const successfully = (data: any, message?: string) => {
  return {
    isError: false,
    statusCode: 200,
    message: message || 'Successful',
    data: data,
  };
};

export const badRequest = (statusCode: number, message?: string) => {
  return {
    isError: true,
    statusCode: statusCode || 400,
    message: message || 'Tài nguyên không hợp lệ',
  };
};

export const serverError = (messageError: string) => {
  return {
    isError: true,
    statusCode: 500,
    message: 'Lỗi hệ thống',
    detailError: messageError,
  };
};
