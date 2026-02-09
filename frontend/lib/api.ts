/**
 * API Client for Backend Communication
 * Handles all HTTP requests to the FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Get authorization token from Better Auth
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Better Auth stores the session token in a cookie
  // We need to get it from the cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'better-auth.session_token') {
      console.log('Found Better Auth token in cookie');
      return value;
    }
  }

  // Fallback: try localStorage
  const token = localStorage.getItem('better-auth.session_token');
  if (token) {
    console.log('Found Better Auth token in localStorage');
    return token;
  }

  console.warn('No Better Auth token found');
  return null;
}

/**
 * Make an authenticated API request with timeout
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log(`Making API request to ${endpoint} with token`);
  } else {
    console.warn(`Making API request to ${endpoint} WITHOUT token`);
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log(`API response from ${endpoint}: ${response.status}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      console.error(`API error from ${endpoint}:`, error);

      // If 401, redirect to login
      if (response.status === 401) {
        console.error('Unauthorized - redirecting to login');
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
      }

      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    console.log(`API success from ${endpoint}:`, data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`API request timeout for ${endpoint}`);
      throw new Error('Request timeout - please check your connection');
    }

    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Get all tasks for a user
 */
export async function getTasks(
  userId: string,
  status?: 'all' | 'pending' | 'completed',
  sort?: 'created_at' | 'title'
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (sort) params.append('sort', sort);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<Task[]>(`/api/${userId}/tasks${query}`);
}

/**
 * Get a single task by ID
 */
export async function getTask(userId: string, taskId: number): Promise<Task> {
  return apiRequest<Task>(`/api/${userId}/tasks/${taskId}`);
}

/**
 * Create a new task
 */
export async function createTask(userId: string, data: TaskCreate): Promise<Task> {
  return apiRequest<Task>(`/api/${userId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing task
 */
export async function updateTask(
  userId: string,
  taskId: number,
  data: TaskUpdate
): Promise<Task> {
  return apiRequest<Task>(`/api/${userId}/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a task
 */
export async function deleteTask(userId: string, taskId: number): Promise<void> {
  return apiRequest<void>(`/api/${userId}/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

/**
 * Toggle task completion status
 */
export async function toggleTaskComplete(userId: string, taskId: number): Promise<Task> {
  return apiRequest<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
    method: 'PATCH',
  });
}
