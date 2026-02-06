import { MessageSquare, AlertTriangle, Trophy, ListTodo } from 'lucide-react';

export const CATEGORIES = {
  discussion: { label: 'A discutir', icon: MessageSquare, color: 'bg-blue-100 text-blue-700' },
  blocker: { label: 'Blocker', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
  achievement: { label: 'Logro', icon: Trophy, color: 'bg-green-100 text-green-700' },
  'action-item': { label: 'Action Item', icon: ListTodo, color: 'bg-purple-100 text-purple-700' },
};
