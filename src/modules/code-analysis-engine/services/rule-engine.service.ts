import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalysisRule } from '../entities/analysis-rule.entity';
import { CreateRuleDto } from '../dto/code-analysis.dto';
import { UpdateRuleDto } from '../dto/code-analysis.dto';

@Injectable()
export class RuleEngineService {
  private readonly logger = new Logger(RuleEngineService.name);

  constructor(
    @InjectRepository(AnalysisRule)
    private readonly ruleRepo: Repository<AnalysisRule>,
  ) {}

  async findAll(): Promise<AnalysisRule[]> {
    return this.ruleRepo.find({ order: { ruleType: 'ASC', severity: 'ASC' } });
  }

  async findEnabled(): Promise<AnalysisRule[]> {
    return this.ruleRepo.find({ where: { isEnabled: true }, order: { ruleType: 'ASC' } });
  }

  async findById(id: string): Promise<AnalysisRule> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) throw new Error(`Rule ${id} not found`);
    return rule;
  }

  async create(dto: CreateRuleDto): Promise<AnalysisRule> {
    const rule = new AnalysisRule();
    rule.ruleName = dto.ruleName;
    rule.ruleType = dto.ruleType;
    rule.pattern = dto.pattern;
    rule.severity = dto.severity ?? 'warning';
    rule.description = dto.description ?? null;
    rule.isEnabled = dto.isEnabled ?? true;
    rule.isBuiltIn = false;
    rule.language = dto.language ?? 'all';
    rule.cweId = dto.cweId ?? null;
    rule.remediation = dto.remediation ?? null;
    return this.ruleRepo.save(rule);
  }

  async update(id: string, dto: UpdateRuleDto): Promise<AnalysisRule> {
    const rule = await this.findById(id);
    if (dto.ruleName !== undefined) rule.ruleName = dto.ruleName;
    if (dto.pattern !== undefined) rule.pattern = dto.pattern;
    if (dto.severity !== undefined) rule.severity = dto.severity;
    if (dto.description !== undefined) rule.description = dto.description;
    if (dto.isEnabled !== undefined) rule.isEnabled = dto.isEnabled;
    if (dto.language !== undefined) rule.language = dto.language;
    if (dto.remediation !== undefined) rule.remediation = dto.remediation;
    return this.ruleRepo.save(rule);
  }

  async delete(id: string): Promise<void> {
    const rule = await this.findById(id);
    if (rule.isBuiltIn) {
      throw new Error('Cannot delete built-in rules');
    }
    await this.ruleRepo.delete(id);
  }

  async seedBuiltInRules(): Promise<number> {
    const existing = await this.ruleRepo.count({ where: { isBuiltIn: true } });
    if (existing > 0) {
      this.logger.log(`Built-in rules already seeded (${existing} rules)`);
      return existing;
    }

    const builtInRules: Partial<AnalysisRule>[] = [
      { ruleName: 'Eval Usage', ruleType: 'malicious', pattern: '\\beval\\s*\\(', severity: 'critical', description: 'Detects usage of eval() which allows arbitrary code execution', isBuiltIn: true, language: 'all', remediation: 'Replace eval with safer alternatives like JSON.parse or Function constructor with strict input validation' },
      { ruleName: 'Dynamic Exec', ruleType: 'malicious', pattern: 'child_process\\.exec\\s*\\(', severity: 'critical', description: 'Detects child_process.exec usage that may allow command injection', isBuiltIn: true, language: 'all', remediation: 'Use child_process.execFile with argument array instead of string concatenation' },
      { ruleName: 'Function Constructor', ruleType: 'malicious', pattern: 'new\\s+Function\\s*\\(', severity: 'high', description: 'Dynamic code execution via Function constructor', isBuiltIn: true, language: 'all', remediation: 'Avoid dynamic code generation; use predefined functions' },
      { ruleName: 'Hardcoded Secret', ruleType: 'vulnerability', pattern: '(password|secret|apiKey|api_key|privateKey|token)\\s*[=:]\\s*[\'"][^\'"]{8,}', severity: 'high', description: 'Potential hardcoded secret detected in source code', isBuiltIn: true, language: 'all', cweId: 'CWE-798', remediation: 'Move secrets to environment variables or a secrets manager' },
      { ruleName: 'SQL Injection', ruleType: 'vulnerability', pattern: '(query|execute|raw)\\s*\\(.*\\$\\{|.*\\+.*\\)', severity: 'high', description: 'Potential SQL injection via string interpolation or concatenation', isBuiltIn: true, language: 'all', cweId: 'CWE-89', remediation: 'Use parameterized queries or query builders' },
      { ruleName: 'Insecure Random', ruleType: 'vulnerability', pattern: 'Math\\.random\\s*\\(', severity: 'medium', description: 'Math.random() is not cryptographically secure', isBuiltIn: true, language: 'all', cweId: 'CWE-330', remediation: 'Use crypto.randomBytes or crypto.randomUUID for security-sensitive operations' },
      { ruleName: 'Command Injection', ruleType: 'vulnerability', pattern: '(exec|spawn|execSync)\\s*\\(.*\\$\\{|.*\\+.*\\)', severity: 'high', description: 'Potential command injection via dynamic exec arguments', isBuiltIn: true, language: 'all', cweId: 'CWE-78', remediation: 'Use argument arrays instead of string interpolation for shell commands' },
      { ruleName: 'Path Traversal', ruleType: 'vulnerability', pattern: 'path\\.join\\s*\\(.*req\\.|path\\.resolve\\s*\\(.*req\\.', severity: 'high', description: 'Potential path traversal via unsanitized user input', isBuiltIn: true, language: 'all', cweId: 'CWE-22', remediation: 'Sanitize and validate path inputs; use path.resolve and check against allowed directories' },
      { ruleName: 'Prototype Pollution', ruleType: 'vulnerability', pattern: 'Object\\.assign\\s*\\(.*req\\.|merge\\s*\\(.*req\\.', severity: 'high', description: 'Potential prototype pollution via user input assignment', isBuiltIn: true, language: 'all', cweId: 'CWE-1321', remediation: 'Use Object.create(null) or deep-clone before merging user input' },
      { ruleName: 'Unused Import', ruleType: 'dead_code', pattern: '^import\\s+\\{\\s*([^}]+)\\s*\\}\\s+from', severity: 'info', description: 'Import statement - verify if imported symbols are used', isBuiltIn: true, language: 'typescript', remediation: 'Remove unused imports to reduce bundle size and improve clarity' },
      { ruleName: 'Deprecated API Call', ruleType: 'dead_code', pattern: '\\.(toPromise|pipe\\(.*first\\)\\(\\))', severity: 'warning', description: 'Potentially deprecated API usage detected', isBuiltIn: true, language: 'typescript', remediation: 'Check documentation for updated API replacements' },
      { ruleName: 'Unreachable Code', ruleType: 'dead_code', pattern: 'return\\s+[^;]+;\\s*\\n\\s*\\S', severity: 'warning', description: 'Code detected after return statement may be unreachable', isBuiltIn: true, language: 'all', remediation: 'Remove unreachable code after return/throw statements' },
      { ruleName: 'Suspicious Network Call', ruleType: 'malicious', pattern: 'fetch\\s*\\(\\s*[\'"]http://[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+', severity: 'high', description: 'HTTP request to raw IP address detected', isBuiltIn: true, language: 'all', remediation: 'Verify the destination; use HTTPS and domain names instead of raw IPs' },
      { ruleName: 'Obfuscated String', ruleType: 'malicious', pattern: '\\\\x[0-9a-fA-F]{2}\\\\x[0-9a-fA-F]{2}\\\\x[0-9a-fA-F]{2}', severity: 'high', description: 'Hex-encoded string detected, may indicate obfuscation', isBuiltIn: true, language: 'all', remediation: 'Review the context; replace with readable strings if legitimate' },
    ];

    const entities = builtInRules.map(r => {
      const rule = new AnalysisRule();
      rule.ruleName = r.ruleName!;
      rule.ruleType = r.ruleType!;
      rule.pattern = r.pattern!;
      rule.severity = r.severity!;
      rule.description = r.description ?? null;
      rule.isEnabled = true;
      rule.isBuiltIn = true;
      rule.language = r.language ?? 'all';
      rule.cweId = r.cweId ?? null;
      rule.remediation = r.remediation ?? null;
      return rule;
    });

    const saved = await this.ruleRepo.save(entities);
    this.logger.log(`Seeded ${saved.length} built-in rules`);
    return saved.length;
  }
}
