import React from 'react';
import { Text } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { useDebounce } from '../../src/hooks/useDebounce';

function DebounceTester({ value, delay }: { value: string; delay: number }) {
  const debounced = useDebounce(value, delay);
  return React.createElement(Text, null, debounced);
}

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    let tree: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      tree = TestRenderer.create(
        React.createElement(DebounceTester, { value: 'hello', delay: 300 })
      );
    });
    expect(tree!.root.findByType(Text).props.children).toBe('hello');
  });

  it('updates after delay when value changes', () => {
    let tree: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      tree = TestRenderer.create(
        React.createElement(DebounceTester, { value: 'a', delay: 300 })
      );
    });
    expect(tree!.root.findByType(Text).props.children).toBe('a');

    TestRenderer.act(() => {
      tree!.update(
        React.createElement(DebounceTester, { value: 'b', delay: 300 })
      );
    });
    expect(tree!.root.findByType(Text).props.children).toBe('a');

    TestRenderer.act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(tree!.root.findByType(Text).props.children).toBe('b');
  });
});
