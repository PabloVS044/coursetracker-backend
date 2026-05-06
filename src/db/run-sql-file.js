const fs = require('fs/promises');
const path = require('path');
const { Client } = require('pg');

const { createPoolConfig } = require('./pool');

async function main() {
  const relativeFilePath = process.argv[2];

  if (!relativeFilePath) {
    throw new Error('Usage: node src/db/run-sql-file.js <relative-sql-file-path>');
  }

  const absoluteFilePath = path.resolve(process.cwd(), relativeFilePath);
  const sql = await fs.readFile(absoluteFilePath, 'utf8');
  const client = new Client(createPoolConfig());

  await client.connect();

  try {
    await client.query(sql);
    console.log(`SQL executed successfully: ${relativeFilePath}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
