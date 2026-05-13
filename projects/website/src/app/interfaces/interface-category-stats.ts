import { CategoryDefinition } from './interface-category';

export interface CategoryStat extends CategoryDefinition {
  total: number;
  correct: number;
  percent: number;
}
