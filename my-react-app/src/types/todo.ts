/**
 * Todo 인터페이스
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Todo 생성 요청
 */
export type CreateTodoInput = Omit<Todo, 'id' | 'createdAt'>;

/**
 * Todo 업데이트 요청
 */
export type UpdateTodoInput = Partial<CreateTodoInput>;
