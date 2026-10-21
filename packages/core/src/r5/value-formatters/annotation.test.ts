import { Annotation } from "@bonfhir/fhirtypes/r5";
import { Formatter } from "../formatters";
import { annotationFormatter } from "./annotation";

describe("annotation", () => {
  const formatter = new Formatter().register(annotationFormatter);

  it.each(<Array<[Annotation | undefined, string]>>[
    [undefined, ""],
    [{}, ""],
    [{ text: "A note" }, "A note"],
    [{ text: "A note", authorString: "Dr Who" }, "A note"],
  ])("format %p => %p", (value, expected) => {
    expect(formatter.format("Annotation", value)).toEqual(expected);
  });

  it("includes the author and time in full style", () => {
    expect(
      formatter.format(
        "Annotation",
        { text: "A note", authorString: "Dr Who", time: "2022-01-02" },
        { style: "full" },
      ),
    ).toEqual("A note - Dr Who - 2022-01-02");
  });
});
