import { Attachment } from "@bonfhir/fhirtypes/r5";
import { Formatter } from "../formatters";
import { attachmentFormatter } from "./attachment";

describe("attachment", () => {
  const formatter = new Formatter().register(attachmentFormatter);

  it.each(<Array<[Attachment | undefined, string]>>[
    [undefined, ""],
    [{}, ""],
    [{ title: "Report" }, "Report"],
    [{ url: "https://acme.org/report.pdf" }, "https://acme.org/report.pdf"],
    [{ contentType: "application/pdf" }, "application/pdf"],
  ])("format %p => %p", (value, expected) => {
    expect(formatter.format("Attachment", value)).toEqual(expected);
  });

  it("can include the content type", () => {
    expect(
      formatter.format(
        "Attachment",
        { title: "Report", contentType: "application/pdf" },
        { includeContentType: true },
      ),
    ).toEqual("Report (application/pdf)");
  });
});
