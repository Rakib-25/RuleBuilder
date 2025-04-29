// categories-config.ts
export type CategoryName = 'Hire cash Value' | 'HMRP' | 'Hire Outstanding' | 'Hire value';
export type Operator = 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
export type ArithmeticOperator = 'Add' | 'Subtract' | 'Multiply' | 'Divide by';

export interface CategoryConfig {
  operators: Operator[];
  operands: string[];
  fields: string[];
}

export const categoryConfig: Record<CategoryName, CategoryConfig> = {
  'Hire cash Value': {
    operators: ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN'],
    operands: ['MRP', 'Hire Cash','HMRP', 'Hire Outstanding'],
    fields: ['Load ON MRP', 'Load ON HMRP', 'Load ON Hire cash value', 'Load ON Hire Value']
  },
  'HMRP': {
    operators: ['EQUALS', 'GREATER_THAN', 'LESS_THAN'],
    operands: ['HMRP', 'Hire Outstanding'],
    fields: ['Load ON MRP', 'Load ON HMRP']
  },
  'Hire Outstanding': {
    operators: ['EQUALS', 'GREATER_THAN', 'LESS_THAN', 'CONTAINS'],
    operands: ['Hire Value', 'Hire Outstanding'],
    fields: ['Load ON Hire cash value', 'Load ON Hire Value']
  },
  'Hire value': {
    operators: ['EQUALS', 'NOT_EQUALS'],
    operands: ['Hire Cash', 'Hire Value'],
    fields: ['Load ON Hire Value']
  }
};

export const operatorLabels: Record<Operator, string> = {
  'EQUALS': 'Equals',
  'NOT_EQUALS': 'Not Equals',
  'GREATER_THAN': 'Greater Than',
  'LESS_THAN': 'Less Than',
  'CONTAINS': 'Contains'
};

export const arithmeticOperators = ['Add', 'Subtract', 'Multiply', 'Divide by'] as const;