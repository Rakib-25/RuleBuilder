// import { Condition } from "../types/interfaces";
import { Percent, Trash2 } from "lucide-react";
// import { categoryConfig,arithmeticOperators, operatorLabels } from "./constant";
import { categoryConfig, ArithmeticOperator, operatorLabels, arithmeticOperators } from "./constant"; // Adjust the import path as necessary
import { CategoryName, Operator } from "./constant"; // Adjust the import path as necessary




// Condition type definition
export interface Condition {
  id: string;
  category: CategoryName;
  operator: Operator;
  operand: string;
  operator2: ArithmeticOperator;
  rules: string;
  value?: string;
}

// Component props
interface ConditionRowProps {
  condition: Condition;
  onUpdate: (id: string, update: Partial<Condition>) => void;
  onDelete?: (id: string) => void;
}

const ConditionRow: React.FC<ConditionRowProps> = ({ condition, onUpdate, onDelete }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Category Selector */}
      <select
        className="p-2 border border-gray-300 rounded-md bg-white"
        value={condition.category}
        onChange={(e) => onUpdate(condition.id, { 
          category: e.target.value as CategoryName 
        })}
      >
        {Object.keys(categoryConfig).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Operator Selector */}
      <select
        className="p-2 border border-gray-300 rounded-md bg-white"
        value={condition.operator}
        onChange={(e) => onUpdate(condition.id, { 
          operator: e.target.value as Operator 
        })}
      >
        {categoryConfig[condition.category].operators.map((op) => (
          <option key={op} value={op}>
            {operatorLabels[op]}
          </option>
        ))}
      </select>

      {/* Operand Selector */}
      <select
        className="p-2 border border-gray-300 rounded-md bg-white"
        value={condition.operand}
        onChange={(e) => onUpdate(condition.id, { operand: e.target.value })}
      >
        {categoryConfig[condition.category].operands.map((operand) => (
          <option key={operand} value={operand}>
            {operand}
          </option>
        ))}
      </select>

      {/* Arithmetic Operator */}
      <select
        className="p-2 border border-gray-300 rounded-md bg-white"
        value={condition.operator2}
        onChange={(e) => onUpdate(condition.id, { 
          operator2: e.target.value as ArithmeticOperator 
        })}
      >
        {arithmeticOperators.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      {/* Rules Selector */}
      <select
        className="p-2 border border-gray-300 rounded-md bg-white"
        value={condition.rules}
        onChange={(e) => onUpdate(condition.id, { rules: e.target.value })}
      >
        {categoryConfig[condition.category].fields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>

      {/* Value Input */}
      <div className="flex items-center">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-md flex-grow"
          value={condition.value || ''}
          onChange={(e) => onUpdate(condition.id, { value: e.target.value })}
          placeholder="Value"
        />
        <Percent size={19} className="ml-2" />
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          className="p-1 text-red-500 hover:bg-red-50 rounded-md"
          onClick={() => onDelete(condition.id)}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};

export default ConditionRow;