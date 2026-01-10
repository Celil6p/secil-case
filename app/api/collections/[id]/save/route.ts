import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    if (!body.collectionId || !Array.isArray(body.products)) {
      return NextResponse.json(
        { status: 400, message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Log the received payload (for case review)
    console.log("[Save Collection] Payload received:", {
      collectionId: body.collectionId,
      productCount: body.products.length,
      userId: session.user?.email,
    });

    // Validate product structure
    for (const product of body.products) {
      if (!product.productCode || !product.colorCode || typeof product.position !== "number") {
        return NextResponse.json(
          { status: 400, message: "Invalid product structure" },
          { status: 400 }
        );
      }
    }

    // In a real implementation, this would call the actual API endpoint
    // For this case study, we return a success response
    return NextResponse.json({
      status: 200,
      message: "Başarılı",
      data: {
        collectionId: body.collectionId,
        updatedProductsCount: body.products.length,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Save Collection] Error:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
