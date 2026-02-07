import { TeamMember, TeamTask, Subtask, TimelineEvent, Meeting, MeetingSnapshot } from '../types';
import { generateId } from './ids';
import { getTaskProgress, isTaskBlocked } from './team-tasks';

export function generateMeetingSnapshots(
  meetingId: string,
  teamMembers: TeamMember[],
  teamTasks: TeamTask[],
  subtasks: Subtask[],
  timelineEvents: TimelineEvent[],
  meetings: Meeting[],
): MeetingSnapshot[] {
  const currentMeeting = meetings.find(m => m.id === meetingId);
  if (!currentMeeting) return [];

  const previousMeeting = meetings
    .filter(m => m.date < currentMeeting.date)
    .sort((a, b) => b.date - a.date)[0];

  const sinceDate = previousMeeting ? previousMeeting.date : 0;

  return teamMembers.map(member => {
    const memberTasks = teamTasks.filter(t => t.assignee_id === member.id);

    const tasks_doing = memberTasks
      .filter(t => t.status === 'doing')
      .map(t => ({
        id: t.id,
        title: t.title,
        progress: getTaskProgress(t, subtasks),
        jira_ref: t.jira_ref,
      }));

    const tasks_blocked = memberTasks
      .filter(t => isTaskBlocked(t.id, timelineEvents))
      .map(t => {
        const blockedEvent = timelineEvents
          .filter(e => e.team_task_id === t.id && e.type === 'blocked')
          .sort((a, b) => b.created_at - a.created_at)[0];
        return {
          id: t.id,
          title: t.title,
          blocked_reason: blockedEvent?.description || null,
        };
      });

    const tasks_completed_since_last = memberTasks
      .filter(t => t.status === 'done' && t.updated_at > sinceDate)
      .map(t => ({
        id: t.id,
        title: t.title,
      }));

    const activeTasks = memberTasks.filter(t => t.status !== 'done');
    const overall_progress =
      activeTasks.length === 0
        ? 100
        : Math.round(
            activeTasks.reduce((sum, t) => sum + getTaskProgress(t, subtasks), 0) /
              activeTasks.length,
          );

    return {
      id: generateId(),
      meeting_id: meetingId,
      member_id: member.id,
      member_name: member.name,
      tasks_doing,
      tasks_blocked,
      tasks_completed_since_last,
      overall_progress,
      created_at: Date.now(),
    };
  });
}
