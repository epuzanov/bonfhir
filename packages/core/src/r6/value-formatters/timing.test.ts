import { Timing } from "@bonfhir/fhirtypes/r6";
import { Formatter } from "../formatters";
import { codeFormatter } from "./code";
import { integerFormatter } from "./integer";
import { periodFormatter } from "./period";
import { timingFormatter } from "./timing";

describe("timing", () => {
  const formatter = new Formatter()
    .register(timingFormatter)
    .register(codeFormatter)
    .register(integerFormatter)
    .register(periodFormatter);

  it.each(<Array<[Timing | undefined, string]>>[
    [undefined, ""],
    [{}, ""],
    [{ code: { code: "BID" } }, "BID"],
    [{ code: { text: "Twice a day" } }, "Twice a day"],
  ])("format %p => %p", (value, expected) => {
    expect(formatter.format("Timing", value)).toEqual(expected);
  });

  it("renders the repeat information", () => {
    expect(
      formatter.format(
        "Timing",
        { repeat: { count: 3, period: 1, periodUnit: "d" } },
        { style: "repeat" },
      ),
    ).toEqual("3 times per 1 d");
  });
});
