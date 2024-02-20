export interface Response<T = any> {
  message: string;
  statusCode: number;
  data: T;
}

export interface Provier {
  name: string;
  id: string;
}
