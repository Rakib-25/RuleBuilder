import { useState } from 'react';
import { RuleGroup, Condition, RuleElement, isRuleGroup, ensureArray } from '../types/interfaces';
import RuleGroupComponent from './rule_group'; 
import { Copy } from 'lucide-react'; 

// Function to convert rule to JSON format (removing IDs)
const generateRuleJSON = (group: RuleGroup) => {
    const convertGroup = (g: RuleGroup): any => {
      const result: any = {
        operator: g.operator,
        rules: []
      };
      
      ensureArray(g.children).forEach(child => {
        if (isRuleGroup(child)) {
          result.rules.push(convertGroup(child));
        } else {
          // For conditions, exclude the ID field
          const { id, ...conditionWithoutId } = child;
          result.rules.push(conditionWithoutId);
        }
      });
      
      return result;
    };
    
    return convertGroup(group);
  };


// JSON Display Component
const JsonDisplay = ({ json }: { json: any }) => {
    const [copied, setCopied] = useState(false);
    const jsonString = JSON.stringify(json, null, 2);
    
    const copyToClipboard = () => {
      navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    
    return (
      <div className="bg-gray-800 rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-2 bg-gray-900 text-white">
          <div className="text-sm font-medium">Generated JSON</div>
          <button 
            className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-xs hover:bg-gray-600"
            onClick={copyToClipboard}
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="p-4 text-green-400 overflow-auto max-h-80 text-sm">{jsonString}</pre>
      </div>
    );
  };



// Main Rule Builder
export default function ImprovedRuleBuilder() {
  const [rootGroup, setRootGroup] = useState<RuleGroup>({
    id: 'root',
    operator: 'AND',
    children: []
  });

  const [generatedJson, setGeneratedJson] = useState<any>(null);

  

  // Helper function to find and update groups
  const updateTree = (
    children: Array<Condition | RuleGroup>,
    groupId: string,
    updateFn: (item: RuleGroup) => RuleGroup
  ): Array<Condition | RuleGroup> => {
    return children.map(child => {
      if (isRuleGroup(child)) {
        if (child.id === groupId) {
          // Update this group
          return updateFn(child);
        } else {
          // Recurse into its children
          return {
            ...child,
            children: updateTree(ensureArray(child.children), groupId, updateFn)
          };
        }
      }
      // It's a condition, return as is
      return child;
    });
  };

  const generateRule = () => {
    const jsonRule = generateRuleJSON(rootGroup);
    setGeneratedJson(jsonRule);
  };

  // Generate a simple ID (for demo)
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addCondition = (parentId: string) => {
    const newCondition: Condition = {
      id: generateId(),
      category: 'Patient',
      field: 'PatientName',
      operator: 'EQUALS',
      value: ''
    };
    
    if (parentId === 'root') {
      setRootGroup(prev => ({
        ...prev,
        children: [...ensureArray(prev.children), newCondition]
      }));
    } else {
      setRootGroup(prev => ({
        ...prev,
        children: updateTree(ensureArray(prev.children), parentId, item => ({
          ...item,
          children: [...ensureArray(item.children), newCondition]
        }))
      }));
    }
  };

  const addGroup = (parentId: string) => {
    const newGroup: RuleGroup = {
      id: generateId(),
      operator: 'AND',
      children: []
    };
    
    if (parentId === 'root') {
      setRootGroup(prev => ({
        ...prev,
        children: [...ensureArray(prev.children), newGroup]
      }));
    } else {
      setRootGroup(prev => ({
        ...prev,
        children: updateTree(ensureArray(prev.children), parentId, item => ({
          ...item,
          children: [...ensureArray(item.children), newGroup]
        }))
      }));
    }
  };

  const updateCondition = (conditionId: string, updatedCondition: Partial<Condition>) => {
    const updateConditionInChildren = (children: Array<Condition | RuleGroup>): Array<Condition | RuleGroup> => {
      return children.map(child => {
        if (!isRuleGroup(child)) {
          // Direct condition match
          if (child.id === conditionId) {
            return { ...child, ...updatedCondition };
          }
          return child;
        } else {
          // Recursive search in group children
          return {
            ...child,
            children: updateConditionInChildren(ensureArray(child.children))
          };
        }
      });
    };

    setRootGroup(prev => ({
      ...prev,
      children: updateConditionInChildren(ensureArray(prev.children))
    }));
  };

  const updateGroupOperator = (groupId: string, operator: 'AND' | 'OR') => {
    if (groupId === 'root') {
      setRootGroup(prev => ({
        ...prev,
        operator
      }));
    } else {
      setRootGroup(prev => ({
        ...prev,
        children: updateTree(ensureArray(prev.children), groupId, item => ({
          ...item,
          operator
        }))
      }));
    }
  };

  const deleteChild = (parentId: string, childId: string) => {
    const filterChildren = (children: Array<Condition | RuleGroup>) => {
      return children.filter(child => child.id !== childId);
    };
    
    if (parentId === 'root') {
      setRootGroup(prev => ({
        ...prev,
        children: filterChildren(ensureArray(prev.children))
      }));
    } else {
      setRootGroup(prev => ({
        ...prev,
        children: updateTree(ensureArray(prev.children), parentId, item => ({
          ...item,
          children: filterChildren(ensureArray(item.children))
        }))
      }));
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">Rule Builder</h2>
        <p className="text-sm text-gray-600">Create complex rules by adding conditions and groups</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <RuleGroupComponent
          group={rootGroup}
          onAddCondition={addCondition}
          onAddGroup={addGroup}
          onUpdateCondition={updateCondition}
          onUpdateGroupOperator={updateGroupOperator}
          onDeleteChild={deleteChild}
        />
      </div>
      
      <div className="mt-4 flex justify-end">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={generateRule}
        >
          Generate Rule
        </button>
      </div>

      {generatedJson && (
        <div className="mt-6">
          <JsonDisplay json={generatedJson} />
        </div>
      )}
    </div>
  );
}