import { describe, expect, it } from 'vitest';
import { cn } from '../utils';

describe('cn()', () => {
    it('merges class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes via clsx', () => {
        expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
    });

    it('resolves tailwind conflicts with tailwind-merge', () => {
        expect(cn('p-4', 'p-2')).toBe('p-2');
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('handles empty inputs', () => {
        expect(cn()).toBe('');
        expect(cn('')).toBe('');
    });

    it('handles arrays and objects (clsx feature)', () => {
        expect(cn(['foo', 'bar'])).toBe('foo bar');
        expect(cn({ foo: true, bar: false })).toBe('foo');
    });
});
