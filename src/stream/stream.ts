export interface Stream<T> {
  peek(): T
  next(): T
  eof(): boolean
}