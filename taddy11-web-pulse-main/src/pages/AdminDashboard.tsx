import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Briefcase,
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  preferredRole: string;
  status: string;
  applicationDate: string;
  experience: string;
  skills: string;
  coverLetter: string;
  resumeFileName?: string;
}

interface JobPosition {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary: string;
  isActive: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "full-time",
    description: "",
    requirements: "",
    salary: "",
    isActive: true
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin');
    
    if (!isLoggedIn || !isAdmin) {
      navigate('/login');
      return;
    }
    
    fetchApplications();
    fetchJobPositions();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/applications`);
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPositions = async () => {
    // Mock job positions - replace with actual API call
    const mockJobs: JobPosition[] = [
      {
        _id: "1",
        title: "Senior Full Stack Developer",
        department: "Engineering",
        location: "Remote",
        type: "full-time",
        description: "We are looking for a senior full stack developer...",
        requirements: "5+ years experience, React, Node.js, MongoDB",
        salary: "₹15-25 LPA",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: "2",
        title: "Cybersecurity Specialist",
        department: "Security",
        location: "Hybrid",
        type: "full-time",
        description: "Join our security team to protect our infrastructure...",
        requirements: "3+ years in cybersecurity, CISSP preferred",
        salary: "₹12-20 LPA",
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    setJobPositions(mockJobs);
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/applications/${applicationId}`,
        { status: newStatus }
      );

      if (response.data.success) {
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        toast({
          title: "Status Updated",
          description: `Application status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/applications/${applicationId}`
      );

      if (response.data.success) {
        setApplications(prev => prev.filter(app => app._id !== applicationId));
        toast({
          title: "Application Deleted",
          description: "Application has been successfully deleted",
        });
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const handleCreateJob = () => {
    // Mock create job - replace with actual API call
    const job: JobPosition = {
      _id: Date.now().toString(),
      ...newJob,
      createdAt: new Date().toISOString()
    };
    
    setJobPositions(prev => [job, ...prev]);
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "full-time",
      description: "",
      requirements: "",
      salary: "",
      isActive: true
    });
    setIsJobDialogOpen(false);
    
    toast({
      title: "Job Created",
      description: "New job position has been created successfully",
    });
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;
    
    // Mock update job - replace with actual API call
    setJobPositions(prev => 
      prev.map(job => 
        job._id === editingJob._id ? { ...editingJob } : job
      )
    );
    setEditingJob(null);
    
    toast({
      title: "Job Updated",
      description: "Job position has been updated successfully",
    });
  };

  const handleDeleteJob = (jobId: string) => {
    // Mock delete job - replace with actual API call
    setJobPositions(prev => prev.filter(job => job._id !== jobId));
    
    toast({
      title: "Job Deleted",
      description: "Job position has been deleted successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hired': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-purple-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-purple-600">Manage job applications and positions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Total Applications</p>
                  <p className="text-2xl font-bold text-purple-800">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Pending Review</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-green-800">
                    {jobPositions.filter(job => job.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-600">This Month</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {applications.filter(app => 
                      new Date(app.applicationDate).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-purple-100">
            <TabsTrigger value="applications" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Applications
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Job Positions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {applications.length === 0 ? (
              <Card className="text-center py-12 border-purple-200">
                <CardContent>
                  <FileText className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">No Applications</h3>
                  <p className="text-purple-600">No job applications have been submitted yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {applications.map((application) => (
                  <Card key={application._id} className="border-purple-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-purple-800">{application.name}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <span className="mr-4">{application.email}</span>
                            <span className="mr-4">{application.phone}</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(application.applicationDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                          <Select
                            value={application.status}
                            onValueChange={(value) => updateApplicationStatus(application._id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="interview">Interview</SelectItem>
                              <SelectItem value="hired">Hired</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Preferred Role</p>
                          <p className="text-gray-700">{application.preferredRole}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Experience</p>
                          <p className="text-gray-700">{application.experience}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-purple-600 font-medium mb-1">Skills</p>
                        <p className="text-gray-700 text-sm">{application.skills}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApplication(application)}
                                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Application Details</DialogTitle>
                                <DialogDescription>
                                  Full application information for {selectedApplication?.name}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <p className="text-sm">{selectedApplication.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm">{selectedApplication.email}</p>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="text-sm">{selectedApplication.phone}</p>
                                    </div>
                                    <div>
                                      <Label>Preferred Role</Label>
                                      <p className="text-sm">{selectedApplication.preferredRole}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Experience</Label>
                                    <p className="text-sm">{selectedApplication.experience}</p>
                                  </div>
                                  <div>
                                    <Label>Skills</Label>
                                    <p className="text-sm">{selectedApplication.skills}</p>
                                  </div>
                                  <div>
                                    <Label>Cover Letter</Label>
                                    <p className="text-sm">{selectedApplication.coverLetter}</p>
                                  </div>
                                  {selectedApplication.resumeFileName && (
                                    <div>
                                      <Label>Resume</Label>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}/uploads/resumes/${selectedApplication.resumeFileName}`, '_blank')}
                                        className="ml-2"
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Resume
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {application.resumeFileName && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}/uploads/resumes/${application.resumeFileName}`, '_blank')}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Resume
                            </Button>
                          )}
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                Delete Application
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the application from {application.name}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteApplication(application._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-800">Job Positions</h2>
              <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Job Position</DialogTitle>
                    <DialogDescription>
                      Add a new job opening to attract candidates
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={newJob.title}
                          onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Senior Developer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={newJob.department}
                          onChange={(e) => setNewJob(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="e.g. Engineering"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newJob.location}
                          onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g. Remote, Hybrid"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Job Type</Label>
                        <Select value={newJob.type} onValueChange={(value) => setNewJob(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        value={newJob.salary}
                        onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))}
                        placeholder="e.g. ₹10-15 LPA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Job Description</Label>
                      <Textarea
                        id="description"
                        value={newJob.description}
                        onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the role and responsibilities..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="requirements">Requirements</Label>
                      <Textarea
                        id="requirements"
                        value={newJob.requirements}
                        onChange={(e) => setNewJob(prev => ({ ...prev, requirements: e.target.value }))}
                        placeholder="List the required skills and qualifications..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateJob} className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Create Job
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {jobPositions.map((job) => (
                <Card key={job._id} className="border-purple-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-purple-800">{job.title}</CardTitle>
                        <CardDescription>
                          {job.department} • {job.location} • {job.type} • {job.salary}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingJob(job)}
                              className="border-purple-200 text-purple-600"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Job Position</DialogTitle>
                              <DialogDescription>
                                Update job details and requirements
                              </DialogDescription>
                            </DialogHeader>
                            {editingJob && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-title">Job Title</Label>
                                    <Input
                                      id="edit-title"
                                      value={editingJob.title}
                                      onChange={(e) => setEditingJob(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-department">Department</Label>
                                    <Input
                                      id="edit-department"
                                      value={editingJob.department}
                                      onChange={(e) => setEditingJob(prev => prev ? ({ ...prev, department: e.target.value }) : null)}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-location">Location</Label>
                                    <Input
                                      id="edit-location"
                                      value={editingJob.location}
                                      onChange={(e) => setEditingJob(prev => prev ? ({ ...prev, location: e.target.value }) : null)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-type">Job Type</Label>
                                    <Select 
                                      value={editingJob.type} 
                                      onValueChange={(value) => setEditingJob(prev => prev ? ({ ...prev, type: value }) : null)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="full-time">Full Time</SelectItem>
                                        <SelectItem value="part-time">Part Time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="edit-salary">Salary Range</Label>
                                  <Input
                                    id="edit-salary"
                                    value={editingJob.salary}
                                    onChange={(e) => setEditingJob(prev => prev ? ({ ...prev, salary: e.target.value }) : null)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-description">Job Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editingJob.description}
                                    onChange={(e) => setEditingJob(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                                    rows={4}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-requirements">Requirements</Label>
                                  <Textarea
                                    id="edit-requirements"
                                    value={editingJob.requirements}
                                    onChange={(e) => setEditingJob(prev => prev ? ({ ...prev, requirements: e.target.value }) : null)}
                                    rows={3}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="edit-active"
                                    checked={editingJob.isActive}
                                    onChange={(e) => setEditingJob(prev => prev ? ({ ...prev, isActive: e.target.checked }) : null)}
                                    className="rounded"
                                  />
                                  <Label htmlFor="edit-active">Active Position</Label>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingJob(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateJob} className="bg-gradient-to-r from-purple-600 to-blue-600">
                                Update Job
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                Delete Job Position
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the "{job.title}" position? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteJob(job._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-purple-600 font-medium mb-1">Description</p>
                        <p className="text-gray-700 text-sm">{job.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-600 font-medium mb-1">Requirements</p>
                        <p className="text-gray-700 text-sm">{job.requirements}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created on {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;