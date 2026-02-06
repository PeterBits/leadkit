import { MessageSquare, AlertTriangle, Trophy, ListTodo } from 'lucide-react';

export const CATEGORIES = {
  discussion: { label: 'A discutir', icon: MessageSquare, color: 'bg-blue-500/20 text-blue-300' },
  blocker: { label: 'Blocker', icon: AlertTriangle, color: 'bg-red-500/20 text-red-300' },
  achievement: { label: 'Logro', icon: Trophy, color: 'bg-green-500/20 text-green-300' },
  'action-item': {
    label: 'Action Item',
    icon: ListTodo,
    color: 'bg-purple-500/20 text-purple-300',
  },
};
