import { CodeableReference } from "@bonfhir/fhirtypes/r4b";
import { Formatter } from "../formatters";
import { codeFormatter } from "./code";
import { codeableConceptFormatter } from "./codeable-concept";
import { codeableReferenceFormatter } from "./codeable-reference";
import { codingFormatter } from "./coding";
import { identifierFormatter } from "./identifier";
import { periodFormatter } from "./period";
import { referenceFormatter } from "./reference";

describe("codeable-reference", () => {
  const formatter = new Formatter()
    .register(codeableReferenceFormatter)
    .register(referenceFormatter)
    .register(codeableConceptFormatter)
    .register(codeableConceptFormatter)
    .register(codeFormatter)
    .register(codingFormatter)
    .register(identifierFormatter)
    .register(periodFormatter);

  it.each(<Array<[CodeableReference | undefined, string]>>[
    [undefined, ""],
    [{}, ""],
    [{ reference: { display: "Acme, Inc." } }, "Acme, Inc."],
    [{ reference: { reference: "Organization/0" } }, "Organization/0"],
    [{ concept: { text: "Headache" } }, "Headache"],
    [
      { reference: { display: "Acme, Inc." }, concept: { text: "Headache" } },
      "Acme, Inc. - Headache",
    ],
  ])("format %p => %p", (value, expected) => {
    expect(formatter.format("CodeableReference", value)).toEqual(expected);
  });

  it("prefers the concept when preferReference is false", () => {
    expect(
      formatter.format(
        "CodeableReference",
        { reference: { display: "Acme, Inc." }, concept: { text: "Headache" } },
        { preferReference: false },
      ),
    ).toEqual("Headache - Acme, Inc.");
  });
});
