import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ProductCard } from '../../src/components/ProductCard';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  description: 'Test desc',
  price: 99.99,
  thumbnail: 'https://example.com/img.jpg',
};

describe('ProductCard', () => {
  it('renders without crashing', () => {
    const onPress = jest.fn();
    let tree: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      tree = TestRenderer.create(
        React.createElement(ProductCard, {
          product: mockProduct,
          onPress,
        })
      );
    });
    expect(tree!.root).toBeTruthy();
  });

  it('renders with favorite star when onFavoritePress provided', () => {
    const onPress = jest.fn();
    const onFavoritePress = jest.fn();
    let tree: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      tree = TestRenderer.create(
        React.createElement(ProductCard, {
          product: mockProduct,
          onPress,
          isFavorite: true,
          onFavoritePress,
        })
      );
    });
    expect(tree!.root).toBeTruthy();
  });
});
