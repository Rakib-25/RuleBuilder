import { useState, useEffect, ChangeEvent } from "react";

interface Policy {
    id:string;
    name: string;
    type: string;
    children: Policy[];
}



const HireSellPolicy: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [idCounter, setIdCounter] = useState<number>(1);
      // State to hold the selected policy type
    const [selectedType, setSelectedType] = useState<string>('');
    



    const addPolicy = (): void => {
        console.log("Policy added");
        const newPolicy: Policy = {
            id: `group-${idCounter}`,
            name: '',
            type: '',
            children: []
        };
          
        setPolicies([...policies, newPolicy]);
        setIdCounter(idCounter + 1);

    }



    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.target.value);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">TypeScript Rule Builder</h1>
            
            {/* Add top-level group button */}
            <button  
                onClick={addPolicy}
                className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                + Add Group
            </button>
        
            {/* Render all groups */}
            <div className="mt-4">
                {policies.map(policy => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
                        <select 
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        // value={policy.type}
                        onChange={handleTypeChange}
                        >
                            <option value="">-- Select Type --</option>
                            <option value="price">Price</option>
                            <option value="duration">Duration</option>
                            <option value="processingFees">Processing Fees</option>
                        </select>

                        {console.log(policy.type)}

                        {selectedType === 'price' && (
                         <div>
                            to be implemented
                         </div>
  

                        )}
                        {selectedType === 'duration' && (
                            <div>
                            {/* Render content for duration */}
                            <p>Duration related content...</p>
                            </div>
                        )}
                        {selectedType === 'processingFees' && (
                            <div>
                            {/* Render content for processingFees */}
                            <p>Processing Fees related content...</p>
                            </div>
                        )}
                    </div>

                ))}
            </div>
        
            {/* Display rule summary */}
            {/* {renderRuleSummary()} */}
            
            {/* JSON output for debugging */}
            {/* {ruleGroups.length > 0 && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-white">Rule Configuration JSON</h3>
                    <pre className="text-xs text-gray-300 overflow-auto max-h-40">
                        {JSON.stringify(ruleGroups, null, 2)}
                    </pre>
                </div>
            )} */}
        </div>
    )
}


export default HireSellPolicy;