import { RuleGroup,Condition,RuleElement } from "../types/interfaces";
import ConditionComponent from "./condition";
import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { ensureArray, isRuleGroup } from '../types/interfaces'; // Adjust the path to match your project structure

// Rule Group Component
const RuleGroupComponent = ({
  group,
  onAddCondition,
  onAddGroup,
  onUpdateCondition,
  onUpdateGroupOperator,
  onDeleteChild,
  level = 0
}:{
  group: RuleGroup;
  onAddCondition: (parentId: string) => void;
  onAddGroup: (parentId: string) => void;
  onUpdateCondition: (conditionId: string, updatedCondition: Partial<Condition>) => void;
  onUpdateGroupOperator: (groupId: string, operator: 'AND' | 'OR') => void;
  onDeleteChild?: (parentId: string, childId: string) => void;
  level?: number;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const children = ensureArray(group.children);
  
  return (
    <div className={`rule-group p-3 rounded-lg ${level > 0 ? 'border border-blue-200 bg-blue-50' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        {level > 0 && (
          <button 
            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
        
        <div className="font-medium">
          {level === 0 ? 'Match' : `Group (Level ${level})`}
        </div>
        
        <select
          className="p-1 border border-gray-300  rounded-md bg-white text-sm"
          value={group.operator}
          onChange={(e) => onUpdateGroupOperator(group.id, e.target.value as 'AND' | 'OR')}
        >
          <option value="AND">ALL (AND)</option>
          <option value="OR">ANY (OR)</option>
        </select>
        
        <div className="text-sm text-gray-500">of the following conditions:</div>
      </div>
      
      {!collapsed && (
        <>
          <div className="space-y-2 ml-4">
            {children.length > 0 ? (
              children.map((child) => (
                <div key={child.id} className="rule-item">
                  {isRuleGroup(child) ? (
                    <RuleGroupComponent
                      group={child}
                      onAddCondition={onAddCondition}
                      onAddGroup={onAddGroup}
                      onUpdateCondition={onUpdateCondition}
                      onUpdateGroupOperator={onUpdateGroupOperator}
                      onDeleteChild={onDeleteChild}
                      level={level + 1}
                    />
                  ) : (
                    <ConditionComponent
                      condition={child}
                      onUpdate={onUpdateCondition}
                      onDelete={onDeleteChild ? (childId) => onDeleteChild(group.id, childId) : undefined}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-sm italic">
                No conditions added yet. Use the buttons below to add conditions or groups.
              </div>
            )}
          </div>
          
          <div className="rule-actions mt-3 flex gap-2">
            <button 
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              onClick={() => onAddCondition(group.id)}
            >
              <Plus size={16} />
              Add Condition
            </button>
            <button 
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm hover:bg-gray-200"
              onClick={() => onAddGroup(group.id)}
            >
              <Plus size={16} />
              Add Group
            </button>
          </div>
        </>
      )}
    </div>
  );
};


export default RuleGroupComponent;