import { useState } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { Calendar } from './components/Calendar';
import { useTodos } from './hooks/useTodos';
import './App.css';

function App() {
  const {
    todos,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos,
  } = useTodos();

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedTodoCount = todos.filter((todo) => todo.completed).length;

  if (isLoading) {
    return (
      <div className="app">
        <div className="app-container">
          <header className="app-header">
            <h1>📝 TodoMate</h1>
            <p>효율적인 투두 관리를 위한 앱입니다</p>
          </header>
          <main className="app-main loading">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>데이터 로드 중...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>📝 TodoMate</h1>
          <p>효율적인 투두 관리를 위한 앱입니다</p>
        </header>

        <main className="app-main">
          <div className="view-tabs">
            <button
              className={`view-tab ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              📋 리스트
            </button>
            <button
              className={`view-tab ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              📅 달력
            </button>
          </div>

          {activeTab === 'list' ? (
            <>
              <TodoInput onAddTodo={addTodo} />

              <div className="filter-tabs">
                <button
                  className={`tab ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  모두 ({todos.length})
                </button>
                <button
                  className={`tab ${filter === 'active' ? 'active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  진행 중 ({activeTodoCount})
                </button>
                <button
                  className={`tab ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  완료됨 ({completedTodoCount})
                </button>
              </div>

              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                filter={filter}
              />

              {completedTodoCount > 0 && (
                <button
                  className="clear-completed-btn"
                  onClick={clearCompletedTodos}
                >
                  완료된 투두 삭제
                </button>
              )}
            </>
          ) : (
            <Calendar
              todos={todos}
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
