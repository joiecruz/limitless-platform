import React, { useState, forwardRef, useImperativeHandle, useContext, useEffect } from "react";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";

export interface ProjectTimelineRef {
  validate: () => boolean | string;
  getValues: () => {
    startDate: string;
    endDate: string;
    teamMembers: Array<{
      user_id: string;
      name: string;
      email: string;
      role: string;
      permission: string;
    }>;
  };
  setValues: (values: {
    startDate: string;
    endDate: string;
    teamMembers: Array<{
      user_id: string;
      name: string;
      email: string;
      role: string;
      permission: string;
    }>;
  }) => void;
}

export default forwardRef<ProjectTimelineRef>((props, ref) => {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { data: workspaceMembers = [], isLoading } = useWorkspaceMembers(currentWorkspace?.id || "");
  
  // Convert workspace members to team members format
  const formatWorkspaceMembers = () => {
    return workspaceMembers.map((member) => ({
      user_id: member.user_id,
      name: `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim() || 'Unknown User',
      email: member.profiles.email,
      role: member.role === 'owner' ? 'Admin' : member.role === 'admin' ? 'Editor' : 'Guest',
      permission: member.role === 'owner' ? 'Admin' : member.role === 'admin' ? 'Can edit' : 'Can view',
      image: "/sample-avatars/john.jpg" // Default avatar
    }));
  };

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [touched, setTouched] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  // Update team members when workspace members load
  useEffect(() => {
    if (workspaceMembers.length > 0) {
      setTeamMembers(formatWorkspaceMembers());
    }
  }, [workspaceMembers]);

  // Function to get permission based on role
  const getPermissionForRole = (role) => {
    switch (role) {
      case "Admin": return "Admin";
      case "Editor": return "Can edit";
      case "Guest": return "Can view";
      default: return "Can view";
    }
  };

  // Function to get role based on permission
  const getRoleForPermission = (permission) => {
    switch (permission) {
      case "Admin": return "Admin";
      case "Can edit": return "Editor";
      case "Can view": return "Guest";
      default: return "Guest";
    }
  };

  const handlePermissionChange = (index, newPermission) => {
    setTeamMembers(prev =>
      prev.map((member, i) =>
        i === index
          ? {
              ...member,
              permission: newPermission,
              role: getRoleForPermission(newPermission)
            }
          : member
      )
    );
  };

  const addNewMember = () => {
    if (!newMemberEmail || !newMemberRole) return;
    
    // Check if member with this email already exists in workspace
    const existingMember = workspaceMembers.find(m => m.profiles.email === newMemberEmail);
    if (!existingMember) {
      // This person is not in the workspace, can't add them
      return;
    }

    // Check if already added to project
    const alreadyAdded = teamMembers.find(m => m.email === newMemberEmail);
    if (alreadyAdded) return;

    const newMember = {
      user_id: existingMember.user_id,
      name: `${existingMember.profiles.first_name || ''} ${existingMember.profiles.last_name || ''}`.trim(),
      email: existingMember.profiles.email,
      role: newMemberRole,
      permission: getPermissionForRole(newMemberRole),
      image: "/sample-avatars/john.jpg"
    };

    setTeamMembers(prev => [...prev, newMember]);
    setNewMemberEmail("");
    setNewMemberRole("");
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!startDate) return "Start date is required.";
      if (endDate && startDate && endDate < startDate) return "End date cannot be before start date.";
      return true;
    },
    getValues: () => ({
      startDate,
      endDate,
      teamMembers: teamMembers.map(member => ({
        user_id: (member as any).user_id || member.email,
        name: member.name,
        email: member.email,
        role: member.role,
        permission: member.permission
      }))
    }),
    setValues: (values) => {
      setStartDate(values.startDate);
      setEndDate(values.endDate);
      setTeamMembers(values.teamMembers.map(member => ({
        ...member,
        image: "/sample-avatars/john.jpg"
      })));
    }
  }));

  const showStartError = touched && !startDate;
  const showEndError = touched && endDate && startDate && endDate < startDate;

  return (
    <div className="mt-1.5 bg-white rounded-xl border border-gray-100 px-6 pt-6 pb-10 flex flex-col items-start" style={{ width: '55vw', minHeight: '46vh' }}>
      <div className="flex items-center mb-6">
        <img src="/projects-navbar-icons/user-clock.svg" alt="Info" width={22} height={14} style={{ marginRight: 13, color: '#2FD5C8', filter: 'invert(62%) sepia(99%) saturate(377%) hue-rotate(127deg) brightness(97%) contrast(92%)' }} />
        <span className="text-[17px] font-bold font-sans" style={{ color: '#1E2128FF' }}>Timeline and Team</span>
      </div>
      
      <div className="flex w-full gap-8 mb-[-5px] mt-[-5px]">
        <div className="flex flex-col justify-between" style={{ width: '40%' }}>
          <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            className="w-full text-gray-400 rounded-[8px] border border-gray-200 font-medium px-4 py-3 text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
            style={{ marginBottom: 4 }}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col justify-between" style={{ width: '60%' }}>
          <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="end-date">Target End Date (optional)</label>
          <input
            id="end-date"
            type="date"
            className="w-full text-gray-400 rounded-[8px] border border-gray-200 font-medium px-4 py-3 text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
            style={{ marginBottom: 4 }}
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex w-full gap-3 mt-3">
        <div className="flex flex-col justify-between" style={{ width: '55%' }}>
          <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="collaborators">Add Team Member</label>
          <select
            id="collaborators"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="w-full text-gray-600 rounded-[8px] border border-gray-200 font-medium px-4 py-3 text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white"
            style={{ marginBottom: 16 }}
          >
            <option value="">Select workspace member</option>
            {workspaceMembers
              .filter(member => !teamMembers.find(tm => tm.email === member.profiles.email))
              .map((member) => (
                <option key={member.user_id} value={member.profiles.email}>
                  {`${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim()} ({member.profiles.email})
                </option>
              ))}
          </select>
        </div>
        
        <div className="flex flex-col justify-between" style={{ width: '25%' }}>
          <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="role">Role</label>
          <select
            id="role"
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)}
            className="w-full text-gray-400 rounded-[8px] border border-gray-200 font-medium px-4  text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white"
            style={{ marginBottom: 16 }}
          >
            <option value="">Select role</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Guest">Guest</option>
          </select>
        </div>
        <div className="flex flex-col justify-between" style={{ width: '20%' }}>
          <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1">&nbsp;</label>
          <button
            type="button"
            onClick={addNewMember}
            disabled={!newMemberEmail || !newMemberRole}
            className="w-full bg-[#393CA0FF] text-white rounded-[8px] px-4 py-3 text-[13px] h-[40px] font-sans hover:bg-[#2C2E7AFF] disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ marginBottom: 16 }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="w-full mt-2 border border-gray-200 rounded-[5px] bg-white">
        <div className="flex w-full gap-3 px-5 py-2 border-b bg-[#F8F9FB] rounded-t-[6px]">
          <div style={{ width: '55%' }}>
            <span className="text-[13px] text-gray-500 font-bold font-sans">User</span>
          </div>
          <div style={{ width: '25%' }}>
            <span className="text-[13px] text-gray-500 font-bold font-sans">Role</span>
          </div>
          <div style={{ width: '20%' }}>
            <span className="text-[13px] text-gray-500 font-bold font-sans">Permission</span>
          </div>
        </div>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className={`flex w-full gap-5 px-5 py-2 items-center ${index !== teamMembers.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div style={{ width: '55%' }} className="flex items-center">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-9 h-9 rounded-full mr-3 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-gray-800">{member.name}</span>
                <span className="text-[12px] text-gray-400">{member.email}</span>
              </div>
            </div>
            <div style={{ width: '25%' }} className="flex items-center">
              <span
                className={`text-[13px] font-medium px-3 py-2 rounded-full
                  ${member.role === 'Admin' ? 'bg-[#F4F4FB] text-[#393CA0]' : ''}
                  ${member.role === 'Editor' ? 'bg-[#E9FAF9] text-[#1A6B5C]' : ''}
                  ${member.role === 'Guest' ? 'bg-[#FFF3F7] text-[#FF206E]' : ''}
                `}
              >
                {member.role}
              </span>
            </div>
            <div style={{ width: '20%' }}>
              <select
                className="w-full text-gray-700 rounded-[8px] border border-gray-200 font-normal px-4 text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white"
                value={member.permission}
                onChange={e => handlePermissionChange(index, e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Can edit">Can edit</option>
                <option value="Can view">Can view</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}); 