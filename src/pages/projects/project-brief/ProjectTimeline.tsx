import React, { useState, forwardRef, useImperativeHandle } from "react";

export interface ProjectTimelineRef {
  validate: () => boolean | string;
}

export default forwardRef<ProjectTimelineRef>((props, ref) => {
  // Initial team members data
  const initialTeamMembers = [
    { 
      name: "John Doe", 
      email: "john@example.com", 
      role: "Admin",
      permission: "Admin",
      image: "/sample-avatars/john.jpg"
    },
    { 
      name: "Jane Smith", 
      email: "jane@example.com", 
      role: "Editor",
      permission: "Can edit",
      image: "/sample-avatars/jane.jpg"
    },
    { 
      name: "Bob Wilson", 
      email: "bob@example.com", 
      role: "Guest",
      permission: "Can view",
      image: "/sample-avatars/bob.jpg"
    },
  ];

  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [touched, setTouched] = useState(false);

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

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!startDate) return "Start date is required.";
      if (endDate && startDate && endDate < startDate) return "End date cannot be before start date.";
      return true;
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
          <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="collaborators">Invite Collaborators</label>
          <input
            id="collaborators"
            type="text"
            placeholder="Enter email address"
            className="w-full text-gray-600 rounded-[8px] border border-gray-200 font-medium px-4 py-3 text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
            style={{ marginBottom: 16 }}
          />
        </div>
        
        <div className="flex flex-col justify-between" style={{ width: '25%' }}>
          <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="role">Role</label>
          <select
            id="role"
            className="w-full text-gray-400 rounded-[8px] border border-gray-200 font-medium px-4  text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white"
            style={{ marginBottom: 16 }}
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        <div className="flex flex-col justify-between" style={{ width: '20%' }}>
          <label className="block text-[13px] text-gray-600 font-bold font-sans mb-1" htmlFor="permissions">Permissions</label>
          <select
            id="permissions"
            className="w-full text-gray-700 rounded-[8px] border border-gray-200 font-normal px-4 py-0 text-[13px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white"
            style={{ marginBottom: 16 }}
          >
            <option value="">Can edit</option>
            <option value="can-edit">Can edit</option>
            <option value="admin">Admin</option>
            <option value="can-view">Can view</option>
          </select>
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