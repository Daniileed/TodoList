import React, { useEffect, useState } from 'react';
import { Button, Input, List, Checkbox, Spin, Select } from 'antd';
import styled from 'styled-components';
import { useTodoStore } from '../store/store';

const { Option } = Select;

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
`;

const TodoApp: React.FC = () => {
  const {
    filteredTasks,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    toggleFavorite,
    filter,
    setFilter,
    loading,
    loadMore
  } = useTodoStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10 && !loading) {
      loadMore();
    }
  };

  return (
    <Container>
      <h1>Todo List</h1>

      <Input
        placeholder="New task"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onPressEnter={handleAdd}
      />
      <Button onClick={handleAdd} style={{ marginTop: '1rem' }}>
        Add Task
      </Button>

      <Select
        style={{ width: 200, margin: '1rem 0' }}
        value={filter}
        onChange={setFilter}
      >
        <Option value="all">All</Option>
        <Option value="completed">Completed</Option>
        <Option value="incomplete">Incomplete</Option>
        <Option value="favorites">Favorites</Option>
      </Select>

      <div
        style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}
        onScroll={handleScroll}
      >
        <List
          dataSource={filteredTasks}
          renderItem={(task) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => toggleTask(task.id)}>
                  {task.completed ? 'Undo' : 'Complete'}
                </Button>,
                <Button type="link" danger onClick={() => deleteTask(task.id)}>
                  Delete
                </Button>,
                <Button type="text" onClick={() => toggleFavorite(task.id)}>
                  {task.favorite ? '★' : '☆'}
                </Button>,
              ]}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              >
                {task.title}
              </Checkbox>
            </List.Item>
          )}
        />
        {loading && <Spin style={{ display: 'block', marginTop: '1rem' }} />}
      </div>
    </Container>
  );
};

export default TodoApp;