import { TestHelper } from './helpers/test.helper';
import { TestData } from './models/treeview.mock.models';
import { TreeviewDataSource } from './treeview.datasource';

describe('Tree datasource => ', () => {
  const dependencies = TestHelper.getStandardDependencies();
  let dataSource: TreeviewDataSource;
  let initComplete: boolean;

  beforeEach(() => {
    dataSource = new TreeviewDataSource(
      dependencies.getLevel,
      dependencies.isExpandable,
      dependencies.nodeParser,
      dependencies.getRoot,
      dependencies.getChildren,
      null,
      false,
    );

    // To test in isolation, will simulate what the rendered control would do.
    dataSource.connect(null).subscribe();
    dataSource.initComplete.subscribe((started) => (initComplete = started));
  });

  test('Should have data upon data source creation', () => {
    expect(dataSource.data).toBeTruthy();
  });

  test('Should have more nodes upon expansion', () => {
    const initialCount = dataSource.data.length;
    const firstNode = dataSource.data[0];
    dataSource.treeControl.toggle(firstNode);
    expect(dataSource.data.length).toBeGreaterThan(initialCount);
  });

  test('Should be able to collapse', () => {
    const initialCount = dataSource.data.length;
    const firstNode = dataSource.data[0];
    dataSource.treeControl.toggle(firstNode);
    expect(dataSource.data.length).toBeGreaterThan(initialCount);

    dataSource.treeControl.toggle(firstNode);
    expect(dataSource.data.length).toBe(initialCount);
  });

  test('Should be able to add node', () => {
    const testNode = new TestData();
    const initialCount = dataSource.data.length;
    dataSource.addNode(testNode);
    expect(dataSource.data.length).toBeGreaterThan(initialCount);
  });

  test('Should be able to add node with parent', () => {
    const parentIndex = 0;
    const parentNode = dataSource.data[parentIndex];
    const testNode = new TestData();
    const initialCount = dataSource.data.length;

    dataSource.addNode(testNode, parentNode.id);
    expect(dataSource.data.length).toBeGreaterThan(initialCount);
    const testNodeIndex = dataSource.treeControl.findNodeIndex(testNode.key);
    expect(testNodeIndex).toBeGreaterThan(parentIndex);
    const parsedTestNode = dataSource.treeControl.findNodeById(testNode.key);
    expect(parsedTestNode.data).toBe(testNode);
  });
});
