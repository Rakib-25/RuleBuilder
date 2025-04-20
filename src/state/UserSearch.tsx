import { useEffect, useState } from "react";



const users = [
    {name : 'rakib', age: 20},
    {name : 'sakib', age: 20},
    {name: 'rofique', age: 20}
]

type Todo = {id: number, title: string};

const UserSearch: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [user, setUser] = useState<{name: string, age: number} | undefined>();

    const [todos, setTodos] = useState<Todo[] | []>([]);


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



    useEffect(() => {
        fetchData();
    }, [name]);


    

    return <div>
        <input value={name} onChange={onChange} />

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