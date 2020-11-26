// tslint:disable:max-classes-per-file
export interface ITestData {
  number: number;
  key: string;
  name: string;
  children: ITestData[];
}

export interface ITestDataPId {
  number: number;
  id: string;
  name: string;
  parentId: string;
  children: ITestDataPId[];
  isLeaf: boolean;
}

export interface INodeDb {
  data: ITestData;
  children: INodeDb[];
}

export class TestData implements ITestData {
  static idSeed = 0;

  number: number;
  key: string;
  name: string;
  children: ITestData[];

  constructor() {
    this.number = TestData.idSeed++;
    this.key = `${this.number}`;
    this.name = `node ${this.key}`;
  }

  addChildren(children: ITestData[]) {
    this.children = children;
    return this;
  }
}

export class TestDataPId implements ITestDataPId {
  static idSeed = 0;

  number: number;
  id: string;
  name: string;
  parentId: string = null;
  children: ITestDataPId[];

  get isLeaf(): boolean {
    return !(this.children && this.children.length);
  }

  constructor(child?: ITestDataPId) {
    this.number = TestDataPId.idSeed++;
    this.id = `${this.number}`;
    this.name = `node ${this.id}`;
    if (child) {
      if (!this.children) {
        this.children = [];
      }
      child.parentId = this.id;
      this.children.push(child);
    }
  }

  addChildren(children: ITestDataPId[]) {
    children.forEach((child) => (child.parentId = this.id));
    this.children = children;

    return this;
  }
}
