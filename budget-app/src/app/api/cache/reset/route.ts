import { env } from "@/env";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      new URL(
        env.AZURE_FUNCTION_RESET_CACHE_PATH,
        env.NEXT_PUBLIC_AZURE_FUNCTION_URL
      ).toString()
    );
    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      { error: String(error) },
      {
        status: 500,
      }
    );
  }
}
