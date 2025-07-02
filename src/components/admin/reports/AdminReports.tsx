import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const REPORT_CATEGORIES = [
  'Dashboard',
  'Courses',
  'Projects',
  'Community',
  'Tools',
  'Workspaces',
  'Account',
  'Other',
];

interface IssueReport {
  id: string;
  user_id: string;
  title: string;
  description: string;
  attachment_url: string | null;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export default function AdminReports() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<string>('pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Other');

  useEffect(() => {
    // First, fetch initial data to ensure we have everything
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('issue_reports')
        .select(
          `
          *,
          profiles:user_id (
            email,
            first_name,
            last_name,
            avatar_url
          )
        `,
        )
        .order('created_at', { ascending: false });

      if (data && !error) {
        queryClient.setQueryData(['admin-reports'], data);
      }
    };

    // Call the initial fetch
    fetchInitialData();

    // Then set up the real-time subscription
    const subscription = supabase
      .channel('admin-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issue_reports',
        },
        payload => {
          // For INSERT events, refetch the entire list instead of trying to append
          if (payload.eventType === 'INSERT') {
            queryClient.invalidateQueries({ queryKey: ['admin-reports'] });

            // Show notification
            toast({
              title: 'New report received',
              description: 'A new issue report has been submitted',
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing report in the list
            queryClient.setQueryData(
              ['admin-reports'],
              (oldData: IssueReport[] = []) => {
                return oldData.map(item =>
                  item.id === payload.new.id
                    ? { ...item, ...payload.new }
                    : item,
                );
              },
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted report from the list
            queryClient.setQueryData(
              ['admin-reports'],
              (oldData: IssueReport[] = []) => {
                return oldData.filter(item => item.id !== payload.old.id);
              },
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast]);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issue_reports')
        .select(
          `
          *,
          profiles:user_id (
            email,
            first_name,
            last_name,
            avatar_url
          )
        `,
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as IssueReport[];
    },
  });

  // Apply filters and search
  const filteredReports = reports.filter(report => {
    const matchesStatus =
      activeFilter === 'all' || report.status === activeFilter;
    const matchesCategory =
      categoryFilter === 'all' ||
      report.category === categoryFilter ||
      // Handle null categories when filter is applied
      (categoryFilter === 'Other' &&
        (!report.category || report.category === 'Other'));
    const matchesSearch =
      searchTerm === '' ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${report.profiles.first_name || ''} ${report.profiles.last_name || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Calculate counts for dashboard
  const counts = reports.reduce(
    (acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { pending: 0, in_progress: 0, resolved: 0, closed: 0, total: 0 } as Record<
      string,
      number
    >,
  );

  const handleViewDetails = (report: IssueReport) => {
    setSelectedReport(report);
    setAdminNotes(report.admin_notes || '');
    setStatus(report.status);
    setSelectedCategory(report.category || 'Other');
    setDetailsOpen(true);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('issue_reports')
        .update({
          status,
          category: selectedCategory,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      toast({
        title: 'Report updated',
        description: 'The issue report has been updated successfully.',
      });

      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      setDetailsOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error updating report',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            In Progress
          </Badge>
        );
      case 'resolved':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Resolved
          </Badge>
        );
      case 'closed':
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleViewAttachment = async (attachmentPath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-uploads')
        .createSignedUrl(attachmentPath, 60); // 60 seconds expiry

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      toast({
        title: 'Error accessing attachment',
        description: error.message || 'Could not access the attachment',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Issue Reports</h1>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {counts.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {counts.in_progress}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {counts.resolved}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-600">{counts.closed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Status filter buttons */}
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button
            variant={activeFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('pending')}
            className={
              activeFilter === 'pending'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : ''
            }
          >
            Pending
          </Button>
          <Button
            variant={activeFilter === 'in_progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('in_progress')}
            className={
              activeFilter === 'in_progress'
                ? 'bg-blue-600 hover:bg-blue-700'
                : ''
            }
          >
            In Progress
          </Button>
          <Button
            variant={activeFilter === 'resolved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('resolved')}
            className={
              activeFilter === 'resolved'
                ? 'bg-green-600 hover:bg-green-700'
                : ''
            }
          >
            Resolved
          </Button>
          <Button
            variant={activeFilter === 'closed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('closed')}
            className={
              activeFilter === 'closed' ? 'bg-gray-600 hover:bg-gray-700' : ''
            }
          >
            Closed
          </Button>
        </div>

        {/* Category filter dropdown */}
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {REPORT_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-[250px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.category || 'Other'}</TableCell>{' '}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {report.profiles.avatar_url && (
                        <img
                          src={report.profiles.avatar_url}
                          alt={`${report.profiles.first_name || ''} ${
                            report.profiles.last_name || ''
                          }`}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <div>
                        <div>
                          {report.profiles.first_name}{' '}
                          {report.profiles.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {report.profiles.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(report.created_at)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    {report.attachment_url ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleViewAttachment(report.attachment_url!)
                        }
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" /> View
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(report)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7} // Update colspan to match column count
                  className="text-center py-8 text-gray-500"
                >
                  No issue reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedReport && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Issue Details: {selectedReport.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center gap-3">
                  {selectedReport.profiles.avatar_url && (
                    <img
                      src={selectedReport.profiles.avatar_url}
                      alt={`${selectedReport.profiles.first_name || ''} ${
                        selectedReport.profiles.last_name || ''
                      }`}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">
                      {selectedReport.profiles.first_name}{' '}
                      {selectedReport.profiles.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedReport.profiles.email}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Reported on {formatDate(selectedReport.created_at)}
                </div>
              </div>

              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="manage">Manage Issue</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 pt-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Description</div>
                    <div className="bg-white border rounded-md p-3 whitespace-pre-wrap">
                      {selectedReport.description}
                    </div>
                  </div>

                  {selectedReport.attachment_url && (
                    <div>
                      <div className="text-sm font-medium mb-1">Attachment</div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleViewAttachment(selectedReport.attachment_url!)
                        }
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Attachment
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manage" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPORT_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-notes">Admin Notes</Label>
                    <Textarea
                      id="admin-notes"
                      value={adminNotes}
                      onChange={e => setAdminNotes(e.target.value)}
                      placeholder="Add notes regarding this issue..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={handleUpdateReport}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Issue'
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
