import prisma from './config';

const connection = {
  /**
   * Initializes the database connection
   */
  initialize: async () => {
    try {
      // Test the connection by querying the database
      await prisma.$connect();
      console.log('Database connected successfully');
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Database connection failed: ${error.message}`);
      } else {
        console.error('Unknown error occurred during database initialization');
      }
      return false;
    }
  },

  /**
   * Gets the Prisma client instance
   */
  getClient: () => prisma,

  /**
   * Closes the database connection
   */
  close: async () => {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
};

export default connection;