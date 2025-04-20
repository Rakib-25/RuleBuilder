import React, { useState } from 'react';

const RuleBuilder = () => {
  const [field, setField] = useState('');
  const [condition, setCondition] = useState('');
  const [value, setValue] = useState('');
  const [rules, setRules] = useState<any[]>([]);

  const addRule = () => {
    if (!field || !condition || !value) return;
    const newRule = { field, condition, value };
    setRules([...rules, newRule]);
    setField('');
    setCondition('');
    setValue('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Rule Builder</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Field"
            value={field}
            onChange={(e) => setField(e.target.value)}
          />
          <input
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
          <input
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button
          onClick={addRule}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Add Rule
        </button>

        {rules.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">Current Rules</h2>
            <ul className="space-y-1">
              {rules.map((rule, index) => (
                <li
                  key={index}
                  className="bg-gray-50 border p-3 rounded text-sm text-gray-700"
                >
                  {rule.field} {rule.condition} {rule.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {rules.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">JSON Output</h2>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
              {JSON.stringify(rules, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleBuilder;
