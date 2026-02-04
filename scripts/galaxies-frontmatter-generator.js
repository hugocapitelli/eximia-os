#!/usr/bin/env node
/**
 * Galaxy Frontmatter Generator for eximIA.OS
 * Generates YAML frontmatter for all 2533+ markdown files across 7 galaxies
 *
 * @usage node galaxies-frontmatter-generator.js --galaxy=CORE --dry-run
 * @usage node galaxies-frontmatter-generator.js --all
 */

const fs = require('fs');
const path = require('path');

// Galaxy mapping configuration
const GALAXY_CONFIG = {
  CORE: {
    color: '#8B3A8B',
    icon: '👑',
    description: 'Supreme Orchestrator & Core Agents',
    paths: ['The_Maestro', 'The_Veritas', 'The_CEO']
  },
  SPECIALIST: {
    color: '#228B22',
    icon: '💼',
    description: 'Executive & Specialist Agents',
    paths: ['The_CFO', 'The_CLO', 'The_CMO', 'The_Planner', 'X_Agents']
  },
  CREATION: {
    color: '#FF8C00',
    icon: '🧬',
    description: 'Agent Creation & Cloning Pipeline',
    paths: ['Z_Squad', 'El_Clonador', 'Clones']
  },
  CODEX: {
    color: '#A9A9A9',
    icon: '📚',
    description: 'Knowledge Vault (Isolated Galaxy)',
    paths: ['00_Codex']
  },
  RUNTIME: {
    color: '#1E90FF',
    icon: '⚙️',
    description: 'Backend Runtime & Framework',
    paths: ['eximia_runtime', '.aios-core', 'apps']
  },
  OPERATIONAL: {
    color: '#FF69B4',
    icon: '🛠️',
    description: 'Operational Infrastructure',
    paths: ['.aios', '.eximia', 'squads']
  },
  TOOLS: {
    color: '#FFD700',
    icon: '🔧',
    description: 'Tools & Utilities',
    paths: ['Ferramentas', 'Media_Harvester', 'MKT Creatives', 'Institucional']
  }
};

class GalaxyFrontmatterGenerator {
  constructor(options = {}) {
    this.baseDir = options.baseDir || process.cwd();
    this.dryRun = options.dryRun || false;
    this.galaxy = options.galaxy || null;
    this.forceOverwrite = options.forceOverwrite || false;

    this.stats = {
      processed: 0,
      skipped: 0,
      errors: 0,
      warnings: 0,
      logs: []
    };

    this.startTime = Date.now();
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const levelStr = level.toUpperCase().padEnd(5);
    const logEntry = `[${levelStr}] ${message}`;
    this.stats.logs.push(logEntry);
    console.log(logEntry);
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

  extractDocumentType(filePath, content) {
    const fileName = path.basename(filePath).toLowerCase();

    if (fileName.includes('profile') || fileName.includes('bio')) return 'agent-profile';
    if (fileName.includes('knowledge') || fileName.includes('kb')) return 'knowledge-base';
    if (fileName.includes('prompt')) return 'prompt';
    if (fileName.includes('protocol')) return 'protocol';
    if (fileName.includes('workflow')) return 'workflow';
    if (fileName.includes('template')) return 'template';
    if (fileName === 'readme.md' || fileName === '_hub.md') return 'documentation';

    return 'document';
  }

  extractTitle(content) {
    const match = content.match(/^#\s+(.+?)$/m);
    return match ? match[1].trim() : 'Untitled';
  }

  extractStatus(content) {
    if (content.includes('DEPRECATED')) return 'deprecated';
    if (content.includes('[DRAFT]') || content.includes('DRAFT')) return 'draft';
    if (content.includes('PRODUCTION')) return 'production';
    return 'documented';
  }

  extractKeywords(filePath, content) {
    const keywords = [];
    const baseName = path.basename(filePath, '.md').toLowerCase().replace(/_/g, '-');

    // Add filename as keyword
    keywords.push(baseName);

    // Extract from headings
    const headings = content.match(/^#{1,3}\s+(.+?)$/gm) || [];
    headings.forEach(h => {
      const word = h.replace(/^#+\s+/, '').toLowerCase();
      if (word.length > 2) keywords.push(word.substring(0, 30));
    });

    // Add agent-related keywords
    if (filePath.includes('The_Maestro')) keywords.push('maestro', 'orchestration');
    if (filePath.includes('The_Veritas')) keywords.push('veritas', 'research', 'verification');
    if (filePath.includes('The_CEO')) keywords.push('ceo', 'executive');
    if (filePath.includes('The_CFO')) keywords.push('cfo', 'finance');
    if (filePath.includes('The_CLO')) keywords.push('clo', 'legal');
    if (filePath.includes('The_CMO')) keywords.push('cmo', 'marketing');
    if (filePath.includes('Z_Squad')) keywords.push('z-squad', 'agent-creation');
    if (filePath.includes('El_Clonador')) keywords.push('clonador', 'personality-cloning');
    if (filePath.includes('Clones')) keywords.push('clone', 'personality');
    if (filePath.includes('00_Codex')) keywords.push('codex', 'knowledge');

    return [...new Set(keywords)].filter(k => k.length > 0).slice(0, 10);
  }

  generateFrontmatter(filePath, content) {
    const { galaxy, config } = this.findGalaxy(filePath);
    const docType = this.extractDocumentType(filePath, content);
    const title = this.extractTitle(content);
    const status = this.extractStatus(content);
    const keywords = this.extractKeywords(filePath, content);

    const frontmatter = {
      'title': title,
      'galaxy': galaxy,
      'galaxy-color': config.color,
      'document-type': docType,
      'status': status,
      'created-date': new Date().toISOString().split('T')[0],
      'last-updated': new Date().toISOString().split('T')[0],
      'keywords': keywords,
      'tags': [
        `galaxy-${galaxy.toLowerCase()}`,
        docType.replace('-', '-')
      ]
    };

    return frontmatter;
  }

  formatYAML(obj) {
    let yaml = '---\n';

    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        yaml += `${key}:\n`;
        value.forEach(v => {
          yaml += `  - "${v}"\n`;
        });
      } else if (typeof value === 'string') {
        yaml += `${key}: "${value}"\n`;
      } else {
        yaml += `${key}: ${value}\n`;
      }
    }

    yaml += '---\n\n';
    return yaml;
  }

  async processMdFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');

      // Check for existing frontmatter
      if (content.startsWith('---')) {
        if (!this.forceOverwrite) {
          this.log(`SKIP: ${path.relative(this.baseDir, filePath)} (has frontmatter)`, 'warn');
          this.stats.skipped++;
          return false;
        }

        // Remove existing frontmatter
        const endIndex = content.indexOf('---', 3);
        if (endIndex !== -1) {
          content = content.substring(endIndex + 3).trim() + '\n\n';
        }
      }

      const frontmatter = this.generateFrontmatter(filePath, content);
      const yamlBlock = this.formatYAML(frontmatter);
      const newContent = yamlBlock + content;

      if (!this.dryRun) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
      }

      this.log(`DONE: ${path.relative(this.baseDir, filePath)}`, 'info');
      this.stats.processed++;
      return true;

    } catch (error) {
      this.log(`ERRO: ${path.relative(this.baseDir, filePath)} - ${error.message}`, 'error');
      this.stats.errors++;
      return false;
    }
  }

  async processGalaxy(galaxyName) {
    const config = GALAXY_CONFIG[galaxyName];
    if (!config) {
      this.log(`Unknown galaxy: ${galaxyName}`, 'error');
      return;
    }

    this.log(`\n${'='.repeat(70)}`, 'info');
    this.log(`Processing Galaxy: ${galaxyName} ${config.icon}`, 'info');
    this.log(`${'='.repeat(70)}\n`, 'info');

    for (const dir of config.paths) {
      const dirPath = path.join(this.baseDir, dir);
      if (fs.existsSync(dirPath)) {
        this.walkDirectory(dirPath);
      }
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
      this.log(`Error walking directory ${dirPath}: ${error.message}`, 'error');
    }
  }

  async run() {
    const dryRunText = this.dryRun ? '[DRY RUN]' : '';
    this.log(`\n${'#'.repeat(70)}`, 'info');
    this.log(`# Galaxy Frontmatter Generator ${dryRunText}`, 'info');
    this.log(`${'#'.repeat(70)}\n`, 'info');

    this.log(`Base directory: ${this.baseDir}`, 'info');
    this.log(`Dry run: ${this.dryRun}`, 'info');
    this.log(`Force overwrite: ${this.forceOverwrite}\n`, 'info');

    if (this.galaxy) {
      this.log(`Target galaxy: ${this.galaxy}`, 'info');
      await this.processGalaxy(this.galaxy);
    } else {
      this.log(`Target galaxies: ALL`, 'info');
      for (const galaxyName of Object.keys(GALAXY_CONFIG)) {
        await this.processGalaxy(galaxyName);
      }
    }

    // Summary
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);

    this.log(`\n${'='.repeat(70)}`, 'info');
    this.log(`SUMMARY`, 'info');
    this.log(`${'='.repeat(70)}`, 'info');
    this.log(`Processed: ${this.stats.processed}`, 'info');
    this.log(`Skipped: ${this.stats.skipped}`, 'info');
    this.log(`Errors: ${this.stats.errors}`, 'error');
    this.log(`Warnings: ${this.stats.warnings}`, 'warn');
    this.log(`Elapsed: ${elapsed}s`, 'info');
    this.log(`${'='.repeat(70)}\n`, 'info');

    return this.stats;
  }
}

// CLI
const args = process.argv.slice(2);
const options = {
  baseDir: process.cwd(),
  dryRun: args.includes('--dry-run'),
  forceOverwrite: args.includes('--force'),
  galaxy: null
};

// Parse --galaxy=CORE
const galaxyArg = args.find(a => a.startsWith('--galaxy='));
if (galaxyArg) {
  options.galaxy = galaxyArg.split('=')[1];
}

const generator = new GalaxyFrontmatterGenerator(options);
generator.run().then(stats => {
  process.exit(stats.errors > 0 ? 1 : 0);
});
