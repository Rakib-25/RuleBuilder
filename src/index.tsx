import ReactDOM from 'react-dom';
import ImprovedRuleBuilder from './components/improved_rule_builder'; // Adjusted the path to match the correct location

// import './styles/basic.css';
 // Adjust path based on your file location // Adjusted the path to match the correct location

 import './index.css';
import DynamicNestedRuleBuilder from './components/WaltonPolicy';
import HireSellPolicy from './Policy/RuleBuilder';
import RuleGroupComponent from './components/rule_group';

ReactDOM.render(< ImprovedRuleBuilder/>, document.querySelector('#root'));
