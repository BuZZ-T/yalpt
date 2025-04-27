import type { TextFunction } from '../../types/printer.types';

export function isTextFunction(value: string | TextFunction | undefined): value is TextFunction {
    return typeof value === 'function';
}

export function isArrayOfArrays<T>(value: Array<T> | Array<Array<T>>): value is Array<Array<T>> {
    return Array.isArray(value[0]);
}
