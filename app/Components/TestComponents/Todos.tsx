import { memo } from "react";

const Todos = ({ todos } : { todos: any }) => {
  console.log("TODO render");
  return (
    <>
      <h2>My Todos</h2>
      {todos.map((todo: any, index: any) => {
        return <p key={index}>{todo}</p>;
      })}
    </>
  );
};

export default memo(Todos);