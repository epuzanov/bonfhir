import { ContactDetail } from "@bonfhir/fhirtypes/r4b";
import { Formatter } from "../formatters";
import { codeFormatter } from "./code";
import { contactDetailFormatter } from "./contact-detail";
import { contactPointFormatter } from "./contact-point";
import { periodFormatter } from "./period";

describe("contact-detail", () => {
  const formatter = new Formatter()
    .register(contactDetailFormatter)
    .register(contactPointFormatter)
    .register(codeFormatter)
    .register(periodFormatter);

  it.each(<Array<[ContactDetail | undefined, string]>>[
    [undefined, ""],
    [{}, ""],
    [{ name: "Acme" }, "Acme"],
    [
      { name: "Acme", telecom: [{ system: "email", value: "a@acme.org" }] },
      "Acme, a@acme.org",
    ],
  ])("format %p => %p", (value, expected) => {
    expect(formatter.format("ContactDetail", value)).toEqual(expected);
  });
});
