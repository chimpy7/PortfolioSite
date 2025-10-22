import { NextResponse } from "next/server";
import {
  getPortfolioByUsername,
  PortfolioData,
} from "../../../../../lib/portfolio";

interface RouteParams {
  params: {
    username: string;
  };
}

export async function GET(
  _req: Request,
  { params }: RouteParams
): Promise<NextResponse<PortfolioData | { error: string }>> {
  try {
    const portfolio = await getPortfolioByUsername(params.username);

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json(portfolio, { status: 200 });
  } catch (error) {
    console.error("Failed to load public portfolio:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
