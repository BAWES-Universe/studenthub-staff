const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'agents.json');

if (!fs.existsSync(filePath)) {
  console.error('agents.json not found in ai-agency/.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`\nAI Agency: ${data.agencyName}\n`);
console.log(`${data.description}\n`);

for (const team of data.teams) {
  console.log(`Team: ${team.name}`);
  console.log(`Role: ${team.role}`);
  for (const agent of team.agents) {
    console.log(`  - ${agent.name}: ${agent.focus}`);
  }
  console.log('');
}
