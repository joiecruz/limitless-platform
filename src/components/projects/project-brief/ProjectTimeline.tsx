import React from "react";

export default function ProjectTimeline() {
  // Sample data for the table with profile images
  const teamMembers = [
    { 
      name: "John Doe", 
      email: "john@example.com", 
      role: "Admin",
      image: "/sample-avatars/john.jpg"
    },
    { 
      name: "Jane Smith", 
      email: "jane@example.com", 
      role: "Editor",
      image: "/sample-avatars/jane.jpg"
    },
    { 
      name: "Bob Wilson", 
      email: "bob@example.com", 
      role: "Guest",
      image: "/sample-avatars/bob.jpg"
    },
  ];

  // Function to get permission based on role
  const getPermissionForRole = (role: string) => {
    switch (role) {
      case "Admin": return "Admin";
      case "Editor": return "Can edit";
      case "Guest": return "Can view";
      default: return "Can view";
    }
  };

  return (
    <div className="mt-1.5 bg-white rounded-xl border border-gray-100 px-8 pt-8 pb-10 flex flex-col items-start" style={{ width: '60vw', minHeight: '46vh' }}>
      <div className="flex items-center mb-6">
        <img src="/projects-navbar-icons/user-clock.svg" alt="Info" width={30} height={23} style={{ marginRight: 13, color: '#2FD5C8', filter: 'invert(62%) sepia(99%) saturate(377%) hue-rotate(127deg) brightness(97%) contrast(92%)' }} />
        <span className="text-[22px] font-bold font-sans" style={{ color: '#1E2128FF' }}>Timeline and Team</span>
      </div>
      
      <div className="flex w-full gap-8">
        <div className="flex flex-col justify-between" style={{ width: '40%' }}>
          <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            className="w-full text-gray-600 rounded-[10px] border border-gray-200 font-medium px-4 py-3 text-[16px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
            style={{ marginBottom: 16 }}
          />
        </div>
        
        <div className="flex flex-col justify-between" style={{ width: '60%' }}>
          <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="end-date">Target End Date (optional)</label>
          <input
            id="end-date"
            type="date"
            className="w-full text-gray-600 rounded-[10px] border border-gray-200 font-medium px-4 py-3 text-[16px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
            style={{ marginBottom: 16 }}
          />
        </div>
      </div>

      <div className="flex w-full gap-3">
        <div className="flex flex-col justify-between" style={{ width: '55%' }}>
          <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="collaborators">Invite Collaborators</label>
          <input
            id="collaborators"
            type="text"
            placeholder="Enter email address"
            className="w-full text-gray-600 rounded-[10px] border border-gray-200 font-medium px-4 py-3 text-[16px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF]"
            style={{ marginBottom: 16 }}
          />
        </div>
        
        <div className="flex flex-col justify-between" style={{ width: '25%' }}>
          <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="role">Role</label>
          <select
            id="role"
            className="w-full text-gray-400 rounded-[10px] border border-gray-200 font-medium px-4  text-[16px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white"
            style={{ marginBottom: 16 }}
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        <div className="flex flex-col justify-between" style={{ width: '20%' }}>
          <label className="block text-[16px] text-gray-600 font-bold font-sans mb-1" htmlFor="permissions">Permissions</label>
          <select
            id="permissions"
            className="w-full text-gray-700 rounded-[10px] border border-gray-200 font-normal px-4 py-0 text-[16px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white"
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
      <div className="w-full mt-4 border border-gray-200 rounded-[5px] bg-white">
        <div className="flex w-full gap-3 px-5 py-3 border-b bg-[#F8F9FB] rounded-t-[6px]">
          <div style={{ width: '55%' }}>
            <span className="text-[16px] text-gray-500 font-bold font-sans">User</span>
          </div>
          <div style={{ width: '25%' }}>
            <span className="text-[16px] text-gray-500 font-bold font-sans">Role</span>
          </div>
          <div style={{ width: '20%' }}>
            <span className="text-[16px] text-gray-500 font-bold font-sans">Permission</span>
          </div>
        </div>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className={`flex w-full gap-5 px-5 py-3 items-center ${index !== teamMembers.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div style={{ width: '55%' }} className="flex items-center">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-9 h-9 rounded-full mr-3 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[16px] font-medium text-gray-800">{member.name}</span>
                <span className="text-[12px] text-gray-400">{member.email}</span>
              </div>
            </div>
            <div style={{ width: '25%' }} className="flex items-center">
              <span
                className={`text-[16px] font-medium px-3 py-2 rounded-full
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
                className="w-full text-gray-700 rounded-[10px] border border-gray-200 font-normal px-4 text-[16px] h-[40px] font-sans focus:outline-none focus:ring-1 focus:ring-[#9095A1FF] bg-white"
                defaultValue={getPermissionForRole(member.role)}
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
} 