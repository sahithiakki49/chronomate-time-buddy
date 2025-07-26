import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Plus, 
  Clock, 
  AlertCircle,
  Star,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { DateTime } from 'luxon';
import { toast } from 'sonner';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'health' | 'learning' | 'other';
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  aiSuggested?: boolean;
  streak?: number;
}

interface SmartTodoListProps {
  todos: TodoItem[];
  onAddTodo: (todo: Omit<TodoItem, 'id' | 'createdAt' | 'completed'>) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, updates: Partial<TodoItem>) => void;
}

export const SmartTodoList: React.FC<SmartTodoListProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<TodoItem['priority']>('medium');
  const [newTodoCategory, setNewTodoCategory] = useState<TodoItem['category']>('other');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'high-priority'>('all');

  const getCategoryIcon = (category: TodoItem['category']) => {
    switch (category) {
      case 'work': return <Target className="w-4 h-4" />;
      case 'personal': return <Star className="w-4 h-4" />;
      case 'health': return <AlertCircle className="w-4 h-4" />;
      case 'learning': return <TrendingUp className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
    }
  };

  const getCategoryColor = (category: TodoItem['category']) => {
    switch (category) {
      case 'work': return 'bg-blue-500/10 text-blue-500';
      case 'personal': return 'bg-purple-500/10 text-purple-500';
      case 'health': return 'bg-red-500/10 text-red-500';
      case 'learning': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'pending': return !todo.completed;
      case 'completed': return todo.completed;
      case 'high-priority': return todo.priority === 'high' && !todo.completed;
      default: return true;
    }
  });

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    onAddTodo({
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim() || undefined,
      priority: newTodoPriority,
      category: newTodoCategory,
      aiSuggested: false
    });

    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoPriority('medium');
    setNewTodoCategory('other');
    setShowAddForm(false);
    toast.success('Task added successfully!');
  };

  const handleToggleTodo = (id: string) => {
    onToggleTodo(id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      toast.success(todo.completed ? 'Task marked as incomplete' : 'Task completed! 🎉');
    }
  };

  const getCompletionStats = () => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length;
    
    return { total, completed, pending, highPriority };
  };

  const stats = getCompletionStats();

  return (
    <Card className="glass-strong p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold gradient-text">Today's Tasks</h3>
          <p className="text-muted-foreground">
            {stats.completed} of {stats.total} completed
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-primary">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-green-500">{stats.completed}</div>
          <div className="text-xs text-muted-foreground">Done</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-yellow-500">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-red-500">{stats.highPriority}</div>
          <div className="text-xs text-muted-foreground">Urgent</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'completed', 'high-priority'] as const).map((filterType) => (
          <Button
            key={filterType}
            size="sm"
            variant={filter === filterType ? "default" : "outline"}
            onClick={() => setFilter(filterType)}
            className="capitalize"
          >
            {filterType.replace('-', ' ')}
          </Button>
        ))}
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/30"
          >
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="What needs to be done?"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  className="text-lg"
                />
              </div>
              
              <div>
                <Input
                  placeholder="Description (optional)"
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <select
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value as TodoItem['priority'])}
                    className="w-full p-2 rounded border border-border bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={newTodoCategory}
                    onChange={(e) => setNewTodoCategory(e.target.value as TodoItem['category'])}
                    className="w-full p-2 rounded border border-border bg-background"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddTodo} className="flex-1">
                  Add Task
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Todo List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                todo.completed 
                  ? 'bg-muted/20 border-border/30 opacity-70' 
                  : 'bg-background border-border hover:border-primary/50'
              } ${todo.priority === 'high' && !todo.completed ? 'ring-1 ring-red-500/30' : ''}`}
            >
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleTodo(todo.id)}
                  className="mt-1 p-1 h-auto"
                >
                  {todo.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                        {todo.title}
                      </h4>
                      {todo.description && (
                        <p className={`text-sm text-muted-foreground mt-1 ${todo.completed ? 'line-through' : ''}`}>
                          {todo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(todo.priority)}`}
                        >
                          {todo.priority}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(todo.category)}`}
                        >
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(todo.category)}
                            {todo.category}
                          </div>
                        </Badge>
                        {todo.aiSuggested && (
                          <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-500">
                            AI Suggested
                          </Badge>
                        )}
                        {todo.streak && todo.streak > 1 && (
                          <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-500">
                            🔥 {todo.streak} day streak
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {todo.dueDate && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {DateTime.fromISO(todo.dueDate).toFormat('MMM d')}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTodo(todo.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTodos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            {filter === 'all' ? (
              <div>
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm">No tasks for today. Great job! 🎉</p>
              </div>
            ) : filter === 'completed' ? (
              <div>
                <Circle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No completed tasks yet</p>
                <p className="text-sm">Start checking off your to-dos!</p>
              </div>
            ) : (
              <div>
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm">Try changing your filter or add a new task</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((stats.completed / stats.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(stats.completed / stats.total) * 100}%` 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}; 