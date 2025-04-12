import { TextFunction } from '../../types/printer.types';

export function isTextFunction(value: string | TextFunction | undefined): value is TextFunction {
    return typeof value === 'function'
}
