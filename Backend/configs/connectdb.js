const ConnectDB = async () => {
  try {
    const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
    const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;
    await sql.connect(connectionString);
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
