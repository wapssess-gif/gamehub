import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        userId: true,
      },
    });

    if (!collection) {
      return Response.json({ error: "Collection not found" }, { status: 404 });
    }

    if (collection.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
