import {
  ITestData,
  ITestDataPId,
  TestData,
  TestDataPId,
} from '../models/treeview.mock.models';

export class TreeMockData {
  static simpleHierarchicalData = [
    new TestData().addChildren([new TestData()]),
    new TestData().addChildren([new TestData()]),
  ];

  static hierarchicalData: ITestData[] = [
    new TestData().addChildren([
      new TestData().addChildren([
        new TestData().addChildren([new TestData(), new TestData()]),
        new TestData().addChildren([new TestData(), new TestData()]),
        new TestData(),
      ]),
    ]),
    new TestData().addChildren([
      new TestData().addChildren([new TestData(), new TestData()]),
      new TestData().addChildren([new TestData(), new TestData()]),
      new TestData().addChildren([new TestData(), new TestData()]),
    ]),
    new TestData().addChildren([
      new TestData().addChildren([new TestData(), new TestData()]),
      new TestData().addChildren([new TestData(), new TestData()]),
    ]),
    new TestData(),
    new TestData(),
  ];

  static dataWithParentId: ITestDataPId[] = [
    new TestDataPId().addChildren([
      new TestDataPId().addChildren([
        new TestDataPId(),
        new TestDataPId(),
        new TestDataPId().addChildren([
          new TestDataPId(),
          new TestDataPId(),
          new TestDataPId(),
        ]),
      ]),
      new TestDataPId(),
      new TestDataPId().addChildren([new TestDataPId()]),
    ]),
    new TestDataPId(),
    new TestDataPId().addChildren([
      new TestDataPId().addChildren([new TestDataPId()]),
    ]),
  ];
}
