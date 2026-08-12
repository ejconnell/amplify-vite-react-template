import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import Materials from "./Materials";
import { Shapes } from "./Shapes";
import { IMaterial, IMetal, IMetalFamily, IItem } from "./Types";

const metals: IMetal[] = [{
  name: "Brass",
  density: "0.0085",
  metalFamilyName: "Copper alloys",
  latheCostPerThousand: "0",
}];

const metalFamilies: IMetalFamily[] = [{ name: "Copper alloys" }];
const items: IItem[] = [];

function material(overrides: Partial<IMaterial> = {}): IMaterial {
  return {
    name: "Brass 2.0mm",
    isNameManual: false,
    metalName: "Brass",
    shapeName: Shapes[0].name,
    width: "2",
    innerWidth: "",
    rawCost: "100",
    markup: "10",
    flatMarkup: "1.25",
    ...overrides,
  };
}

function renderMaterials(materials: IMaterial[] = []) {
  const saveMaterial = vi.fn();
  const deleteMaterial = vi.fn();
  render(
    <Materials
      materials={materials}
      metals={metals}
      metalFamilies={metalFamilies}
      items={items}
      saveMaterial={saveMaterial}
      deleteMaterial={deleteMaterial}
    />,
  );
  return { saveMaterial, deleteMaterial };
}

function inputAfterLabel(label: string) {
  const element = screen.getByText(
    (_content, element) => element?.tagName === "LABEL" && element.textContent?.endsWith(label) === true,
  );
  return element.nextElementSibling as HTMLInputElement;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Materials", () => {
  it("loads and displays a material's required flat markup and effective cost", async () => {
    const user = userEvent.setup();
    renderMaterials([material()]);

    expect(screen.getByText("1.25")).toBeTruthy();
    expect(screen.getByText("111.2500")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /Load/ }));

    expect(inputAfterLabel("Flat Markup ($/kg):").value).toBe("1.25");
    expect(screen.getByText(
      (_content, element) => element?.tagName === "LABEL" && element.textContent?.includes("Effective Cost: 111.25") === true,
    )).toBeTruthy();
  });

  it("requires a numeric flat markup before saving", async () => {
    const user = userEvent.setup();
    const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    const { saveMaterial } = renderMaterials();

    await user.selectOptions(screen.getAllByRole("combobox")[3], "Brass");
    await user.type(inputAfterLabel("直徑 Diameter (mm):"), "2");
    await user.type(inputAfterLabel("Manufacturer Cost:"), "100");
    await user.clear(inputAfterLabel("Markup %:"));
    await user.type(inputAfterLabel("Markup %:"), "10");
    await user.clear(inputAfterLabel("Flat Markup ($/kg):"));
    await user.click(screen.getByRole("button", { name: /Save Material$/ }));

    expect(alert).toHaveBeenCalledWith("Need a numeric Flat Markup");
    expect(saveMaterial).not.toHaveBeenCalled();
  });

  it("imports five-column material rows including flat markup", async () => {
    const user = userEvent.setup();
    const { saveMaterial } = renderMaterials();

    await user.click(screen.getByRole("button", { name: /Administration/ }));
    fireEvent.change(screen.getByPlaceholderText(/This importer only supports/), {
      target: { value: "Brass\t2\t100\t10\t2.50" },
    });
    await user.click(screen.getByRole("button", { name: "Save Materials" }));

    expect(saveMaterial).toHaveBeenCalledWith(material({ flatMarkup: "2.50" }));
  });
});
