// import { Condition } from "../types/interfaces";
import { Percent, Trash2 } from "lucide-react";
import { categories, fieldsByCategory, operators } from "./constant";



type Condition = {
  id: string;
  category: string;
  operand: string;
  operator: string;
  rules:string;
  operator2:string;
  value: string;
};

// Condition Component
const ConditionComponent = ({
    condition,
    onUpdate,
    onDelete
  }: {
    condition: Condition;
    onUpdate: (id: string, updates: Partial<Condition>) => void;
    onDelete?: (id: string) => void;
  }) => {

    // Get available fields for the current category, default to empty array if category isn't found
    const availableFields = fieldsByCategory[condition.category as keyof typeof fieldsByCategory] || [];
  
    return (
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm">
        <select
          className="p-2 border border-gray-300 rounded-md bg-white"
          value={condition.category}
          onChange={(e) => onUpdate(condition.id, { category: e.target.value })}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          className="p-2 border border-gray-300 rounded-md bg-white"
          value={condition.operator}
          onChange={(e) => onUpdate(condition.id, { operator: e.target.value })}
        >
          {operators.map(op => (
            <option key={op} value={op}>{op.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          className="p-2 border border-gray-300 rounded-md bg-white"
          value={condition.operand}
          onChange={(e) => onUpdate(condition.id, { operand: e.target.value })}
        >
            <option>MRP</option>
            <option>HMRP</option>
            <option>Hire Cash</option>
            <option>Hire Outstanding</option>
            <option>Hire Value</option>
        </select>

        <select
          className="p-2 border border-gray-300 rounded-md bg-white"
          value={condition.operator2}
          onChange={(e) => onUpdate(condition.id, { operator2: e.target.value })}
        >
            <option>Add</option>
            <option>Substract</option>
            <option>Multiply</option>
            <option>Devide by</option>
        </select>
        
        <select
          className="p-2 border border-gray-300 rounded-md bg-white"
          value={condition.rules}
          onChange={(e) => onUpdate(condition.id, { rules: e.target.value })}
        >
        
          {availableFields.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>


        

        
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

  export default ConditionComponent;