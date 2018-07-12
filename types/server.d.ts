export interface IExecutable<T> {
    exec(arg: T): boolean | void
}

export interface ILoadable<T> {
    load(arg: T): void
}
