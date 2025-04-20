import { ChildProcess } from "child_process";

interface ChildProps {
    color: string;
    onClick: () => void;
}



//can't understand that it is a react component
export const Child = ({color, onClick}: ChildProps) => {
    return <div>
        {color}
        <button onClick={onClick}>Click me</button>

    </div>; 
};



export const ChildAsFC: React.FC<ChildProps> = ({color}, onClick) => {
    return <div>
        {color}
        <button onClick={onClick}>Click me</button>

    </div>
}


ChildAsFC.displayName

