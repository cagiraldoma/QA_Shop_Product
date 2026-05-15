import { Reporter, TestCase, TestResult, FullConfig, Suite } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface Summary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

export default class CiReporter implements Reporter {
  private summary: Summary = { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };

  onBegin(config: FullConfig, suite: Suite): void {
    console.log(`\n🚀 Starting QA suite: ${suite.title || 'qa-practice-product'}`);
    console.log(`   Projects: ${config.projects.map(p => p.name).join(', ')}`);
    console.log(`   Workers: ${config.workers}\n`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.summary.total++;
    this.summary.duration += result.duration;

    if (result.status === 'passed') this.summary.passed++;
    if (result.status === 'failed') {
      this.summary.failed++;
      const file = test.location.file;
      const line = test.location.line;
      const error = result.error?.message || 'Unknown error';
      console.log(`::error file=${file},line=${line}::Test failed: ${test.title} — ${error}`);
    }
    if (result.status === 'skipped') this.summary.skipped++;
  }

  onEnd(): void {
    const { total, passed, failed, skipped, duration } = this.summary;
    console.log(`\n📊 QA Results: ${passed} passed, ${failed} failed, ${skipped} skipped (total: ${total})`);
    console.log(`⏱️  Duration: ${(duration / 1000).toFixed(1)}s`);

    const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json');
    fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
    fs.writeFileSync(summaryPath, JSON.stringify(this.summary, null, 2));

    if (failed > 0) {
      console.log(`\n❌ ${failed} test(s) failed`);
      process.exitCode = 1;
    } else {
      console.log(`\n✅ All tests passed`);
    }
  }
}
