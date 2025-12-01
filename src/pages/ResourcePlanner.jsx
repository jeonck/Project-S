import React from 'react';
import { FrappeGantt as Gantt } from 'frappe-gantt-react/src/FrappeGantt';
import { useData } from '../context/DataContext';
import 'frappe-gantt/dist/frappe-gantt.css';

const ResourcePlanner = () => {
  const { teamMembers, tasks, projects } = useData();

  // Helper to generate a start date based on the end date
  const getStartDate = (endDate) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - 5); // Assume a 5-day duration for now
    return date.toISOString().split('T')[0];
  };

  const getTeamMemberTasks = (assigneeName) => {
    // Combine tasks and projects into a single list for the gantt chart
    const memberTasks = tasks
      .filter(task => task.assignee === assigneeName)
      .map(task => ({
        id: `task-${task.id}`,
        name: task.name,
        start: getStartDate(task.dueDate),
        end: task.dueDate,
        progress: task.status === '완료' ? 100 : Math.floor(Math.random() * 80) + 10, // Random progress for demo
      }));

    // For simplicity, we are not assigning projects to members in this example.
    // In a real scenario, you would have a way to link projects to team members.
    return memberTasks;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">리소스 플래너</h1>
      <p className="text-gray-600 mb-4">
        팀원별 프로젝트 및 태스크 할당을 시각화하고 관리하는 페이지입니다.
      </p>

      <div className="space-y-8">
        {teamMembers.map(member => {
          const memberTasks = getTeamMemberTasks(member.name);
          return (
            <div key={member.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{member.name} ({member.department} - {member.role})</h2>
              {memberTasks.length > 0 ? (
                <Gantt
                  tasks={memberTasks}
                  viewMode="Week" // Can be Day, Week, Month
                  onClick={task => alert(`Clicked on ${task.name}`)}
                  onDateChange={(task, start, end) => console.log('Date changed:', task, start, end)}
                  onProgressChange={(task, progress) => console.log('Progress changed:', task, progress)}
                />
              ) : (
                <p className="text-gray-500">할당된 태스크가 없습니다.</p>
              )}
            </div>
          );
        })}
        {teamMembers.length === 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-center text-gray-500">등록된 팀원이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePlanner;
