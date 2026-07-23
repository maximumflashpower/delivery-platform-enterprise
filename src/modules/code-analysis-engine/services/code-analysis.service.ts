import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DeadCodeFinding } from '../entities/dead-code-finding.entity';
import { VulnerabilityFinding } from '../entities/vulnerability-finding.entity';
import { MaliciousCodeFinding } from '../entities/malicious-code-finding.entity';
import { DuplicateCodeBlock } from '../entities/duplicate-code-block.entity';
import { AnalysisRule } from '../entities/analysis-rule.entity';

export interface AnalysisResult {
  deadCode: Partial<DeadCodeFinding>[];
  vulnerabilities: Partial<VulnerabilityFinding>[];
  maliciousCode: Partial<MaliciousCodeFinding>[];
  duplicates: Partial<DuplicateCodeBlock>[];
  filesScanned: number;
}

@Injectable()
export class CodeAnalysisService {
  private readonly logger = new Logger(CodeAnalysisService.name);

  private readonly IGNORE_DIRS = ['node_modules', 'dist', '.git', 'coverage', 'build', '.next'];
  private readonly SCAN_EXTENSIONS = ['.ts', '.js', '.tsx', '.jsx'];

  walkDirectory(dir: string): string[] {
    const files: string[] = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!this.IGNORE_DIRS.includes(entry.name)) {
            files.push(...this.walkDirectory(fullPath));
          }
        } else if (entry.isFile()) {
          if (this.SCAN_EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      }
    } catch (err) {
      this.logger.warn(`Cannot read directory ${dir}: ${(err as Error).message}`);
    }
    return files;
  }

  readFileContent(filePath: string): string | null {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      this.logger.warn(`Cannot read file ${filePath}: ${(err as Error).message}`);
      return null;
    }
  }

  analyzeFile(filePath: string, content: string, rules: AnalysisRule[], scanId: string): {
    deadCode: Partial<DeadCodeFinding>[];
    vulnerabilities: Partial<VulnerabilityFinding>[];
    maliciousCode: Partial<MaliciousCodeFinding>[];
  } {
    const lines = content.split('\n');
    const deadCode: Partial<DeadCodeFinding>[] = [];
    const vulnerabilities: Partial<VulnerabilityFinding>[] = [];
    const maliciousCode: Partial<MaliciousCodeFinding>[] = [];

    // Built-in static checks: unused imports
    const importRegex = /^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/;
    lines.forEach((line, idx) => {
      const importMatch = line.match(importRegex);
      if (importMatch) {
        const symbols = importMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());
        for (const symbol of symbols) {
          if (symbol.length === 0) continue;
          const usageRegex = new RegExp(`\\b${symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
          const usageCount = (content.match(usageRegex) || []).length;
          if (usageCount <= 1) {
            deadCode.push({
              scanId,
              filePath,
              lineNumber: idx + 1,
              findingType: 'unused_import',
              description: `Import "${symbol}" from "${importMatch[2]}" appears to be unused`,
              severity: 'info',
              snippet: line.trim(),
              status: 'open',
            });
          }
        }
      }
    });

    // Built-in static checks: unreachable code after return
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (/^(return|throw)\s/.test(trimmed) && idx + 1 < lines.length) {
        const nextLine = lines[idx + 1].trim();
        if (nextLine.length > 0 && !/^[})\];]/.test(nextLine) && !/^(catch|finally|else|case|default)/.test(nextLine)) {
          deadCode.push({
            scanId,
            filePath,
            lineNumber: idx + 2,
            findingType: 'unreachable_code',
            description: 'Code after return/throw statement may be unreachable',
            severity: 'warning',
            snippet: nextLine.substring(0, 200),
            status: 'open',
          });
        }
      }
    });

    // Rule-based scanning
    for (const rule of rules) {
      if (!rule.isEnabled) continue;
      try {
        const regex = new RegExp(rule.pattern, 'gi');
        lines.forEach((line, idx) => {
          const matches = line.match(regex);
          if (matches && matches.length > 0) {
            const finding = {
              scanId,
              filePath,
              lineNumber: idx + 1,
              description: rule.description ?? `Rule "${rule.ruleName}" matched`,
              severity: rule.severity,
              snippet: line.trim().substring(0, 200),
              status: 'open',
            };

            if (rule.ruleType === 'dead_code') {
              deadCode.push({ ...finding, findingType: rule.ruleName.toLowerCase().replace(/\s+/g, '_') });
            } else if (rule.ruleType === 'vulnerability') {
              vulnerabilities.push({
                ...finding,
                vulnType: rule.ruleName.toLowerCase().replace(/\s+/g, '_'),
                cweId: rule.cweId ?? null,
                owaspCategory: null,
                remediation: rule.remediation ?? null,
              });
            } else if (rule.ruleType === 'malicious') {
              maliciousCode.push({
                ...finding,
                threatType: rule.ruleName.toLowerCase().replace(/\s+/g, '_'),
                patternMatched: matches[0],
              });
            }
          }
        });
      } catch (regexErr) {
        this.logger.warn(`Invalid regex in rule ${rule.ruleName}: ${(regexErr as Error).message}`);
      }
    }

    return { deadCode, vulnerabilities, maliciousCode };
  }

  findDuplicates(files: { path: string; content: string }[], scanId: string, minLines = 6): Partial<DuplicateCodeBlock>[] {
    const duplicates: Partial<DuplicateCodeBlock>[] = [];
    const blocks: { path: string; startLine: number; endLine: number; hash: string; content: string }[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');
      for (let i = 0; i <= lines.length - minLines; i++) {
        const block = lines.slice(i, i + minLines).join('\n').trim();
        if (block.length < 20) continue;
        const hash = this.simpleHash(block);
        blocks.push({ path: file.path, startLine: i + 1, endLine: i + minLines, hash, content: block });
      }
    }

    const seen = new Map<string, typeof blocks>();
    for (const block of blocks) {
      const existing = seen.get(block.hash);
      if (existing) {
        for (const prev of existing) {
          if (prev.path !== block.path) {
            duplicates.push({
              scanId,
              filePathA: prev.path,
              filePathB: block.path,
              startLineA: prev.startLine,
              endLineA: prev.endLine,
              startLineB: block.startLine,
              endLineB: block.endLine,
              similarityScore: 100,
              linesDuplicated: minLines,
              snippet: block.content.substring(0, 300),
              status: 'open',
            });
          }
        }
      } else {
        seen.set(block.hash, [block]);
      }
      if (existing && !existing.includes(block)) {
        existing.push(block);
      }
    }

    // Deduplicate: keep only first occurrence per pair
    const uniqueDupes: Partial<DuplicateCodeBlock>[] = [];
    const seenPairs = new Set<string>();
    for (const d of duplicates) {
      const key = [d.filePathA, d.startLineA, d.filePathB, d.startLineB].join('|');
      const reverseKey = [d.filePathB, d.startLineB, d.filePathA, d.startLineA].join('|');
      if (!seenPairs.has(key) && !seenPairs.has(reverseKey)) {
        seenPairs.add(key);
        uniqueDupes.push(d);
      }
    }

    return uniqueDupes;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString(36);
  }
}
