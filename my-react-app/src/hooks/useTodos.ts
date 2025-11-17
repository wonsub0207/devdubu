import { useState, useCallback, useEffect } from 'react';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { todoDatabase } from '../lib/database';

/**
 * 투두 목록 관리 커스텀 훅
 */
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 데이터베이스에서 투두 로드
   */
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await todoDatabase.getAllTodos();
        setTodos(savedTodos);
      } catch (error) {
        console.error('Failed to load todos from database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  /**
   * 새로운 투두 생성
   */
  const addTodo = useCallback((input: CreateTodoInput) => {
    const newTodo: Todo = {
      ...input,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    
    // 데이터베이스에 저장
    todoDatabase.addTodo(newTodo).catch((error) => {
      console.error('Failed to save todo:', error);
    });
    
    return newTodo;
  }, []);

  /**
   * 투두 업데이트
   */
  const updateTodo = useCallback((id: string, updates: UpdateTodoInput) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          const updatedTodo = { ...todo, ...updates };
          // 데이터베이스에 저장
          todoDatabase.updateTodo(updatedTodo).catch((error) => {
            console.error('Failed to update todo:', error);
          });
          return updatedTodo;
        }
        return todo;
      })
    );
  }, []);

  /**
   * 투두 삭제
   */
  const deleteTodo = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    
    // 데이터베이스에서 삭제
    todoDatabase.deleteTodo(id).catch((error) => {
      console.error('Failed to delete todo:', error);
    });
  }, []);

  /**
   * 투두 완료 상태 토글
   */
  const toggleTodo = useCallback((id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          const updatedTodo = { ...todo, completed: !todo.completed };
          // 데이터베이스에 저장
          todoDatabase.updateTodo(updatedTodo).catch((error) => {
            console.error('Failed to toggle todo:', error);
          });
          return updatedTodo;
        }
        return todo;
      })
    );
  }, []);

  /**
   * 모든 투두 삭제
   */
  const clearAllTodos = useCallback(() => {
    setTodos([]);
    
    // 데이터베이스에서 모두 삭제
    todoDatabase.clearAllTodos().catch((error) => {
      console.error('Failed to clear all todos:', error);
    });
  }, []);

  /**
   * 완료된 투두만 삭제
   */
  const clearCompletedTodos = useCallback(() => {
    setTodos((prevTodos) => {
      const completedIds = prevTodos
        .filter((todo) => todo.completed)
        .map((todo) => todo.id);

      // 각 완료된 투두를 데이터베이스에서 삭제
      completedIds.forEach((id) => {
        todoDatabase.deleteTodo(id).catch((error) => {
          console.error('Failed to delete completed todo:', error);
        });
      });

      return prevTodos.filter((todo) => !todo.completed);
    });
  }, []);

  /**
   * 우선순위별로 정렬된 투두 반환
   */
  const getTodosSortedByPriority = useCallback(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...todos].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [todos]);

  /**
   * 완료되지 않은 투두 개수
   */
  const getActiveTodoCount = useCallback(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  /**
   * 완료된 투두 개수
   */
  const getCompletedTodoCount = useCallback(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  return {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearAllTodos,
    clearCompletedTodos,
    getTodosSortedByPriority,
    getActiveTodoCount,
    getCompletedTodoCount,
  };
};
