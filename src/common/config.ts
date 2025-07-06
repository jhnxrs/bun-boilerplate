export const config = {
    stage: (process.env.NODE_ENV || 'development') as 'production' | 'test' | 'development',
    database_uri: process.env.DATABASE_URI as string,
    test_database_uri: process.env.TEST_DATABASE_URI as string,
    max_database_connections: process.env.MAX_DATABASE_CONNECTIONS as string,
    session_password: process.env.SESSION_PASSWORD as string,
}