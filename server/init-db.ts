import { initDatabase, db } from './db.js';

initDatabase();

const groupCounts = db.prepare(`
  SELECT g.name_ja as subunit, p.name_zh as project, COUNT(cg.character_id) as member_count
  FROM groups g
  JOIN projects p ON g.project_id = p.id
  LEFT JOIN character_groups cg ON cg.group_id = g.id
  WHERE g.type = 'subunit'
  GROUP BY g.id
  ORDER BY p.sort_order, g.sort_order
`).all();

console.log('Subunit member counts:');
console.table(groupCounts);
