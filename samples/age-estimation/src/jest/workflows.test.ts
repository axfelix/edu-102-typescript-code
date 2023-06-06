import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker, Runtime, DefaultLogger, LogEntry } from '@temporalio/worker';
import { estimateAgeWorkflow } from '../workflows';
import * as activities from '../activities';

let testEnv: TestWorkflowEnvironment;


beforeAll(async () => {
  // Use console.log instead of console.error to avoid red output
  // Filter INFO log messages for clearer test output
  Runtime.install({
    logger: new DefaultLogger('WARN', (entry: LogEntry) => console.log(`[${entry.level}]`, entry.message)),
  });

  testEnv = await TestWorkflowEnvironment.createTimeSkipping();
});

afterAll(async () => {
  await testEnv?.teardown();
});


test('estimateAgeWorkflow with activity call', async () => {
  const { client, nativeConnection } = testEnv;
  const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue: 'test',
      workflowsPath: require.resolve('../workflows'),
      activities,
  });

  await worker.runUntil(async () => {
    const result = await client.workflow.execute(estimateAgeWorkflow, {
      args: ["Betty"],
      workflowId: 'test',
      taskQueue: 'test',
    });
    expect(result).toEqual('Betty has an estimated age of 76');
  });
});
