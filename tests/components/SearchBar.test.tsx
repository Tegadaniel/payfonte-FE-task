import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "@/contexts/I18nContext";
import { SearchBar } from "@/components/SearchBar";
import type { ReactNode } from "react";

function Wrapper({ children }: { children: ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

const defaultProps = {
  query: "",
  filterBy: "name" as const,
  onQueryChange: vi.fn(),
  onFilterChange: vi.fn(),
  total: 50,
  filtered: 50,
};

afterEach(() => {
  vi.clearAllMocks();
});

test("renders search input with correct placeholder", () => {
  render(<SearchBar {...defaultProps} />, { wrapper: Wrapper });
  expect(screen.getByPlaceholderText("Search by name…")).toBeInTheDocument();
});

test("calls onQueryChange when user types", async () => {
  const user = userEvent.setup();
  render(<SearchBar {...defaultProps} />, { wrapper: Wrapper });

  await user.type(screen.getByRole("textbox"), "nig");

  expect(defaultProps.onQueryChange).toHaveBeenCalled();
});

test("renders all four filter tabs", () => {
  render(<SearchBar {...defaultProps} />, { wrapper: Wrapper });
  expect(screen.getByRole("button", { name: "Name" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Code" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Currency" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Currency Code" })).toBeInTheDocument();
});

test("calls onFilterChange when a filter tab is clicked", async () => {
  const user = userEvent.setup();
  render(<SearchBar {...defaultProps} />, { wrapper: Wrapper });

  await user.click(screen.getByRole("button", { name: "Code" }));

  expect(defaultProps.onFilterChange).toHaveBeenCalledWith("code");
});

test("shows Clear button only when query is non-empty", async () => {
  const { rerender } = render(<SearchBar {...defaultProps} query="" />, { wrapper: Wrapper });
  expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();

  rerender(<SearchBar {...defaultProps} query="ghana" />);
  expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
});

test("calls onQueryChange with empty string when Clear is clicked", async () => {
  const user = userEvent.setup();
  render(<SearchBar {...defaultProps} query="ghana" />, { wrapper: Wrapper });

  await user.click(screen.getByRole("button", { name: "Clear" }));

  expect(defaultProps.onQueryChange).toHaveBeenCalledWith("");
});

test("shows total count when query is empty", () => {
  render(<SearchBar {...defaultProps} query="" total={50} filtered={50} />, { wrapper: Wrapper });
  expect(screen.getByText("50 countries")).toBeInTheDocument();
});

test("shows filtered count when query is active", () => {
  render(<SearchBar {...defaultProps} query="nig" total={50} filtered={3} />, { wrapper: Wrapper });
  expect(screen.getByText("3 of 50")).toBeInTheDocument();
});
