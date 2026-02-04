#!/usr/bin/env node
/**
 * Add Visible Tags to Markdown Files
 * Adds #galaxy-* tags to the end of files for Obsidian color grouping
 */

const fs = require('fs');
const path = require('path');

const GALAXY_CONFIG = {
  CORE: { color: '#8B3A8B', paths: ['The_Maestro', 'The_Veritas', 'The_CEO'] },
  SPECIALIST: { color: '#228B22', paths: ['The_CFO', 'The_CLO', 'The_CMO', 'The_Planner', 'X_Agents'] },
  CREATION: { color: '#FF8C00', paths: ['Z_Squad', 'El_Clonador', 'Clones'] },
  CODEX: { color: '#A9A9A9', paths: ['00_Codex'] },
  RUNTIME: { color: '#1E90FF', paths: ['eximia_runtime', '.aios-core', 'apps'] },
  OPERATIONAL: { color: '#FF69B4', paths: ['.aios', '.eximia', 'squads'] },
  TOOLS: { color: '#FFD700', paths: ['Ferramentas', 'Media_Harvester', 'MKT Creatives', 'Institucional'] }
};

class VisibleTagsAdder {
  constructor(options = {}) {
    this.baseDir = options.baseDir || process.cwd();
    this.dryRun = options.dryRun || false;
    this.stats = { processed: 0, skipped: 0, errors: 0 };
  }

  findGalaxy(filePath) {
    const relativePath = path.relative(this.baseDir, filePath).replace(/\\/g, '/');
    for (const [galaxyName, config] of Object.entries(GALAXY_CONFIG)) {
      for (const dir of config.paths) {
        if (relativePath.startsWith(dir + '/') || relativePath === dir) {
          return { galaxy: galaxyName, config };
        }
      }
    }
    return { galaxy: 'SPECIALIST', config: GALAXY_CONFIG.SPECIALIST };
  }

  async processMdFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      const { galaxy } = this.findGalaxy(filePath);

      // Check if file already has visible tags
      if (content.includes(`#galaxy-${galaxy.toLowerCase()}`)) {
        this.stats.skipped++;
        return false;
      }

      // Extract frontmatter if exists
      let frontmatter = '';
      let bodyContent = content;

      if (content.startsWith('---')) {
        const endIndex = content.indexOf('---', 3);
        if (endIndex !== -1) {
          frontmatter = content.substring(0, endIndex + 3);
          bodyContent = content.substring(endIndex + 3).trim();
        }
      }

      // Add visible tags at end
      const tag = `#galaxy-${galaxy.toLowerCase()}`;
      const newContent = frontmatter + '\n\n' + bodyContent + '\n\n' + tag;

      if (!this.dryRun) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
      }

      this.stats.processed++;
      console.log(`✓ ${path.relative(this.baseDir, filePath)}`);
      return true;

    } catch (error) {
      console.error(`✗ ${path.relative(this.baseDir, filePath)}: ${error.message}`);
      this.stats.errors++;
      return false;
    }
  }

  walkDirectory(dirPath) {
    try {
      const files = fs.readdirSync(dirPath, { recursive: true });
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(dirPath, file);
          this.processMdFile(filePath);
        }
      }
    } catch (error) {
      console.error(`Error walking ${dirPath}: ${error.message}`);
    }
  }

  async run() {
    console.log('\n📌 Adding Visible Galaxy Tags...\n');

    for (const [galaxy, config] of Object.entries(GALAXY_CONFIG)) {
      console.log(`\n${galaxy}:`);
      for (const dir of config.paths) {
        const dirPath = path.join(this.baseDir, dir);
        if (fs.existsSync(dirPath)) {
          this.walkDirectory(dirPath);
        }
      }
    }

    console.log(`\n✅ SUMMARY`);
    console.log(`Processed: ${this.stats.processed}`);
    console.log(`Skipped: ${this.stats.skipped}`);
    console.log(`Errors: ${this.stats.errors}\n`);
  }
}

const args = process.argv.slice(2);
const generator = new VisibleTagsAdder({
  baseDir: process.cwd(),
  dryRun: args.includes('--dry-run')
});

generator.run().then(() => {
  process.exit(generator.stats.errors > 0 ? 1 : 0);
});
