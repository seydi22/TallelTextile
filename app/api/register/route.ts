import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  return new NextResponse(
    JSON.stringify({
      message: "Registration is disabled",
    }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }
  );
};