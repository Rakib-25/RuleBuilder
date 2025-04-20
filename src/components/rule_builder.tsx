import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RuleGroup, Condition } from '../types/interfaces'; // Adjusted the path to match the correct location
import RuleGroupComponent from './rule_group'; // Adjusted the path to match the correct location
import ConditionComponent from './condition'; // Adjusted the path to match the correct location
import generateRuleStructure from '../helper/rule_structure'; // Adjusted the path to match the correct location


const RuleBuilder = () => {
  const [rootGroup, setRootGroup] = useState<RuleGroup>({
    id: 'root',
    operator: 'AND',
    children: []
  });

// Helper function to find and update groups
const updateTree = (
    children: (Condition | RuleGroup)[],
    groupId: string,
    updateFn: (item: RuleGroup) => RuleGroup
  ): (Condition | RuleGroup)[] => {
    return children.map(child => {
      if ('children' in child) {
        if (child.id === groupId) {
          // Update this group
          return updateFn(child);
        } else {
          // Recurse into its children
          return {
            ...child,
            children: updateTree(child.children, groupId, updateFn)
          };
        }
      }
      // It's a condition, return as is
      return child;
    });
  };
  

  const addCondition = (parentId: string) => {
    // Logic to add new condition
    setRootGroup(prev => {
        const newCondition: Condition = {
          id: uuidv4(),
          category: 'Patient',
          field: 'PatientName',
          operator: 'EQUALS',
          value: ''
        };
  
        return {
          ...prev,
          children: updateTree(prev.children, parentId, item => ({
            ...item,
            children: [...(item as RuleGroup).children, newCondition]
          }))
        };
      });
  };

  const addGroup = (parentId: string) => {
    // Logic to add new group
    setRootGroup(prev => {
        const newGroup: RuleGroup = {
          id: uuidv4(),
          operator: 'AND',
          children: []
        };
  
        return {
          ...prev,
          children: updateTree(prev.children, parentId, item => ({
            ...item,
            children: [...(item as RuleGroup).children, newGroup]
          }))
        };
      });
  };

  const updateCondition = (conditionId: string, updatedCondition: Partial<Condition>) => {
    setRootGroup(prev => ({
      ...prev,
      children: updateTree(prev.children, conditionId, item => ({
              ...item,
              children: item.children.map(child =>
                'category' in child && child.id === conditionId
                  ? { ...child, ...updatedCondition }
                  : child
              )
            }))
    }));
  };

  const updateGroupOperator = (groupId: string, operator: 'AND' | 'OR') => {
    console.log('Updating group operator:', groupId, operator);
    setRootGroup(prev => ({
      ...prev,
      children: updateTree(prev.children, groupId, item => ({
        ...item,
        operator
      }))
    }));
  };
  

  return (
    <div className="rule-builder">
      <RuleGroupComponent
        group={rootGroup}
        onAddCondition={addCondition}
        onAddGroup={addGroup}
        onUpdateCondition={updateCondition}
        onUpdateGroupOperator={updateGroupOperator}
      />
      <button onClick={() => console.log(generateRuleStructure(rootGroup))}>
        Get Rule
      </button>
    </div>
  );
};

export default RuleBuilder;