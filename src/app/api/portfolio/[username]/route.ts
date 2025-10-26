import { NextResponse } from "next/server";
import {
  getPortfolioByUsername,
  PortfolioData,
} from "../../../../../lib/portfolio";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse<PortfolioData | { error: string }>> {
  try {
    const { username } = await params;
    const portfolio = await getPortfolioByUsername(username);

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
