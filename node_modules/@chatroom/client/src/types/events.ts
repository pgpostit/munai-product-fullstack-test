export interface Event<TData, TType = string> {
  type: TType,
  data: TData,
}