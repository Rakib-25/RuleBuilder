import { useEffect, useState, useRef } from "react";



const users = [
    {name : 'rakib', age: 20},
    {name : 'sakib', age: 20},
    {name: 'rofique', age: 20}
]

type Todo = {id: number, title: string};

const UserSearch: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [user, setUser] = useState<{name: string, age: number} | undefined>();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [todos, setTodos] = useState<Todo[] | []>([]);



    // useRef is used to get the reference of the input element
    // and focus on it when the component is mounted
    useEffect(() => {
        if (inputRef.current) { 
            inputRef.current.focus();
        }
    }, []);



    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }


    const onClick = () => {
        const foundUser = users.find((user) => {
            return user.name === name;
        });
        setUser(foundUser);
    };




    const fetchData = async () => {
        const data = fetch('https://jsonplaceholder.typicode.com/todos');
        const res = await data;
        const d = await res.json();
        setTodos(d);
        console.log('I am here');
    }



    // useEffect is used to fetch data when the component is mounted
    // and when the name state is changed
    // useEffect(() => {
    //     fetchData();
    // }, [name]);


    

    return <div>
        <input ref={inputRef} value={name} onChange={onChange} />

        <button onClick={onClick}>Find User</button>

        <div>
            {user?.name ?? 'not set'}
            {user?.age ?? '0'}
        </div>

        <div>
            {todos.map((todo: Todo) => (
                <div key={todo.id}>
                    {todo.id}
                </div>
            ))}
        </div>
    </div>
}



export default UserSearch;