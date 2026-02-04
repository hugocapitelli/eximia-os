#!/usr/bin/env node
/**
 * Obsidian Graph Configuration Generator
 * Generates .obsidian/graph.json with 7-galaxy color groups
 */

const fs = require('fs');
const path = require('path');

const GALAXY_COLORS = {
  CORE: { r: 139, g: 58, b: 139, name: 'Purple' },           // #8B3A8B
  SPECIALIST: { r: 34, g: 139, b: 34, name: 'Green' },        // #228B22
  CREATION: { r: 255, g: 140, b: 0, name: 'Orange' },         // #FF8C00
  CODEX: { r: 169, g: 169, b: 169, name: 'Gray' },            // #A9A9A9
  RUNTIME: { r: 30, g: 144, b: 255, name: 'Blue' },           // #1E90FF
  OPERATIONAL: { r: 255, g: 105, b: 180, name: 'Pink' },      // #FF69B4
  TOOLS: { r: 255, g: 215, b: 0, name: 'Yellow' }             // #FFD700
};

function generateGraphConfig(baseDir) {
  // Read existing graph.json to preserve settings
  const graphPath = path.join(baseDir, '.obsidian', 'graph.json');
  let existingConfig = {};

  try {
    if (fs.existsSync(graphPath)) {
      existingConfig = JSON.parse(fs.readFileSync(graphPath, 'utf-8'));
    }
  } catch (e) {
    console.log('Creating new graph.json');
  }

  // Generate colorGroups
  const colorGroups = Object.entries(GALAXY_COLORS).map(([galaxy, color]) => ({
    query: `tag:galaxy-${galaxy.toLowerCase()}`,
    color: {
      a: 1,
      rgb: (color.r << 16) | (color.g << 8) | color.b
    }
  }));

  // Merge with existing config
  const newConfig = {
    ...existingConfig,
    colorGroups,
    'collapse-color-groups': true,
    'showTags': false,
    'showAttachments': false,
    'hideUnresolved': false
  };

  // Write to file
  fs.mkdirSync(path.dirname(graphPath), { recursive: true });
  fs.writeFileSync(graphPath, JSON.stringify(newConfig, null, 2));

  console.log('\n✅ Obsidian graph configuration updated:');
  console.log(`   Location: ${graphPath}\n`);

  console.log('Galaxy Color Groups:');
  Object.entries(GALAXY_COLORS).forEach(([galaxy, color]) => {
    const hex = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`.toUpperCase();
    console.log(`  • ${galaxy.padEnd(15)} ${color.name.padEnd(10)} ${hex}`);
  });
}

// Run
const baseDir = process.cwd();
generateGraphConfig(baseDir);
