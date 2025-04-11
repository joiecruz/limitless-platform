
interface ProjectStatusBadgeProps {
  status: string;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'testing':
        return 'bg-purple-100 text-purple-800';
      case 'prototyping':
        return 'bg-orange-100 text-orange-800';
      case 'measure':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'testing':
        return 'Testing';
      case 'prototyping':
        return 'Prototyping';
      case 'completed':
        return 'Completed';
      case 'measure':
        return 'Measure';
      default:
        return status;
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
    >
      {getStatusText(status)}
    </span>
  );
}
