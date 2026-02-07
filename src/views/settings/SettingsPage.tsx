import { useState } from 'react';
import { Plus, Trash2, Users, Flag, Tag } from 'lucide-react';
import { TeamMember, Priority, Category } from '../../types';
import { PRIORITY_COLORS, DEFAULT_CATEGORY_COLORS } from '../../constants';
import { generateId } from '../../utils/ids';
import { useDataContext } from '../../context';

export function SettingsPage() {
  const {
    teamMembers,
    priorities,
    categories,
    saveTeamMember,
    deleteTeamMember,
    savePriority,
    deletePriority,
    saveCategory,
    deleteCategory,
  } = useDataContext();

  const [newMemberName, setNewMemberName] = useState('');
  const [newPriorityColor, setNewPriorityColor] = useState('gray-400');
  const [newPriorityLevel, setNewPriorityLevel] = useState(5);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('blue-400');

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

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const category: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      color: newCategoryColor,
      created_at: Date.now(),
    };
    saveCategory(category);
    setNewCategoryName('');
    setNewCategoryColor('blue-400');
  };

  const sortedPriorities = [...priorities].sort((a, b) => a.level - b.level);
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const getColorLabel = (colorValue: string) => {
    return PRIORITY_COLORS.find(c => c.value === colorValue)?.label || colorValue;
  };
  const getCategoryColorLabel = (colorValue: string) => {
    return DEFAULT_CATEGORY_COLORS.find(c => c.value === colorValue)?.label || colorValue;
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-gray-100 mb-6">Configuración</h1>

      <div className="space-y-6">
        {/* Team Members Section */}
        <section className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Users size={18} /> Miembros del equipo
          </h3>
          <div className="space-y-2 mb-3">
            {teamMembers.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
              >
                <span className="text-sm">{member.name}</span>
                <button
                  onClick={() => deleteTeamMember(member.id)}
                  className="p-2 hover:bg-gray-600 rounded text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <p className="text-gray-500 text-sm italic">Sin miembros</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              placeholder="Nombre del miembro"
              className="flex-1 border border-gray-700 rounded-lg px-3 py-2 text-sm"
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
        <section className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Flag size={18} /> Niveles de prioridad
          </h3>
          <div className="space-y-2 mb-3">
            {sortedPriorities.map(priority => (
              <div
                key={priority.id}
                className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 bg-${priority.color} flex items-center justify-center`}
                  >
                    <span className="text-xs font-bold text-white">{priority.level}</span>
                  </div>
                  <span className="text-sm text-gray-400">{getColorLabel(priority.color)}</span>
                </div>
                <button
                  onClick={() => deletePriority(priority.id)}
                  className="p-2 hover:bg-gray-600 rounded text-red-400 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {priorities.length === 0 && (
              <p className="text-gray-500 text-sm italic">Sin prioridades definidas</p>
            )}
          </div>
          <div className="space-y-3 bg-gray-800 p-3 rounded-lg">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Nivel (1-10)</label>
                <select
                  value={newPriorityLevel}
                  onChange={e => setNewPriorityLevel(Number(e.target.value))}
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                    <option
                      key={level}
                      value={level}
                      disabled={priorities.some(p => p.level === level)}
                    >
                      {level} {priorities.some(p => p.level === level) ? '(usado)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <select
                  value={newPriorityColor}
                  onChange={e => setNewPriorityColor(e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm"
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

        {/* Categories Section */}
        <section className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Tag size={18} /> Categorías
          </h3>
          <div className="space-y-2 mb-3">
            {sortedCategories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 bg-${category.color}`} />
                  <span className="text-sm">{category.name}</span>
                  <span className="text-xs text-gray-500">
                    {getCategoryColorLabel(category.color)}
                  </span>
                </div>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-2 hover:bg-gray-600 rounded text-red-400 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-gray-500 text-sm italic">Sin categorías definidas</p>
            )}
          </div>
          <div className="space-y-3 bg-gray-800 p-3 rounded-lg">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="Nombre de la categoría"
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm"
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <select
                  value={newCategoryColor}
                  onChange={e => setNewCategoryColor(e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 text-sm"
                >
                  {DEFAULT_CATEGORY_COLORS.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} /> Añadir categoría
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
