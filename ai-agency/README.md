# StudentHub AI Agency

A structured AI agency setup with the following teams, each composed of 6 specialized agents:

- Project Commander
- Engineering
- Desain
- Marketing
- Testing
- Research
- Product
- Strategi

## Folder contents

- `agents.json` — team and agent definitions for the agency

## How to use

1. Open `ai-agency/agents.json`.
2. Adapt team and agent names for your project.
3. Use this manifest as a starting point for building AI assistants, agency workflows, or a multi-agent platform.

## Example usage

- Assign `Project Commander` agents for planning and delivery oversight.
- Use `Engineering` agents to define development roles and implementation tasks.
- Use `Desain` agents to support UX/UI, brand, and accessibility.
- Use `Marketing` agents to create launch campaigns and growth initiatives.
- Use `Testing` agents to validate quality across functional, performance, and security dimensions.
- Use `Research` agents to gather user insights, market data, and innovation signals.
- Use `Product` agents to maintain the roadmap, prioritize features, and measure product outcomes.
- Use `Strategi` agents to guide business direction, pricing, partnerships, and sustainable growth.

## Next step

If you want, I can also create a GitHub branch and push this agency setup to the remote repository.

## Run the AI agency preview

This agency manifest is currently a design blueprint. To inspect it locally, run:

```bash
npm install
npm run run:ai-agency
```

This will print the agency name, team list, and each agent's focus from `ai-agency/agents.json`.
