import { TestHelper } from './helpers/test.helper';
import { TreeControl } from './treeview.control';

describe('Treeview Control Tests', () => {
  const dependencies = TestHelper.getStandardDependencies();
  let treeControl: TreeControl;

  beforeEach(() => {
    treeControl = new TreeControl(
      null,
      dependencies.getLevel,
      dependencies.isExpandable,
      dependencies.nodeParser,
      dependencies.getRoot,
      dependencies.getChildren,
      dependencies.getBranch,
    );
  });

  test('Should be able to load root', () => {
    treeControl.loadRoot().subscribe((data) => {
      expect(data).toBeTruthy();
      expect(data.length).toBeGreaterThan(0);
    });
  });

  test('Should be able to load children', () => {
    treeControl.loadRoot().subscribe((data) => {
      const firstNode = data[0];
      treeControl.loadChildren(firstNode).subscribe((children) => {
        expect(children).toBeTruthy();
        expect(children.length).toBeGreaterThan(0);
      });
    });
  });
});
