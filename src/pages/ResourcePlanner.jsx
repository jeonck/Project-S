import React from 'react';
import { FrappeGantt as Gantt } from 'frappe-gantt-react/src/FrappeGantt';
import { useData } from '../context/DataContext';
import 'frappe-gantt/dist/frappe-gantt.css';

const ResourcePlanner = () => {
  const { teamMembers, tasks, projects } = useData();

  // Helper to generate a start date based on the end date
  const getStartDate = (endDate, duration = 30) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - duration);
    return date.toISOString().split('T')[0];
  };

  const getTeamMemberAssignments = (assigneeName) => {
    const memberTasks = tasks
      .filter(task => task.assignee === assigneeName)
      .map(task => ({
        id: `task-${task.id}`,
        name: `[태스크] ${task.name}`,
        start: getStartDate(task.dueDate, 7), // Shorter duration for tasks
        end: task.dueDate,
        progress: task.status === '완료' ? 100 : Math.floor(Math.random() * 80) + 10,
        custom_class: 'bar-task',
      }));

    const memberProjects = projects
      .filter(project => project.assignee === assigneeName)
      .map(project => ({
        id: `project-${project.name}`,
        name: `[프로젝트] ${project.name}`,
        start: getStartDate(project.dueDate, 30), // Longer duration for projects
        end: project.dueDate,
        progress: project.status === '완료' ? 100 : (project.status === '진행 중' ? 50 : 10),
        custom_class: 'bar-project',
      }));

    return [...memberTasks, ...memberProjects];
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">리소스 플래너</h1>
      <p className="text-gray-600 mb-4">
        팀원별 프로젝트 및 태스크 할당을 시각화하고 관리하는 페이지입니다.
      </p>
      
      <style>{`
        .gantt .bar-task .bar {
          fill: #60a5fa;
        }
        .gantt .bar-project .bar {
          fill: #a78bfa;
        }
        .gantt .bar-progress {
          fill: rgba(0, 0, 0, 0.25);
        }
      `}</style>

      <div className="space-y-8">
        {teamMembers.map(member => {
          const memberAssignments = getTeamMemberAssignments(member.name);
          return (
            <div key={member.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{member.name} ({member.department} - {member.role})</h2>
              {memberAssignments.length > 0 ? (
                <Gantt
                  tasks={memberAssignments}
                  viewMode="Week"
                  onClick={task => alert(task.name)}
                  customPopupHtml={(task) => `
                    <div class="p-2">
                      <h4 class="font-bold">${task.name}</h4>
                      <p>기간: ${task.start} ~ ${task.end}</p>
                      <p>진행률: ${task.progress}%</p>
                    </div>
                  `}
                />
              ) : (
                <p className="text-gray-500">할당된 작업이 없습니다.</p>
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
