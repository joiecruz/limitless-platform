import React, { useState, forwardRef, useImperativeHandle, useContext, useEffect } from "react";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

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
  
  // Initialize with just the current user as owner
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [touched, setTouched] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user and set as owner
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && workspaceMembers.length > 0) {
        const currentMember = workspaceMembers.find(m => m.user_id === user.id);
        if (currentMember) {
          const ownerMember = {
            user_id: currentMember.user_id,
            name: `${currentMember.profiles.first_name || ''} ${currentMember.profiles.last_name || ''}`.trim() || 'You',
            email: currentMember.profiles.email,
            role: 'Owner',
            permission: 'Owner',
            image: "/sample-avatars/john.jpg",
            isOwner: true
          };
          setCurrentUser(ownerMember);
          setTeamMembers([ownerMember]);
        }
      }
    };
    
    if (workspaceMembers.length > 0) {
      getCurrentUser();
    }
  }, [workspaceMembers]);

  // Debugging logs
  console.log('currentWorkspace', currentWorkspace);
  console.log('workspaceMembers', workspaceMembers);
  console.log('teamMembers', teamMembers);
  console.log('isLoading', isLoading);

  // Function to get permission based on role
  const getPermissionForRole = (role) => {
    switch (role) {
      case "Admin": return "Admin";
      case "Editor": return "Can edit";
      case "Guest": return "Can view";
      case "Owner": return "Owner";
      default: return "Can view";
    }
  };

  // Function to get role based on permission
  const getRoleForPermission = (permission) => {
    switch (permission) {
      case "Admin": return "Admin";
      case "Can edit": return "Editor";
      case "Can view": return "Guest";
      case "Owner": return "Owner";
      default: return "Guest";
    }
  };

  const handlePermissionChange = (index, newPermission) => {
    // Don't allow editing owner permissions
    if (teamMembers[index]?.isOwner) return;
    
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

  const removeMember = (index: number) => {
    // Don't allow removing owner
    if (teamMembers[index]?.isOwner) return;
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
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
            {/* DEBUG: Render all workspaceMembers without filtering */}
            {workspaceMembers.map((member) => (
              <option key={member.user_id} value={member.profiles.email}>
                {`${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim()} ({member.profiles.email})
              </option>
            ))}
            {/*
            {workspaceMembers
              .filter(member => 
                member.user_id !== currentUser?.user_id && // Exclude current user (owner)
                !teamMembers.find(tm => tm.email === member.profiles.email) // Exclude already added members
              )
              .map((member) => (
                <option key={member.user_id} value={member.profiles.email}>
                  {`${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim()} ({member.profiles.email})
                </option>
              ))}
            */}
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
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <span className="text-[13px] text-gray-500">Loading workspace members...</span>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <span className="text-[13px] text-gray-500">No team members added yet. Add members from your workspace above.</span>
          </div>
        ) : (
          teamMembers.map((member, index) => (
            <div
              key={`${member.user_id}-${index}`}
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
                    ${member.role === 'Owner' ? 'bg-[#F4F4FB] text-[#393CA0]' : ''}
                    ${member.role === 'Admin' ? 'bg-[#F4F4FB] text-[#393CA0]' : ''}
                    ${member.role === 'Editor' ? 'bg-[#E9FAF9] text-[#1A6B5C]' : ''}
                    ${member.role === 'Guest' ? 'bg-[#FFF3F7] text-[#FF206E]' : ''}
                  `}
                >
                  {member.role}
                </span>
              </div>
              <div style={{ width: '20%' }}>
                <div className="flex items-center gap-2">
                  <select
                    className={`flex-1 text-gray-700 rounded-[8px] border border-gray-200 font-normal px-4 text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white ${
                      member.isOwner ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    value={member.permission}
                    onChange={e => handlePermissionChange(index, e.target.value)}
                    disabled={member.isOwner}
                  >
                    {member.isOwner ? (
                      <option value="Owner">Owner</option>
                    ) : (
                      <>
                        <option value="Admin">Admin</option>
                        <option value="Can edit">Can edit</option>
                        <option value="Can view">Can view</option>
                      </>
                    )}
                  </select>
                  {!member.isOwner && (
                    <button
                      onClick={() => removeMember(index)}
                      className="w-8 h-8 rounded-[6px] bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center text-sm"
                      title="Remove member"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}); 