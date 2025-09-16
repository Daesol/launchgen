// Performance Optimization Utilities

import React, { lazy, ComponentType, Suspense } from 'react';
import { memo, useMemo, useCallback } from 'react';

// Lazy Loading Components
export const LazyPageEditor = lazy(() => import('@/components/pages/dashboard/editor/PageEditor'));
export const LazyPageAnalytics = lazy(() => import('@/components/pages/dashboard/analytics/PageAnalytics'));
export const LazyDashboardClient = lazy(() => import('@/components/pages/dashboard/dashboard/DashboardClient'));

// Lazy Loading with Error Boundary
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ComponentType
) {
  const LazyComponent = lazy(importFunc);
  
  return memo(function LazyWrapper(props: any) {
    return React.createElement(LazyComponent, props);
  });
}

// Memoization Utilities
export function createMemoizedComponent<T extends ComponentType<any>>(
  Component: T,
  areEqual?: (prevProps: any, nextProps: any) => boolean
): T {
  return memo(Component, areEqual) as unknown as T;
}

// Custom Hooks for Performance
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

// Debounced Hook
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  return useMemoizedCallback(
    ((...args: Parameters<T>) => {
      const timeoutId = setTimeout(() => callback(...args), delay);
      return () => clearTimeout(timeoutId);
    }) as T,
    [callback, delay, ...deps]
  );
}

// Throttled Hook
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const lastCall = useMemo(() => ({ current: 0 }), []);
  
  return useMemoizedCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay, ...deps]
  );
}

// Virtual Scrolling Hook
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    
    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
}

// Intersection Observer Hook
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);
  
  return { isIntersecting, hasIntersected };
}

// Performance Monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }
  
  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    return fn().finally(() => {
      this.endTiming(label);
    });
  }
  
  measure<T>(label: string, fn: () => T): T {
    this.startTiming(label);
    const result = fn();
    this.endTiming(label);
    return result;
  }
}

// Export performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React.memo with custom comparison
export function createShallowEqualMemo<T extends ComponentType<any>>(
  Component: T
): T {
  return memo(Component, (prevProps, nextProps) => {
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) return false;
    
    return prevKeys.every(key => {
      const prevValue = prevProps[key];
      const nextValue = nextProps[key];
      
      if (prevValue === nextValue) return true;
      if (prevValue == null || nextValue == null) return false;
      
      // Handle arrays
      if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
        return prevValue.length === nextValue.length &&
               prevValue.every((item: any, index: number) => item === nextValue[index]);
      }
      
      // Handle objects
      if (typeof prevValue === 'object' && typeof nextValue === 'object') {
        return JSON.stringify(prevValue) === JSON.stringify(nextValue);
      }
      
      return false;
    });
  }) as unknown as T;
}

// Import React hooks
import { useState, useEffect } from 'react';
