import { Users } from 'lucide-react';
import { useDataContext } from '../../context';

export function TeamPage() {
  const { teamMembers } = useDataContext();

  return (
    <>
      <h1 className="text-xl font-bold text-gray-100 mb-6">Seguimiento del equipo</h1>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
        <Users size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">
          Próximamente — Esta sección estará disponible en una futura actualización.
        </p>

        {teamMembers.length > 0 && (
          <div className="mt-6 text-left">
            <h3 className="text-sm font-medium text-gray-200 mb-3">Miembros del equipo</h3>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map(member => (
                <span
                  key={member.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                >
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
