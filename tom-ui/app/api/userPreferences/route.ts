import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(request: Request) {
  const { email, ethnicity, income, preferredSeason } = await request.json();

  try {
    await prisma.profile.update({
      where: {
        email: email,
      },
      data: {
        ethnicity: ethnicity.toString(),
        income: income.toString(),
        preferred_season: preferredSeason.toString(),
      },
    });

    return NextResponse.json("Success!", {
      status: 200,
    });
  } catch (e) {
    return NextResponse.json(
      { error: true, errorMessage: e.message },
      { status: 200 }
    );
  }
}
