import { useState } from 'react';
import { Plus, Trash2, Users, Flag } from 'lucide-react';
import { TeamMember, Priority } from '../../types';
import { PRIORITY_COLORS } from '../../constants';
import { generateId } from '../../utils/ids';
import { useDataContext } from '../../context';

export function SettingsPage() {
  const { teamMembers, priorities, saveTeamMember, deleteTeamMember, savePriority, deletePriority } = useDataContext();

  const [newMemberName, setNewMemberName] = useState('');
  const [newPriorityColor, setNewPriorityColor] = useState('gray-400');
  const [newPriorityLevel, setNewPriorityLevel] = useState(5);

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const member: TeamMember = {
      id: generateId(),
      name: newMemberName.trim(),
      created_at: Date.now(),
    };
    saveTeamMember(member);
    setNewMemberName('');
  };

  const handleAddPriority = () => {
    if (priorities.some(p => p.level === newPriorityLevel)) {
      alert(`Ya existe una prioridad con nivel ${newPriorityLevel}`);
      return;
    }
    const priority: Priority = {
      id: generateId(),
      color: newPriorityColor,
      level: newPriorityLevel,
      created_at: Date.now(),
    };
    savePriority(priority);
    setNewPriorityColor('gray-400');
    setNewPriorityLevel(5);
  };

  const sortedPriorities = [...priorities].sort((a, b) => a.level - b.level);
  const getColorLabel = (colorValue: string) => {
    return PRIORITY_COLORS.find(c => c.value === colorValue)?.label || colorValue;
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Configuración</h1>

      <div className="space-y-6">
        {/* Team Members Section */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Users size={18} /> Miembros del equipo
          </h3>
          <div className="space-y-2 mb-3">
            {teamMembers.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <span className="text-sm">{member.name}</span>
                <button
                  onClick={() => deleteTeamMember(member.id)}
                  className="p-2 hover:bg-gray-200 rounded text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <p className="text-gray-400 text-sm italic">Sin miembros</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              placeholder="Nombre del miembro"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              onKeyDown={e => e.key === 'Enter' && handleAddMember()}
            />
            <button
              onClick={handleAddMember}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
            </button>
          </div>
        </section>

        {/* Priorities Section */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Flag size={18} /> Niveles de prioridad
          </h3>
          <div className="space-y-2 mb-3">
            {sortedPriorities.map(priority => (
              <div
                key={priority.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 bg-${priority.color} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">{priority.level}</span>
                  </div>
                  <span className="text-sm text-gray-600">{getColorLabel(priority.color)}</span>
                </div>
                <button
                  onClick={() => deletePriority(priority.id)}
                  className="p-2 hover:bg-gray-200 rounded text-red-500 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {priorities.length === 0 && (
              <p className="text-gray-400 text-sm italic">Sin prioridades definidas</p>
            )}
          </div>
          <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Nivel (1-10)</label>
                <select
                  value={newPriorityLevel}
                  onChange={e => setNewPriorityLevel(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                    <option key={level} value={level} disabled={priorities.some(p => p.level === level)}>
                      {level} {priorities.some(p => p.level === level) ? '(usado)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Color</label>
                <select
                  value={newPriorityColor}
                  onChange={e => setNewPriorityColor(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {PRIORITY_COLORS.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAddPriority}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={18} /> Añadir nivel
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
