import { useState, useMemo } from 'react';
import type { Todo } from '../types/todo';
import '../styles/Calendar.css';

interface CalendarProps {
  todos: Todo[];
  onSelectDate: (date: Date | null) => void;
  selectedDate: Date | null;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

/**
 * 캘린더 컴포넌트 - 마감일 기준으로 투두를 표시
 */
export const Calendar = ({
  todos,
  onSelectDate,
  selectedDate,
  onToggleTodo,
  onDeleteTodo,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 달의 첫 날 계산
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // 선택된 날짜의 투두 목록
  const selectedDateTodos = useMemo(() => {
    if (!selectedDate) return [];
    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return (
        todoDate.getFullYear() === selectedDate.getFullYear() &&
        todoDate.getMonth() === selectedDate.getMonth() &&
        todoDate.getDate() === selectedDate.getDate()
      );
    });
  }, [todos, selectedDate]);

  // 각 날짜별 투두 개수 맵
  const todosByDate = useMemo(() => {
    const map = new Map<string, { total: number; completed: number }>();
    todos.forEach((todo) => {
      if (!todo.dueDate) return;
      const todoDate = new Date(todo.dueDate);
      const key = `${todoDate.getFullYear()}-${todoDate.getMonth()}-${todoDate.getDate()}`;
      const current = map.get(key) || { total: 0, completed: 0 };
      current.total++;
      if (todo.completed) current.completed++;
      map.set(key, current);
    });
    return map;
  }, [todos]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    if (date.getMonth() === currentDate.getMonth()) {
      onSelectDate(date);
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  };

  const days = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000));
  }

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const getTodoStats = (date: Date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return todosByDate.get(key) || { total: 0, completed: 0 };
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth}>
          ◀
        </button>
        <h2>{formatMonthYear(currentDate)}</h2>
        <button className="nav-btn" onClick={handleNextMonth}>
          ▶
        </button>
      </div>

      <div className="calendar-weekdays">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, idx) => {
          const stats = getTodoStats(date);
          const isCurrentMonth = isDateInCurrentMonth(date);
          const isSelected = isDateSelected(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={idx}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
                isSelected ? 'selected' : ''
              } ${isTodayDate ? 'today' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              <div className="day-number">{date.getDate()}</div>
              {stats.total > 0 && (
                <div className="todo-indicator">
                  {stats.completed}/{stats.total}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="calendar-selected-todos">
          <div className="selected-date-header">
            <h3>{selectedDate.toLocaleDateString('ko-KR', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <button
              className="close-btn"
              onClick={() => onSelectDate(null)}
              title="닫기"
            >
              ✕
            </button>
          </div>
          {selectedDateTodos.length === 0 ? (
            <p className="no-todos">이날의 투두가 없습니다.</p>
          ) : (
            <div className="selected-todos-list">
              {selectedDateTodos.map((todo) => (
                <div key={todo.id} className="calendar-todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                    className="calendar-checkbox"
                  />
                  <div className="calendar-todo-content">
                    <p className={`calendar-todo-title ${todo.completed ? 'completed' : ''}`}>
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="calendar-todo-desc">{todo.description}</p>
                    )}
                  </div>
                  <button
                    className="calendar-delete-btn"
                    onClick={() => onDeleteTodo(todo.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
