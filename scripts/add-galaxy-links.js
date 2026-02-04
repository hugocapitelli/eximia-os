#!/usr/bin/env node
/**
 * Add Links Between Related Documents in Galaxies
 * Creates [[]] connections to form coherent clusters in Obsidian graph
 */

const fs = require('fs');
const path = require('path');

const GALAXY_CONNECTIONS = {
  CORE: {
    'The_Maestro/README.md': [
      'The_Veritas/README.md',
      'The_CEO/agente_core.md',
      'agent_registry.yaml'
    ],
    'The_Veritas/README.md': [
      'The_Maestro/README.md',
      '00_Codex/README.md'
    ],
    'The_CEO/agente_core.md': [
      'The_Maestro/README.md',
      'The_CFO/README.md',
      'The_CLO/README.md',
      'The_CMO/README.md'
    ]
  },
  SPECIALIST: {
    'The_CFO/README.md': [
      'The_CEO/agente_core.md',
      'The_CLO/README.md',
      'The_CMO/README.md'
    ],
    'The_CLO/README.md': [
      'The_CEO/agente_core.md',
      'The_CFO/README.md',
      'The_CMO/README.md'
    ],
    'The_CMO/README.md': [
      'The_CEO/agente_core.md',
      'The_CFO/README.md',
      'The_CLO/README.md'
    ]
  },
  CREATION: {
    'Z_Squad/README.md': [
      'El_Clonador/README.md',
      'Clones/README.md',
      'agent_registry.yaml'
    ],
    'El_Clonador/README.md': [
      'Z_Squad/README.md',
      'Clones/README.md'
    ],
    'Clones/README.md': [
      'El_Clonador/README.md',
      'Z_Squad/README.md'
    ]
  },
  CODEX: {
    '00_Codex/README.md': [
      '_HUB.md',
      'The_Veritas/README.md'
    ]
  },
  RUNTIME: {
    'eximia_runtime/README.md': [
      '.aios-core/README.md',
      'apps/web/README.md'
    ],
    '.aios-core/README.md': [
      'eximia_runtime/README.md',
      'apps/web/README.md'
    ],
    'apps/web/README.md': [
      'eximia_runtime/README.md',
      '.aios-core/README.md'
    ]
  }
};

class GalaxyLinksAdder {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.stats = { added: 0, skipped: 0, errors: 0 };
  }

  addLinkToFile(filePath, linkTarget) {
    try {
      const fullPath = path.join(this.baseDir, filePath);

      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        this.stats.skipped++;
        return false;
      }

      let content = fs.readFileSync(fullPath, 'utf-8');

      // Check if link already exists
      const linkPattern = new RegExp(`\\[\\[${linkTarget}\\]\\]|\\[\\[.*?${path.basename(linkTarget, '.md')}.*?\\]\\]`);
      if (linkPattern.test(content)) {
        return false; // Link already exists
      }

      // Add link before the closing galaxy tag
      if (content.includes('#galaxy-')) {
        const galaxyTagIndex = content.lastIndexOf('#galaxy-');
        const insertPoint = content.lastIndexOf('\n', galaxyTagIndex - 1);

        const link = `[[${linkTarget}]]`;
        content = content.slice(0, insertPoint) + '\n' + link + content.slice(insertPoint);
      } else {
        // If no galaxy tag, add at the end
        content += '\n\n[[' + linkTarget + ']]';
      }

      fs.writeFileSync(fullPath, content, 'utf-8');
      this.stats.added++;
      return true;

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      this.stats.errors++;
      return false;
    }
  }

  run() {
    console.log('\n🔗 Adding links between galaxy documents...\n');

    for (const [galaxy, connections] of Object.entries(GALAXY_CONNECTIONS)) {
      console.log(`\n${galaxy}:`);

      for (const [source, targets] of Object.entries(connections)) {
        for (const target of targets) {
          const added = this.addLinkToFile(source, target);
          if (added) {
            console.log(`  ✓ ${source} → [[${target}]]`);
          }
        }
      }
    }

    console.log(`\n\n📊 SUMMARY`);
    console.log(`Links added: ${this.stats.added}`);
    console.log(`Skipped: ${this.stats.skipped}`);
    console.log(`Errors: ${this.stats.errors}\n`);
  }
}

const baseDir = process.cwd();
const adder = new GalaxyLinksAdder(baseDir);
adder.run();
