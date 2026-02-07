import { Routes, Route } from 'react-router-dom';
import {
  DataProvider,
  PersonalTasksProvider,
  TeamTasksProvider,
  MeetingsProvider,
} from './context';
import { Layout } from './components/layout';
import { DashboardPage, TasksPage, TeamPage, MeetingsPage, SettingsPage } from './views';

export default function App() {
  return (
    <DataProvider>
      <PersonalTasksProvider>
        <TeamTasksProvider>
          <MeetingsProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/meetings" element={<MeetingsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </MeetingsProvider>
        </TeamTasksProvider>
      </PersonalTasksProvider>
    </DataProvider>
  );
}
