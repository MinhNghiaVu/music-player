// GENERIC REPOSITORY CLASS - for scalability, most CRUD repos are the same anyways

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Generic types - suitable for all tables
type TableName = keyof Database["public"]["Tables"]; // A table name that actually exists in the db
type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"]; // Rows of the table
type TableInsert<T extends TableName> = Database["public"]["Tables"][T]["Insert"]; // For Create
type TableUpdate<T extends TableName> = Database["public"]["Tables"][T]["Update"]; // For Update

// Generic repository class
export class BaseRepository<T extends TableName> {
  constructor(private tableName: T) {}

  // CREATE: Insert new instance
  async create(data: TableInsert<T>): Promise<TableRow<T>> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select("*")
      // .single(); // In case I want only one created

    if (error) {
      throw new Error(`Error creating ${this.tableName}: ${error.message}`);
    }

    return result;
  }