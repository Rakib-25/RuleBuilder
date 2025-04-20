type Condition = {
    id: string;
    category: string;
    field: string;
    operator: string;
    value: string;
  };
  
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
