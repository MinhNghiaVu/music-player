// GENERIC REPOSITORY CLASS - for scalability, most CRUD repos are the same anyways

import prisma from "@/database/config";
import type { IResponse } from "@/database/interfaces/IResponse";

// Generic repository class
export class BaseRepository {
  protected modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  // CREATE: Insert new instance
  async create(data: any): Promise<IResponse<any>> {
    try {
      const result = await prisma[this.modelName].create({ data });
      return {
        success: true,
        message: "Record created successfully",
        data: result
      };
    } catch (error: any) {
      console.error("Error creating record:", error);
      return {
        success: false,
        message: `Failed to create record: ${error.message}`
      };
    }
  }

  // READ: Get records by field
  async getWhere(column: string, value: any): Promise极<IResponse<any[]>> {
    try {
      const result = await prisma[this.modelName].findMany({
        where: { [column]: value }
      });
      return {
        success: true,
        message: "Records fetched successfully",
        data: result
      };
    } catch (error: any) {
      console.error("Error fetching records:", error);
      return {
        success: false,
        message: `Failed to fetch records: ${error.message}`
      };
    }
  }

  // UPDATE: Update existing record
  async update(id: string, data: any): Promise<IResponse<any>> {
    try {
      const result = await prisma[this.modelName].update({
        where: { id },
        data
      });
      return {
        success: true,
        message: "Record updated successfully",
        data: result
      };
    } catch (error: any) {
      console.error("Error updating record:", error);
      return {
        success: false,
        message: `Failed to update record: ${error.message}`
      };
    }
  }

  // DELETE: Delete record by ID
  async delete(id: string): Promise<IResponse<any>> {
    try {
      const result = await prisma[this.modelName].delete({ where: { id } });
      return {
        success: true,
        message: "Record deleted successfully",
        data: result
      };
    } catch (error: any) {
      console.error("Error deleting record:", error);
      return {
        success: false,
        message: `Failed to delete record: ${error.message}`
      };
    }
  }
}
