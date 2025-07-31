// GENERIC REPOSITORY CLASS - for scalability, most CRUD repos are the same anyways

import { supabase } from "@/database/client";
import type { Database } from "@/database/types";
import type { IResponse } from "@/database/interfaces/IResponse";

// Generic types - suitable for all tables
type TableName = keyof Database["public"]["Tables"]; // A table name that actually exists in the db
type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"]; // Rows of the table
type TableInsert<T extends TableName> = Database["public"]["Tables"][T]["Insert"]; // For Create
type TableUpdate<T extends TableName> = Database["public"]["Tables"][T]["Update"]; // For Update

// Generic repository class
export class BaseRepository<T extends TableName> {
  constructor(private tableName: T) {}

  // CREATE: Insert new instance
  async create(data: TableInsert<T>): Promise<IResponse<TableRow<T>>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert(data)
        .select("*");

      if (error) {
        console.error(`Error creating ${this.tableName}:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return {
          success: false,
          message: `Failed to create ${this.tableName}: ${error.message}`
        };
      }

      // Supabase .insert().select("*") returns an array of rows
      if (!result || result.length === 0) {
        console.error(`No row returned after inserting into ${this.tableName}`);
        return {
          success: false,
          message: `No row returned after creating ${this.tableName}`
        };
      }

      return {
        success: true,
        message: `${this.tableName} created successfully`,
        data: result[0]
      };
    } catch (error) {
      console.error(`Unexpected error creating ${this.tableName}:`, error);
      return {
        success: false,
        message: `Unexpected error occurred while creating ${this.tableName}`
      };
    }
  }

  // READ: Get records
  async getWhere(column: string, value: any): Promise<IResponse<TableRow<T>[]>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq(column, value);

      if (error) {
        console.error(`Error fetching ${this.tableName} where ${column} = ${value}:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return {
          success: false,
          message: `Failed to fetch ${this.tableName} where ${column} = ${value}: ${error.message}`
        };
      }

      return {
        success: true,
        message: `${this.tableName} fetched successfully`,
        data: result || []
      };
    } catch (error) {
      console.error(`Unexpected error fetching ${this.tableName} where ${column} = ${value}:`, error);
      return {
        success: false,
        message: `Unexpected error occurred while fetching ${this.tableName}`
      };
    }
  }

  // UPDATE: Update existing record
  async update(id: string | number, data: TableUpdate<T>): Promise<IResponse<TableRow<T>>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error(`Error updating ${this.tableName} with ID ${id}:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return {
          success: false,
          message: `Failed to update ${this.tableName} with ID ${id}: ${error.message}`
        };
      }

      if (!result) {
        return {
          success: false,
          message: `${this.tableName} with ID ${id} not found or no changes made`
        };
      }

      return {
        success: true,
        message: `${this.tableName} updated successfully`,
        data: result
      };
    } catch (error) {
      console.error(`Unexpected error updating ${this.tableName} with ID ${id}:`, error);
      return {
        success: false,
        message: `Unexpected error occurred while updating ${this.tableName} with ID ${id}`
      };
    }
  }

  // DELETE: Delete record by ID
  async delete(id: string | number): Promise<IResponse<TableRow<T>>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .delete()
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error(`Error deleting ${this.tableName} with ID ${id}:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return {
          success: false,
          message: `Failed to delete ${this.tableName} with ID ${id}: ${error.message}`
        };
      }

      if (!result) {
        return {
          success: false,
          message: `${this.tableName} with ID ${id} not found`
        };
      }

      return {
        success: true,
        message: `${this.tableName} deleted successfully`,
        data: result
      };
    } catch (error) {
      console.error(`Unexpected error deleting ${this.tableName} with ID ${id}:`, error);
      return {
        success: false,
        message: `Unexpected error occurred while deleting ${this.tableName} with ID ${id}`
      };
    }
  }
}
