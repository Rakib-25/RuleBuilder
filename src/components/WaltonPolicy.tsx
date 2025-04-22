import React, { useState, useEffect } from 'react';

// TypeScript interfaces for our data structures
interface RuleConfig {
  productType?: string;
  priceType?: string;
  hireCashPercentage?: number;
  hmrpPercentage?: number;
  downPaymentPercentage?: number;
  outstandingPercentage?: number;
  hireDuration?: number;
  durationType?: string;
  duration?: number;
  feeType?: string;
  feeValue?: number;
  [key: string]: any; // Allow any additional properties
}

interface RuleGroup {
  id: string;
  name: string;
  type: string;
  config: RuleConfig;
  children: RuleGroup[];
}

const DynamicNestedRuleBuilder: React.FC = () => {
  // Main state for all rule groups
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([]);
  // Counter for generating unique IDs
  const [idCounter, setIdCounter] = useState<number>(1);
  
  // Function to add a new top-level group
  const addGroup = (): void => {
    const newGroup: RuleGroup = {
      id: `group-${idCounter}`,
      name: '',
      type: '',
      config: {},
      children: []
    };
    
    setRuleGroups([...ruleGroups, newGroup]);
    setIdCounter(idCounter + 1);
  };
  
  // Function to update a group's properties
  const updateGroup = (id: string, updatedData: Partial<RuleGroup>): void => {
    const updateNestedGroups = (groups: RuleGroup[]): RuleGroup[] => {
      return groups.map(group => {
        if (group.id === id) {
          return { ...group, ...updatedData };
        } else if (group.children && group.children.length) {
          return {
            ...group,
            children: updateNestedGroups(group.children)
          };
        }
        return group;
      });
    };
    
    setRuleGroups(updateNestedGroups(ruleGroups));
  };
  
  // Function to update just the price type and associated configs
  const updatePriceType = (parentId: string, priceType: string): void => {
    const defaultConfigForPriceType = (type: string): Partial<RuleConfig> => {
      switch (type) {
        case 'hireCash':
          return { priceType: type, hireCashPercentage: 2 };
        case 'hmrp':
          return { priceType: type, hmrpPercentage: 9 };
        case 'hireOutstanding':
          return { priceType: type, outstandingPercentage: 16, downPaymentPercentage: 20, hireDuration: 12 };
        case 'hireValue':
          return { priceType: type, hireDuration: 12 };
        default:
          return { priceType: type };
      }
    };
    
    const updateGroupConfig = (groups: RuleGroup[]): RuleGroup[] => {
      return groups.map(group => {
        if (group.id === parentId) {
          // Preserve existing config values but update price type and add defaults for new type
          const updatedConfig = {
            ...group.config,
            ...defaultConfigForPriceType(priceType)
          };
          
          return {
            ...group,
            config: updatedConfig
          };
        } else if (group.children && group.children.length) {
          return {
            ...group,
            children: updateGroupConfig(group.children)
          };
        }
        return group;
      });
    };
    
    setRuleGroups(updateGroupConfig(ruleGroups));
  };
  
  // Function to remove a group
  const removeGroup = (id: string): void => {
    const removeGroupById = (groups: RuleGroup[]): RuleGroup[] => {
      return groups.filter(group => {
        if (group.id === id) {
          return false;
        }
        if (group.children && group.children.length) {
          group.children = removeGroupById(group.children);
        }
        return true;
      });
    };
    
    setRuleGroups(removeGroupById(ruleGroups));
  };
  
    // Component to render a single rule group
    const RuleGroup: React.FC<{ group: RuleGroup; level?: number }> = ({ group, level = 0 }) => {
        const [localConfig, setLocalConfig] = useState<RuleConfig>({});
        
        // Update local config when group config changes
        useEffect(() => {
        setLocalConfig(group.config || {});
        }, [group.config]);
        
        // Handle group type change
        const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
            const newType = e.target.value;
            const defaultConfig = getDefaultConfigForType(newType);
            
            updateGroup(group.id, { 
                type: newType, 
                config: defaultConfig,
                name: group.name || getDefaultNameForType(newType) 
            });
        };
        
        // Handle group name change
        const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        updateGroup(group.id, { name: e.target.value });
        };
        
        // Handle config value change
        const handleConfigChange = (key: string, value: any): void => {
        const updatedConfig = { ...localConfig, [key]: value };
        setLocalConfig(updatedConfig);
        updateGroup(group.id, { config: updatedConfig });
        };
        
        // Handle price type change - without adding a nested group
        const handlePriceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        updatePriceType(group.id, e.target.value);
        };
        
        // Get default config values based on group type
        const getDefaultConfigForType = (type: string): RuleConfig => {
            switch (type) {
                case 'price':
                return { productType: 'general', priceType: '' };
                case 'duration':
                return { durationType: 'monthly', duration: 12 };
                case 'processingFees':
                return { feeType: 'percentage', feeValue: 2 };
                default:
                return {};
            }
        };
        
        // Get default name based on group type
        const getDefaultNameForType = (type: string): string => {
            switch (type) {
                case 'price':
                return 'Price Group';
                case 'duration':
                return 'Duration Group';
                case 'processingFees':
                return 'Processing Fees Group';
                default:
                return 'New Group';
            }
        };
        
        // Render configuration options based on group type
        const renderConfigOptions = (): JSX.Element | null => {
            if (!group.type) return null;
        
            switch (group.type) {
                case 'price':
                    return (
                        <>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                            <select 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={localConfig.productType || 'general'}
                            onChange={(e) => handleConfigChange('productType', e.target.value)}
                            >
                            <option value="general">General</option>
                            <option value="offer">Offer</option>
                            <option value="exchange">Exchange</option>
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                            <select 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={localConfig.priceType || ''}
                            onChange={handlePriceTypeChange}
                            >
                            <option value="">-- Select Price Type --</option>
                            <option value="hireCash">Hire Cash Price</option>
                            <option value="hmrp">HMRP</option>
                            <option value="hireOutstanding">Hire Outstanding</option>
                            <option value="hireValue">Hire Value</option>
                            </select>
                        </div>
                        
                        {localConfig.priceType === 'hireCash' && (
                            <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                % Load on {localConfig.productType === 'general' ? 'MRP' : 
                                        localConfig.productType === 'offer' ? 'Offer Price' : 'Exchange Price'}
                            </label>
                            <input
                                type="number"
                                value={localConfig.hireCashPercentage || 2}
                                onChange={(e) => handleConfigChange('hireCashPercentage', Number(e.target.value))}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            </div>
                        )}
                        
                        {localConfig.priceType === 'hmrp' && (
                            <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                % Load on Hire Cash Price
                            </label>
                            <input
                                type="number"
                                value={localConfig.hmrpPercentage || 9}
                                onChange={(e) => handleConfigChange('hmrpPercentage', Number(e.target.value))}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            </div>
                        )}
                        
                        {localConfig.priceType === 'hireOutstanding' && (
                            <>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                % Down Payment on HMRP
                                </label>
                                <input
                                type="number"
                                value={localConfig.downPaymentPercentage || 20}
                                onChange={(e) => handleConfigChange('downPaymentPercentage', Number(e.target.value))}
                                min="0"
                                max="100"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                % Load on Rest of HMRP
                                </label>
                                <input
                                type="number"
                                value={localConfig.outstandingPercentage || 16}
                                onChange={(e) => handleConfigChange('outstandingPercentage', Number(e.target.value))}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            </>
                        )}
                        
                        {(localConfig.priceType === 'hireOutstanding' || localConfig.priceType === 'hireValue') && (
                            <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hire Duration (Months)
                            </label>
                            <input
                                type="number"
                                value={localConfig.hireDuration || 12}
                                onChange={(e) => handleConfigChange('hireDuration', Number(e.target.value))}
                                min="1"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            </div>
                        )}
                        </>
                    );
                
                case 'duration':
                    return (
                        <>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration Type</label>
                            <select 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={localConfig.durationType || 'monthly'}
                            onChange={(e) => handleConfigChange('durationType', e.target.value)}
                            >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration Value
                            </label>
                            <input
                            type="number"
                            value={localConfig.duration || 12}
                            onChange={(e) => handleConfigChange('duration', Number(e.target.value))}
                            min="1"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        </>
                    );
                
                case 'processingFees':
                    return (
                        <>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                            <select 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={localConfig.feeType || 'percentage'}
                            onChange={(e) => handleConfigChange('feeType', e.target.value)}
                            >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            {localConfig.feeType === 'percentage' ? 'Fee Percentage' : 'Fee Amount'}
                            </label>
                            <input
                            type="number"
                            value={localConfig.feeValue || 2}
                            onChange={(e) => handleConfigChange('feeValue', Number(e.target.value))}
                            min="0"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        </>
                    );
                
                default:
                return null;
            }
        };
        
        // Render formula based on group configuration
        const renderFormula = (): JSX.Element | null => {
            if (!group.type) return null;
            
            switch (group.type) {
                case 'price':
                if (!localConfig.priceType) return null;
                
                let basePriceType = 'MRP';
                if (localConfig.productType === 'offer') basePriceType = 'Offer Price';
                if (localConfig.productType === 'exchange') basePriceType = 'Exchange Price';
                
                switch (localConfig.priceType) {
                    case 'hireCash':
                    return (
                        <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Formula:</div>
                        <div className="font-bold">Hire Cash Price = {basePriceType} + {localConfig.hireCashPercentage || 2}% Load on {basePriceType}</div>
                        </div>
                    );
                    
                    case 'hmrp':
                    return (
                        <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Formula:</div>
                        <div className="font-bold">HMRP = Hire Cash Price + {localConfig.hmrpPercentage || 9}% Load on Hire Cash Price</div>
                        </div>
                    );
                    
                    case 'hireOutstanding':
                    return (
                        <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Formula:</div>
                        <div className="font-bold">
                            Hire Outstanding = (HMRP - {localConfig.downPaymentPercentage || 20}% Down Payment) + 
                            {localConfig.outstandingPercentage || 16}% Load on Rest of HMRP
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                            Monthly Payment = Hire Outstanding / {localConfig.hireDuration || 12} months
                        </div>
                        </div>
                    );
                    
                    case 'hireValue':
                    return (
                        <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Formula:</div>
                        <div className="font-bold">Hire Value = Hire Outstanding + Down Payment</div>
                        </div>
                    );
                    
                    default:
                    return null;
                }
                
                case 'duration':
                return (
                    <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Duration:</div>
                    <div className="font-bold">
                        {localConfig.duration || 12} {localConfig.durationType || 'monthly'} {localConfig.durationType === 'monthly' ? 'months' : 
                        localConfig.durationType === 'quarterly' ? 'quarters' : 'years'}
                    </div>
                    </div>
                );
                
                case 'processingFees':
                return (
                    <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Processing Fee:</div>
                    <div className="font-bold">
                        {localConfig.feeType === 'percentage' ? 
                        `${localConfig.feeValue || 2}% of the base amount` : 
                        `Fixed fee of ${localConfig.feeValue || 2} currency units`}
                    </div>
                    </div>
                );
                
                default:
                return null;
            }
        };
        
        // Calculate left padding based on nesting level
        const paddingStyle = {
        marginLeft: `${level * 20}px`
        };
        
        return (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white" style={paddingStyle}>
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm mr-2">
                        {level + 1}
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">{group.name || 'Unnamed Group'}</h3>
                    </div>
                    <button 
                        onClick={() => removeGroup(group.id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        Remove
                    </button>
                </div>
                    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                        <input
                        type="text"
                        value={group.name}
                        onChange={handleNameChange}
                        placeholder="Enter group name"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
                        <select 
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={group.type}
                        onChange={handleTypeChange}
                        >
                        <option value="">-- Select Type --</option>
                        <option value="price">Price</option>
                        <option value="duration">Duration</option>
                        <option value="processingFees">Processing Fees</option>
                        </select>
                    </div>
                </div>
                    
                {/* Configuration options based on group type */}
                {renderConfigOptions()}
                
                {/* Formula display */}
                {renderFormula()}
                
                {/* Child groups */}
                <div className="mt-4">
                    {group.children && group.children.map(childGroup => (
                        <RuleGroup key={childGroup.id} group={childGroup} level={level + 1} />
                    ))}
                </div>
                
                {/* Change to Price Type selection button (replaces Add Nested Group) */}
                { (
                <div className="mt-4">
                    <button 
                    // onClick={() => updatePriceType(group.id, 'hireCash')}
                    onClick={addGroup}
 
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                    >
                    <span className="mr-1">+</span> Add Price Configuration
                    </button>
                </div>
                )}
            </div>
        );
    };
  
  // Generate summary of all rules
  const renderRuleSummary = (): JSX.Element | null => {
    if (ruleGroups.length === 0) return null;
    
    const summarizeGroup = (group: RuleGroup, level = 0): string[] => {
      let summary: string[] = [];
      
      // Add this group's summary
      if (group.type) {
        const indent = '  '.repeat(level);
        let ruleSummary = `${indent}• ${group.name || 'Unnamed Group'}: `;
        
        switch (group.type) {
          case 'price':
            if (group.config.priceType) {
              const basePriceType = group.config.productType === 'general' ? 'MRP' : 
                                   group.config.productType === 'offer' ? 'Offer Price' : 'Exchange Price';
              
              switch (group.config.priceType) {
                case 'hireCash':
                  ruleSummary += `Hire Cash Price = ${basePriceType} + ${group.config.hireCashPercentage || 2}% Load`;
                  break;
                case 'hmrp':
                  ruleSummary += `HMRP = Hire Cash Price + ${group.config.hmrpPercentage || 9}% Load`;
                  break;
                case 'hireOutstanding':
                  ruleSummary += `Hire Outstanding = (HMRP - Down Payment) + ${group.config.outstandingPercentage || 16}% Load`;
                  break;
                case 'hireValue':
                  ruleSummary += `Hire Value = Hire Outstanding + Down Payment`;
                  break;
              }
            } else {
              ruleSummary += `No price type selected`;
            }
            break;
            
          case 'duration':
            ruleSummary += `${group.config.duration || 12} ${group.config.durationType || 'monthly'} periods`;
            break;
            
          case 'processingFees':
            ruleSummary += group.config.feeType === 'percentage' ? 
              `${group.config.feeValue || 2}% fee` : 
              `Fixed fee of ${group.config.feeValue || 2} units`;
            break;
            
          default:
            ruleSummary += `No configuration`;
        }
        
        summary.push(ruleSummary);
      }
      
      // Add child groups' summaries
      if (group.children && group.children.length) {
        group.children.forEach(child => {
          summary = [...summary, ...summarizeGroup(child, level + 1)];
        });
      }
      
      return summary;
    };
    
    let allSummaries: string[] = [];
    ruleGroups.forEach(group => {
      allSummaries = [...allSummaries, ...summarizeGroup(group)];
    });
    
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Rule Summary</h2>
        <div className="text-sm text-gray-600">
          {allSummaries.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </div>
    );
  };
  
  // Main render
  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">TypeScript Rule Builder</h1>
        
        {/* Add top-level group button */}
        <button 
            onClick={addGroup}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            + Add Group
        </button>
      
        {/* Render all groups */}
        <div className="mt-4">
            {ruleGroups.map(group => (
            <RuleGroup key={group.id} group={group} />
            ))}
        </div>
      
        {/* Display rule summary */}
        {renderRuleSummary()}
        
        {/* JSON output for debugging */}
        {ruleGroups.length > 0 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">Rule Configuration JSON</h3>
                <pre className="text-xs text-gray-300 overflow-auto max-h-40">
                    {JSON.stringify(ruleGroups, null, 2)}
                </pre>
            </div>
        )}
    </div>
  );
};

export default DynamicNestedRuleBuilder;