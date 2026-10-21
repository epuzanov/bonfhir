import { Formatter } from "../formatters";
import { MarkdownFormatterOptions, markdownFormatter } from "./markdown";

describe("markdown", () => {
  const formatter = new Formatter().register(markdownFormatter);

  it.each(<
    Array<
      [string | undefined | null, MarkdownFormatterOptions, string | undefined]
    >
  >[
    ["_456_", undefined, "_456_"],
    [
      "**234** _123_",
      { style: "html" },
      "<p><strong>234</strong> <em>123</em></p>",
    ],
    ["*234* _123_", { style: "bareString" }, "234 123"],
    ["H~2~O", { style: "html" }, "<p>H<sub>2</sub>O</p>"],
    ["x^2^", { style: "html" }, "<p>x<sup>2</sup></p>"],
    ["H~2~O", { style: "bareString" }, "H2O"],
    [
      "<script>alert(1)</script>",
      { style: "html" },
      "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
    ],
  ])("format %p %p => %p", (value, style, expected) => {
    expect(formatter.format("markdown", value, style)).toEqual(expected);
  });
});
