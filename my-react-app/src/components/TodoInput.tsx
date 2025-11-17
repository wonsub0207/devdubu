import { useState } from 'react';
import type { CreateTodoInput } from '../types/todo';
import '../styles/TodoInput.css';

interface TodoInputProps {
  onAddTodo: (todo: CreateTodoInput) => void;
}

/**
 * 새로운 투두를 입력받는 컴포넌트
 */
export const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <button className="add-todo-btn" onClick={() => setShowForm(true)}>
        ➕ 새 투두 추가
      </button>
    );
  }

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="투두 제목 입력..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-title"
          autoFocus
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="설명 (선택사항)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-description"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">우선순위:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="input-priority"
          >
            <option value="low">낮음</option>
            <option value="medium">중간</option>
            <option value="high">높음</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">마감일:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-date"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          추가
        </button>
        <button
          type="button"
          className="btn-cancel"
          onClick={() => setShowForm(false)}
        >
          취소
        </button>
      </div>
    </form>
  );
};
