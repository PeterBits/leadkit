import { MessageSquare, AlertTriangle, Trophy, ListTodo } from 'lucide-react';

export const CATEGORIES = {
  'discussion': { label: 'A discutir', icon: MessageSquare, color: 'bg-blue-100 text-blue-700' },
  'blocker': { label: 'Blocker', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
  'achievement': { label: 'Logro', icon: Trophy, color: 'bg-green-100 text-green-700' },
  'action-item': { label: 'Action Item', icon: ListTodo, color: 'bg-purple-100 text-purple-700' }
};

export const PRIORITY_COLORS = [
  { value: 'gray-400', label: 'Gris', bg: 'bg-gray-400' },
  { value: 'blue-400', label: 'Azul', bg: 'bg-blue-400' },
  { value: 'green-400', label: 'Verde', bg: 'bg-green-400' },
  { value: 'yellow-400', label: 'Amarillo', bg: 'bg-yellow-400' },
  { value: 'orange-400', label: 'Naranja', bg: 'bg-orange-400' },
  { value: 'red-400', label: 'Rojo', bg: 'bg-red-400' },
  { value: 'purple-400', label: 'Púrpura', bg: 'bg-purple-400' },
  { value: 'pink-400', label: 'Rosa', bg: 'bg-pink-400' },
];
