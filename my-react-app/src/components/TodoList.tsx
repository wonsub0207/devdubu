import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import '../styles/TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filter?: 'all' | 'active' | 'completed';
}

/**
 * 투두 목록을 표시하는 컴포넌트
 */
export const TodoList = ({
  todos,
  onToggle,
  onDelete,
  filter = 'all',
}: TodoListProps) => {
  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>
          {filter === 'active' && '진행 중인 투두가 없습니다.'}
          {filter === 'completed' && '완료된 투두가 없습니다.'}
          {filter === 'all' && '투두가 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
