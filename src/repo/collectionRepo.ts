import type { IResponse } from "@/database/interfaces/IResponse";
import prisma from "@/database/config";


// Override create method to include specific logic for collection
async function create(
  collectionData: any
): Promise<IResponse<any>> {
  try {
    const result = await prisma.collection.create({
      data: {
        ...collectionData,
        songs: {
          connect: collectionData.songIds?.map((id: string) => ({ id }))
        }
      },
      include: {
        songs: true
      }
    });

    return {
      success: true,
      message: "Collection created successfully",
      data: result
    };
  } catch (error: any) {
    console.error("Error creating collection:", error);
    return {
      success: false,
      message: `Failed to create collection: ${error.message}`
    };
  }
}

// Get collection by ID with songs
async function getWithSongs(id: string): Promise<IResponse<any>> {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: { songs: true }
    });

    if (!collection) {
      return {
        success: false,
        message: "Collection not found"
      };
    }

    return {
      success: true,
      message: "Collection with songs fetched successfully",
      data: collection
    };
  } catch (error: any) {
    console.error("Error fetching collection with songs:", error);
    return {
      success: false,
      message: `Failed to fetch collection with songs: ${error.message}`
    };
  }
}

// Get all collections
async function list(): Promise<IResponse<any[]>> {
  try {
    const collections = await prisma.collection.findMany({
      include: { songs: true }
    });

    return {
      success: true,
      message: "Collections fetched successfully",
      data: collections
    };
  } catch (error: any) {
    console.error("Error fetching collections:", error);
    return {
      success: false,
      message: `Failed to fetch collections: ${error.message}`
    };
  }
}