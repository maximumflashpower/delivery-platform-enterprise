import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ScriptService } from '../services/script.service';
import { Script } from '../entities/script.entity';

@ApiTags('Script Engine - Editor')
@Controller('script-engine/editor')
export class ScriptEditorController {
  constructor(private readonly scriptService: ScriptService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get editor templates' })
  @ApiResponse({ status: 200, description: 'List of available editor templates' })
  async getTemplates(): Promise<any[]> {
    return [
      { id: 'tmpl-001', name: 'Hello World', language: 'javascript', sourceCode: "console.log('Hello, World!');" },
      { id: 'tmpl-002', name: 'Order Processor', language: 'typescript', sourceCode: "function processOrder(order: Order): void { /* logic */ }" },
      { id: 'tmpl-003', name: 'Data Transformer', language: 'javascript', sourceCode: "async function transform(data) { return await transformData(data); }" },
    ];
  }

  @Get('syntax-highlight/:language')
  @ApiOperation({ summary: 'Get syntax highlighting rules for a language' })
  @ApiParam({ name: 'language' })
  @ApiResponse({ status: 200, description: 'Syntax rules' })
  async getSyntaxHighlighting(@Param('language') language: string): Promise<any> {
    const rules: Record<string, any> = {
      javascript: { keywords: ['function', 'var', 'let', 'const', 'return', 'if', 'else'], strings: true, comments: true },
      typescript: { keywords: ['function', 'interface', 'type', 'class', 'public', 'private'], types: true, generics: true },
      lua: { keywords: ['local', 'function', 'end', 'if', 'then', 'else'], tables: true },
      python: { keywords: ['def', 'class', 'import', 'return', 'if', 'elif', 'else'], decorators: true },
    };
    return rules[language] || { base: true };
  }

  @Post('preview')
  @ApiOperation({ summary: 'Preview script execution without saving' })
  @ApiResponse({ status: 200, description: 'Preview result' })
  async previewExecution(@Body() dto: { sourceCode: string; language: string }): Promise<{ valid: boolean; result?: any; errors?: string[] }> {
    const { valid, errors } = await this.scriptService.validateSyntax(dto.sourceCode, dto.language);
    if (!valid) return { valid: false, errors };
    return { valid: true, result: 'Preview executed successfully' };
  }
}
