import { sequelize } from '../config/db.config';
import { Author } from '../models/author.model';

(async () => {
  try {
    // 1) connect
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // 2) sync model -> creates the table if missing (use migrations in prod)
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');

    // 3) quick checks: list tables and describe authors table
    const qi = sequelize.getQueryInterface();
    const tables = await qi.showAllTables();
    console.log('Tables in DB:', tables);

    try {
      const desc = await qi.describeTable('authors'); // throws if no table
      console.log('authors table schema:', desc);
    } catch (err) {
      console.log('authors table does not exist yet (describeTable failed).');
    }

    const seed = [
      { name: 'Victor', lastName: 'Hugo' },
      { name: 'Alice', lastName: 'Walker' },
    ];

    const created = await (Author as any).bulkCreate(seed, { validate: true });
    console.log(
      '✅ Seeded rows:',
      created.map((r: any) => r.toJSON()),
    );

    // 5) verify: read back
    const all = await (Author as any).findAll();
    console.log(
      '✅ All authors:',
      all.map((r: any) => r.toJSON()),
    );

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed script error:', err);
    process.exit(1);
  }
})();
