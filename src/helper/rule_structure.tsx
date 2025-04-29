import { RuleGroup } from '../types/interfaces';
import { Condition } from '../components/condition';

export const generateRuleStructure = (group: RuleGroup): string[] => {
  const result: string[] = [];
  
  const processItem = (item: RuleGroup | Condition) => {
    if ('operator' in item && 'children' in item) {
      result.push('(');
      item.children.forEach((child, index) => {
        processItem(child);
        if (index < item.children.length - 1) {
          result.push(item.operator);
        }
      });
      result.push(')');
    } else {
      const condition = item as Condition;
      result.push(
        condition.category,
        condition.operand,
        condition.operator,
        condition.value ?? ''
      );
    }
  };

  processItem(group);
  return result;
};

export default generateRuleStructure;
