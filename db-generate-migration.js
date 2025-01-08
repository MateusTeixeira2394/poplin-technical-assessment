const { execSync } = require('child_process');

console.log('Starting the migration generation...');

const args = process.argv;

const command = args.find((arg) => arg.startsWith('name='));

if (!command) {
  console.error(
    'Is missing the command name=<MIGRATION_NAME>\nTry:\nnpm run db:migration:generate name=<MIGRATION_NAME>',
  );
  process.exit(1);
}

const migrationName = command.split('=')[1];

const migrationPath = `./src/infra/database/migrations/${migrationName}`;

const dataSourcePath = './src/infra/database/data-source.ts';

try {
  execSync(
    `npm run typeorm migration:generate -- ${migrationPath} -d ${dataSourcePath}`,
  );
  console.log('Migration created successfully');
} catch (error) {
  console.error(`Failed to create migration: ${error.message}`);
}
