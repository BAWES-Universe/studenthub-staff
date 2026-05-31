const tasks = require('./tasks');

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  switch (command) {
    case 'help':
    case '--help':
    case '-h':
      return printHelp();
    case 'preview':
      return tasks.preview();
    case 'profile':
      return tasks.profile();
    case 'search':
      return tasks.searchOpportunities(args.slice(1).join(' ') || undefined);
    case 'jobs':
      return tasks.searchJobs(args.slice(1).join(' ') || undefined);
    case 'suggest-readme':
      return tasks.suggestReadme();
    case 'portfolio':
      return tasks.buildPortfolio();
    case 'update-readme':
      return tasks.autoUpdateReadme();
    case 'cover-letter':
      if (args.length < 3) {
        throw new Error('Usage: node ai-agency/cli.js cover-letter <company> <role> [description]');
      }
      return tasks.generateCoverLetter(args[1], args[2], args.slice(3).join(' '));
    case 'create-issue':
      if (args.length < 4) {
        throw new Error('Usage: node ai-agency/cli.js create-issue <owner/repo> <title> <body>');
      }
      return tasks.createIssue(args[1], args[2], args.slice(3).join(' '));
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`AI Agency CLI

Usage:
  node ai-agency/cli.js preview
  node ai-agency/cli.js profile
  node ai-agency/cli.js search [query]
  node ai-agency/cli.js jobs [query]
  node ai-agency/cli.js suggest-readme
  node ai-agency/cli.js portfolio
  node ai-agency/cli.js update-readme
  node ai-agency/cli.js cover-letter <company> <role> [description]
  node ai-agency/cli.js create-issue <owner/repo> <title> <body>

Environment:
  GITHUB_TOKEN  - required for GitHub API actions
  OPENAI_API_KEY - required for README suggestions, portfolio generation, and cover letters
`);
}

main().catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
