import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'https://cms.laurence.host/api/tasks';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  favorite: boolean;
}

type Filter = 'all' | 'completed' | 'incomplete' | 'favorites';

interface TodoStore {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  filter: Filter;
  fetchTasks: () => void;
  addTask: (title: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  toggleFavorite: (id: number) => void;
  setFilter: (filter: Filter) => void;
  loadMore: () => void;
  applyFilter: (tasks: Task[]) => void;
  page: number;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  loading: false,
  filter: 'all',
  page: 1,

  fetchTasks: async () => {
    set({ loading: true });
    const { page, tasks } = get();
    const res = await axios.get(`${API_URL}?page=${page}`);
    const newTasks = res.data.data.map((task: any) => ({
      ...task,
      favorite: JSON.parse(localStorage.getItem('favorites') || '[]').includes(task.id)
    }));
    const combinedTasks = [...tasks, ...newTasks];
    set({ tasks: combinedTasks, loading: false });
    get().applyFilter(combinedTasks);
  },

  addTask: async (title: string) => {
    const res = await axios.post(API_URL, {
      data: {
        title: title,
        description: "New task description", // можно изменить по желанию
        status: "pending"
      }
    });
  
    const newTask = {
      id: res.data.data.id,
      ...res.data.data.attributes,
      favorite: false
    };
  
    const updatedTasks = [newTask, ...get().tasks];
    set({ tasks: updatedTasks });
    get().applyFilter(updatedTasks);
  },

  toggleTask: async (id: number) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    await axios.put(`${API_URL}/${id}`, { completed: !task.completed });
    const updatedTasks = get().tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    set({ tasks: updatedTasks });
    get().applyFilter(updatedTasks);
  },

  deleteTask: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    const updatedTasks = get().tasks.filter(t => t.id !== id);
    set({ tasks: updatedTasks });
    get().applyFilter(updatedTasks);
  },

  toggleFavorite: (id: number) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((favId: number) => favId !== id)
      : [...favorites, id];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    const updatedTasks = get().tasks.map(t =>
      t.id === id ? { ...t, favorite: !t.favorite } : t
    );
    set({ tasks: updatedTasks });
    get().applyFilter(updatedTasks);
  },

  setFilter: (filter: Filter) => {
    set({ filter });
    get().applyFilter(get().tasks);
  },

  applyFilter: (tasks: Task[]) => {
    const { filter } = get();
    let filtered;
    if (filter === 'completed') filtered = tasks.filter(t => t.completed);
    else if (filter === 'incomplete') filtered = tasks.filter(t => !t.completed);
    else if (filter === 'favorites') filtered = tasks.filter(t => t.favorite);
    else filtered = tasks;
    set({ filteredTasks: filtered });
  },

  loadMore: () => {
    const { page, fetchTasks } = get();
    set({ page: page + 1 });
    fetchTasks(); 
  }
}));
