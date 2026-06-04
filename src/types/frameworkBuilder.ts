export interface FrameworkBulletPoint {
  id: string;
  text: string;
}

export interface FrameworkNode {
  id: string;
  title: string;
  bulletPoints: FrameworkBulletPoint[];
  children: FrameworkNode[];
  isPriority?: boolean;
}

export interface FrameworkBuilderState {
  nodes: FrameworkNode[];
}
