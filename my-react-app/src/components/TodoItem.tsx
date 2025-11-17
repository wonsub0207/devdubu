import type { Todo } from '../types/todo';
import '../styles/TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 개별 투두 아이템 컴포넌트
 */
export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      high: '🔴 높음',
      medium: '🟡 중간',
      low: '🟢 낮음',
    };
    return labels[priority] || priority;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
        <div className="todo-text">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          <div className="todo-meta">
            <span className="priority-badge">{getPriorityLabel(todo.priority)}</span>
            <span className="created-date">생성: {formatDate(todo.createdAt)}</span>
          </div>
        </div>
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        title="삭제"
      >
        ✕
      </button>
    </div>
  );
};
