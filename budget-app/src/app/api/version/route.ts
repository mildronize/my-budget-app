import { NextResponse } from "next/server";
import version from "@/version.json";
import { z } from "zod";

const queryParamsSchema = z.object({
  format: z.union([z.literal("json"), z.literal("text")]).default("text"),
});

type QueryParams = z.infer<typeof queryParamsSchema>;

/**
 * TODO: Accept any zod schema and validate the query parameters
 * @param url
 * @returns
 */

function parseSearchParam(url: string): QueryParams {
  const urlObj = new URL(url);
  const searchParams = Object.fromEntries(urlObj.searchParams.entries());

  // Validate the parameters according to the schema
  const parsedParams = queryParamsSchema.parse(searchParams);
  return parsedParams;
}

export async function GET(req: Request) {
  const format = parseSearchParam(req.url)?.format;
  if (format === "json") {
    return NextResponse.json({
      format,
      version: version,
    });
  }
  const formattedVersion =
    version.tag !== "latest"
      ? `v${version.major}.${version.minor}.${version.patch}-${version.tag}.${version.revision}`
      : `v${version.major}.${version.minor}.${version.patch}`;
  return NextResponse.json({
    format,
    version: formattedVersion,
  });
}
