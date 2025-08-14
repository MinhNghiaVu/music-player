import { PrismaClient, Prisma } from '@prisma/client';
import { 
  BaseRepository, 
  PaginatedResult, 
  RepositoryOptions, 
  FilterOptions,
  RepositoryError,
  NotFoundError,
  DuplicateError
} from './types';
import { logger } from '../utils/logger';
import prisma from '../database/config';

export abstract class AbstractBaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereUniqueInput
> implements BaseRepository<T, CreateInput, UpdateInput, WhereUniqueInput> {
  
  protected prisma: PrismaClient;
  protected model: any;
  protected modelName: string;

  constructor(modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
    this.model = (this.prisma as any)[modelName];
  }

  async create(data: CreateInput): Promise<T> {
    try {
      logger.info(`Creating ${this.modelName}`, { data });
      const result = await this.model.create({ data });
      logger.info(`${this.modelName} created successfully`, { id: result.id });
      return result;
    } catch (error) {
      this.handlePrismaError(error, 'create');
      throw error;
    }
  }

  async createMany(data: CreateInput[]): Promise<Prisma.BatchPayload> {
    try {
      logger.info(`Creating multiple ${this.modelName}`, { count: data.length });
      const result = await this.model.createMany({ data });
      logger.info(`${this.modelName} batch created successfully`, { count: result.count });
      return result;
    } catch (error) {
      this.handlePrismaError(error, 'createMany');
      throw error;
    }
  }

  async findUnique(where: WhereUniqueInput, options?: RepositoryOptions): Promise<T | null> {
    try {
      const result = await this.model.findUnique({
        where,
        ...this.buildQueryOptions(options)
      });
      return result;
    } catch (error) {
      this.handlePrismaError(error, 'findUnique');
      throw error;
    }
  }

  async findFirst(options?: RepositoryOptions): Promise<T | null> {
    try {
      const result = await this.model.findFirst(this.buildQueryOptions(options));
      return result;
    } catch (error) {
      this.handlePrismaError(error, 'findFirst');
      throw error;
    }
  }

  async findMany(options?: RepositoryOptions): Promise<T[]> {
    try {
      const result = await this.model.findMany(this.buildQueryOptions(options));
      return result;
    } catch (error) {
      this.handlePrismaError(error, 'findMany');
      throw error;
    }
  }

  async findManyPaginated(options?: RepositoryOptions): Promise<PaginatedResult<T>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const skip = (page - 1) * limit;

      const queryOptions = this.buildQueryOptions({
        ...options,
        skip,
        take: limit
      });

      const [data, total] = await Promise.all([
        this.model.findMany(queryOptions),
        this.count(options)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      this.handlePrismaError(error, 'findManyPaginated');
      throw error;
    }
  }

  async count(options?: FilterOptions): Promise<number> {
    try {
      const result = await this.model.count({
        where: options?.where
      });
      return result;
    } catch (error) {
      this.handlePrismaError(error, 'count');
      throw error;
    }
  }

  async update(where: WhereUniqueInput, data: UpdateInput): Promise<T> {
    try {
      logger.info(`Updating ${this.modelName}`, { where, data });
      const result = await this.model.update({ where, data });
      logger.info(`${this.modelName} updated successfully`, { id: result.id });
      return result;
    } catch (error) {
      if (this.isPrismaNotFoundError(error)) {
        throw new NotFoundError(this.modelName, where as any);
      }
      this.handlePrismaError(error, 'update');
      throw error;
    }
  }

  async updateMany(where: FilterOptions['where'], data: UpdateInput): Promise<Prisma.BatchPayload> {
    try {
      logger.info(`Updating multiple ${this.modelName}`, { where, data });
      const result = await this.model.updateMany({ where, data });
      logger.info(`${this.modelName} batch updated successfully`, { count: result.count });
      return result;
    } catch (error) {
      this.handlePrismaError(error, 'updateMany');
      throw error;
    }
  }

  async delete(where: WhereUniqueInput): Promise<T> {
    try {
      logger.info(`Deleting ${this.modelName}`, { where });
      const result = await this.model.delete({ where });
      logger.info(`${this.modelName} deleted successfully`, { id: result.id });
      return result;
    } catch (error) {
      if (this.isPrismaNotFoundError(error)) {
        throw new NotFoundError(this.modelName, where as any);
      }
      this.handlePrismaError(error, 'delete');
      throw error;
    }
  }

  async deleteMany(where?: FilterOptions['where']): Promise<Prisma.BatchPayload> {
    try {
      logger.info(`Deleting multiple ${this.modelName}`, { where });
      const result = await this.model.deleteMany({ where });
      logger.info(`${this.modelName} batch deleted successfully`, { count: result.count });
      return result;
    } catch (error) {
      this.handlePrismaError(error, 'deleteMany');
      throw error;
    }
  }

  async exists(where: WhereUniqueInput): Promise<boolean> {
    try {
      const result = await this.model.findUnique({ where });
      return result !== null;
    } catch (error) {
      this.handlePrismaError(error, 'exists');
      throw error;
    }
  }

  protected buildQueryOptions(options?: RepositoryOptions): any {
    if (!options) return {};

    const queryOptions: any = {};

    if (options.where) queryOptions.where = options.where;
    if (options.include) queryOptions.include = options.include;
    if (options.select) queryOptions.select = options.select;
    if (options.orderBy) queryOptions.orderBy = options.orderBy;
    if (options.skip !== undefined) queryOptions.skip = options.skip;
    if (options.take !== undefined) queryOptions.take = options.take;

    return queryOptions;
  }

  protected handlePrismaError(error: any, operation: string): void {
    logger.error(`Prisma error in ${this.modelName}.${operation}`, {
      error: error.message,
      code: error.code,
      meta: error.meta
    });

    if (this.isPrismaUniqueConstraintError(error)) {
      const field = error.meta?.target?.[0] || 'field';
      throw new DuplicateError(this.modelName, field, 'unknown');
    }

    if (this.isPrismaNotFoundError(error)) {
      throw new NotFoundError(this.modelName, 'unknown');
    }

    // Re-throw as RepositoryError for unknown Prisma errors
    throw new RepositoryError(
      `Database operation failed: ${error.message}`,
      error.code || 'UNKNOWN_ERROR',
      error
    );
  }

  protected isPrismaUniqueConstraintError(error: any): boolean {
    return error.code === 'P2002';
  }

  protected isPrismaNotFoundError(error: any): boolean {
    return error.code === 'P2025';
  }
}