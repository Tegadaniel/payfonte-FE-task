import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("returns the initial value immediately", () => {
  const { result } = renderHook(() => useDebounce("hello", 300));
  expect(result.current).toBe("hello");
});

test("does not update before the delay has elapsed", () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
    initialProps: { value: "a" },
  });

  rerender({ value: "b" });
  act(() => { vi.advanceTimersByTime(100); });

  expect(result.current).toBe("a");
});

test("updates after the delay has elapsed", () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
    initialProps: { value: "a" },
  });

  rerender({ value: "b" });
  act(() => { vi.advanceTimersByTime(300); });

  expect(result.current).toBe("b");
});

test("only applies the last value when called rapidly", () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
    initialProps: { value: "a" },
  });

  rerender({ value: "b" });
  act(() => { vi.advanceTimersByTime(100); });
  rerender({ value: "c" });
  act(() => { vi.advanceTimersByTime(100); });
  rerender({ value: "d" });
  act(() => { vi.advanceTimersByTime(300); });

  expect(result.current).toBe("d");
});
