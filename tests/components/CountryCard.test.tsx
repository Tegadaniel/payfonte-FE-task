import { createRoot } from "react-dom/client";
import { act } from "react";
import { CountryCard } from "@/components/CountryCard";
import type { Country } from "@/types/country";

test("renders country card with phone code, currency, and flag", async () => {
  document.body.innerHTML = `<div id="root"></div>`;
  const container = document.getElementById("root");
  const root = createRoot(container!);

  const country: Country = {
    name: "Angola",
    code: "+244",
    currency: "Angolan kwanza",
    currencyCode: "AOA",
    currencyIcon: "Kz",
    locale: "AO",
    flag: "🇦🇴",
    flagURL: {
      png: "https://flagcdn.com/w320/ao.png",
      svg: "https://flagcdn.com/ao.svg",
      alt: "Flag of Angola",
    },
  };

  await act(async () => {
    root.render(<CountryCard country={country} onClick={() => {}} />);
  });

  expect(container?.textContent).toContain("Angola");
  expect(container?.textContent).toContain("+244");
  expect(container?.textContent).toContain("Angolan kwanza");
  expect(container?.textContent).toContain("AOA");
  expect(container?.querySelector("img[alt='Flag of Angola']")).toBeTruthy();

  await act(async () => {
    root.unmount();
  });
});
