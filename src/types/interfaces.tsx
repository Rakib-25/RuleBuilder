// type Condition = {
//     id: string;
//     category: string;
//     operand: string;
//     operator: string;
//     rules:string;
//     value: string;
//   };

import {Condition} from '../components/condition';
  
  type RuleGroup = {
    id: string;
    operator: 'AND' | 'OR';
    children: Array<Condition | RuleGroup>;
  };
  
  type RuleElement = Condition | RuleGroup;


  // Helper function to check if element is a RuleGroup
const isRuleGroup = (element: RuleElement): element is RuleGroup => {
    return 'operator' in element && 'children' in element;
  };
  
  // Safe access to ensure children is always an array
  const ensureArray = (children: any): Array<any> => {
    if (Array.isArray(children)) {
      return children;
    }
    return [];
  };


export type { Condition, RuleGroup, RuleElement };

export { isRuleGroup, ensureArray };
