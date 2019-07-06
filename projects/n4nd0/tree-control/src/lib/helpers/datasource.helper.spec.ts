import { TestData } from '../models/treeview.mock.models';
import { DropPosition } from '../models/treeview.models.interfaces';
import { TreeviewDataSource } from '../treeview.datasource';
import { TreeMockData } from './mock.data';
import { TestHelper } from './test.helper';

describe('DataSourceHelper', () => {
  let datasource;
  beforeEach(() => {
    datasource = new TreeviewDataSource(
      TestHelper.getLevel,
      TestHelper.isExpandable,
      TestHelper.nodeParser,
      () => TreeMockData.hierarchicalData,
      TestHelper.getChildren,
      TestHelper.getBranch,
      false,
    );

    datasource.connect(null).subscribe();
  });

  test('should create instance of helper', () => {
    expect(datasource.helper).toBeTruthy();
  });

  test('should have reference of treeControl', () => {
    expect(datasource.helper.treeControl).toBeTruthy();
  });

  test('should have reference of current dataset', () => {
    expect(datasource.helper.data).toBeTruthy();
    expect(datasource.helper.data.length).toBeGreaterThan(0);
  });

  describe('[getInsertPosition] => ', () => {
    test('Can get insert position above', () => {
      // Based on mock data simpleHierarchicalData
      const lastNode = datasource.data[1];
      expect(lastNode).toBeTruthy();

      const newNodeLevel = 0;
      const newNode = TestHelper.nodeParser(new TestData(), newNodeLevel);

      const position = datasource.helper.getInsertPosition(
        datasource.helper.treeControl,
        lastNode,
        DropPosition.Above,
        newNode,
      );

      // The position above means the new node will take its place
      expect(position).toBe(1);

      // The level should remains at the root level.
      expect(newNode.level).toBe(newNodeLevel);
    });

    test('Can get insert position below', () => {
      // Based on mock data simpleHierarchicalData
      const lastNode = datasource.data[1];
      expect(lastNode).toBeTruthy();

      const newNodeLevel = 0;
      const newNode = TestHelper.nodeParser(new TestData(), newNodeLevel);

      const position = datasource.helper.getInsertPosition(
        datasource.helper.treeControl,
        lastNode,
        DropPosition.Below,
        newNode,
      );

      // The position should be the next index
      expect(position).toBe(2);

      // The level should remains at the root level.
      expect(newNode.level).toBe(newNodeLevel);
    });

    test('Can get insert position under', () => {
      // Based on mock data simpleHierarchicalData
      const lastNode = datasource.data[1];
      expect(lastNode).toBeTruthy();

      const newNodeLevel = 0;
      const newNode = TestHelper.nodeParser(new TestData(), newNodeLevel);

      const position = datasource.helper.getInsertPosition(
        datasource.helper.treeControl,
        lastNode,
        DropPosition.Under,
        newNode,
      );

      // The position should be the next index
      expect(position).toBe(2);

      // The node should now be a child of the last node.
      expect(newNode.level).toBe(newNodeLevel + 1);
    });
  });

  describe('[orderBranch]', () => {
    const node0 = {
      id: 0,
      name: 'node 0',
      parentId: null,
    };

    const node1 = {
      id: 1,
      name: 'node 1',
      parentId: 0,
    };

    const node2 = {
      id: 2,
      name: 'node 2',
      parentId: 1,
    };

    test('data with no parent id should remain the same', () => {
      const branch = [new TestData().addChildren([new TestData()])];
      const ordered = datasource.helper.orderBranch(branch);

      expect(ordered).toBe(branch);
    });

    test('data with parent id should be sequentially ordered', () => {
      const mockData = [node2, node0, node1];
      const result = datasource.helper.orderBranch(mockData);
      const ordered = [node0, node1, node2];
      expect(result).toStrictEqual(ordered);
    });

    test('bug on orderbranch', () => {
      const data = TestHelper.getBranch('6', '4', null);
      const result = datasource.helper.orderBranch(data);
      const keys = result.map((node) => node.id);
      expect(keys).toStrictEqual(['0', '1', '4', '6']);
    });
  });
});
