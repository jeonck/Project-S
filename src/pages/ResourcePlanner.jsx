import React, { useState } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css"; // Import the default CSS for gantt-task-react

const ResourcePlanner = () => {
  const { teamMembers, tasks, projects, updateTask, updateProject } = useData();
  const [currentViewMode, setCurrentViewMode] = useState(ViewMode.Week);

  // Helper to generate a start date based on the end date
  const getStartDate = (endDate, duration = 30) => {
    const date = new Date(endDate);
    date.setDate(date.getDate() - duration);
    return date; // Return Date object
  };

  const getTeamMemberAssignments = (assigneeName) => {
    const memberTasks = tasks
      .filter(task => task.assignee === assigneeName)
      .map(task => ({
        id: `task-${task.id}`,
        name: `[태스크] ${task.name}`,
        start: getStartDate(task.dueDate, 7), // Shorter duration for tasks
        end: new Date(task.dueDate), // Convert to Date object
        progress: task.status === '완료' ? 100 : Math.floor(Math.random() * 80) + 10,
        type: 'task', // Gantt-task-react specific type
        project: assigneeName, // Use assigneeName for grouping within Gantt
        originalId: task.id,
        styles: { backgroundColor: '#60a5fa', progressColor: '#3b82f6' }, // Blue
      }));

    const memberProjects = projects
      .filter(project => project.assignee === assigneeName)
      .map(project => ({
        id: `project-${project.name}`,
        name: `[프로젝트] ${project.name}`,
        start: getStartDate(project.dueDate, 30), // Longer duration for projects
        end: new Date(project.dueDate), // Convert to Date object
        progress: project.status === '완료' ? 100 : (project.status === '진행 중' ? 50 : 10),
        type: 'project', // Gantt-task-react specific type
        project: assigneeName, // Use assigneeName for grouping within Gantt
        originalName: project.name,
        styles: { backgroundColor: '#a78bfa', progressColor: '#8b5cf6' }, // Purple
      }));

    return [...memberTasks, ...memberProjects];
  };

  const handleTaskChange = (ganttTask) => {
    const [type, originalIdOrName] = ganttTask.id.split('-');
    const newDueDate = ganttTask.end.toISOString().split('T')[0];
    const newProgress = Math.round(ganttTask.progress);

    if (type === 'task') {
      const taskId = parseInt(originalIdOrName);
      const originalTask = tasks.find(t => t.id === taskId);
      if (originalTask) {
        let newStatus = originalTask.status;
        if (newProgress === 100) newStatus = '완료';
        else if (newProgress > 0 && originalTask.status === '예정') newStatus = '진행 중';
        else if (newProgress === 0 && originalTask.status === '진행 중') newStatus = '예정';

        updateTask(taskId, { ...originalTask, dueDate: newDueDate, progress: newProgress, status: newStatus });
      }
    } else if (type === 'project') {
      const projectName = originalIdOrName;
      const originalProject = projects.find(p => p.name === projectName);
      if (originalProject) {
        let newStatus = originalProject.status;
        if (newProgress === 100) newStatus = '완료';
        else if (newProgress > 0 && originalProject.status === '계획') newStatus = '진행 중';
        else if (newProgress === 0 && originalProject.status === '진행 중') newStatus = '계획';

        updateProject(
          projects.findIndex(p => p.name === projectName),
          { ...originalProject, dueDate: newDueDate, progress: newProgress, status: newStatus }
        );
      }
    }
  };

  const handleViewModeChange = (mode) => {
    setCurrentViewMode(mode);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">리소스 플래너</h1>
      <p className="text-gray-600 mb-4">
        팀원별 프로젝트 및 태스크 할당을 시각화하고 관리하는 페이지입니다.
      </p>
      
      <div className="space-y-8">
        {teamMembers.map(member => {
          const memberAssignments = getTeamMemberAssignments(member.name);
          return (
            <div key={member.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{member.name} ({member.department} - {member.role})</h2>
              {memberAssignments.length > 0 ? (
                <Gantt
                  tasks={memberAssignments}
                  viewMode={currentViewMode}
                  onDateChange={handleTaskChange}
                  onProgressChange={handleTaskChange}
                  // Gantt-task-react specific props for customization
                  listCellWidth={150}
                  columnWidth={currentViewMode === ViewMode.Day ? 35 : currentViewMode === ViewMode.Week ? 150 : 300}
                  barFill={'#60a5fa'} // Default fill color for task bars
                  barCornerRadius={3}
                  handleWidth={5}
                  barProgressColor={'#3b82f6'} // Progress bar color
                  barProgressSelectedColor={'#1e40af'} // Selected progress bar color
                  todayColor={'rgba(252, 128, 252, 0.4)'} // Highlight today
                  // other props as needed by gantt-task-react
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
