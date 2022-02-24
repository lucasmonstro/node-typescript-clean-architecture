export interface HttpRequest<T> {
  body?: T;
}

export interface HttpResponse<T> {
  statusCode: number;
  body?: T | unknown;
}
