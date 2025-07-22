import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Upload } from "lucide-react";
import { SuccessPage } from "./SuccessPage";

const formSchema = z.object({
  trainer_full_name: z.string().min(2, "Full name is required"),
  workshop_date: z.string().min(1, "Workshop date is required"),
  workshop_location: z.string().min(2, "Workshop location is required"),
  region: z.string().min(1, "Region is required"),
  province: z.string().min(1, "Province is required"),
  lgu: z.string().min(1, "LGU is required"),
  affiliation_type: z.enum(['School', 'Community', 'Workplace', 'University'], {
    required_error: "Please select an affiliation type",
  }),
  affiliation_name: z.string().min(2, "Affiliation name is required"),
  total_participants: z.number().min(1, "Total participants must be at least 1"),
  youth_count: z.number().min(0, "Youth count cannot be negative"),
  parent_count: z.number().min(0, "Parent count cannot be negative"),
  educator_count: z.number().min(0, "Educator count cannot be negative"),
}).refine((data) => {
  return data.youth_count + data.parent_count + data.educator_count === data.total_participants;
}, {
  message: "Breakdown totals must equal total participants",
  path: ["total_participants"],
});

interface TrainingReportFormProps {
  sessionType: 'hour_of_code' | 'depth_training';
  onBack: () => void;
  onSubmitSuccess: () => void;
}

// Philippine location data (simplified)
const philippineLocations = {
  "NCR": {
    name: "National Capital Region",
    provinces: {
      "Metro Manila": ["Manila", "Quezon City", "Makati", "Taguig", "Pasig", "Marikina", "Mandaluyong", "San Juan", "Pasay", "Parañaque", "Las Piñas", "Muntinlupa", "Caloocan", "Malabon", "Navotas", "Valenzuela", "Pateros"]
    }
  },
  "Region I": {
    name: "Ilocos Region",
    provinces: {
      "Ilocos Norte": ["Laoag City", "Batac City", "Burgos", "Carasi"],
      "Ilocos Sur": ["Vigan City", "Candon City", "Bantay", "Caoayan"],
      "La Union": ["San Fernando City", "Agoo", "Aringay", "Bacnotan"],
      "Pangasinan": ["Lingayen", "Dagupan City", "San Carlos City", "Urdaneta City"]
    }
  },
  "Region III": {
    name: "Central Luzon",
    provinces: {
      "Bataan": ["Balanga City", "Mariveles", "Bagac", "Hermosa"],
      "Bulacan": ["Malolos City", "Meycauayan City", "San Jose del Monte City", "Marilao"],
      "Nueva Ecija": ["Palayan City", "Cabanatuan City", "Gapan City", "San Antonio"],
      "Pampanga": ["San Fernando City", "Angeles City", "Mabalacat City", "Arayat"],
      "Tarlac": ["Tarlac City", "Paniqui", "Gerona", "La Paz"],
      "Zambales": ["Iba", "Olongapo City", "Subic", "Castillejos"]
    }
  }
};

export function TrainingReportForm({ sessionType, onBack, onSubmitSuccess }: TrainingReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [attendanceFile, setAttendanceFile] = useState<File | null>(null);
  const [trainerName, setTrainerName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedParticipantCount, setSubmittedParticipantCount] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainer_full_name: "",
      workshop_date: "",
      workshop_location: "",
      region: "",
      province: "",
      lgu: "",
      affiliation_type: undefined,
      affiliation_name: "",
      total_participants: 0,
      youth_count: 0,
      parent_count: 0,
      educator_count: 0,
    },
  });

  // Load trainer name from profile when component mounts
  useState(() => {
    const loadTrainerName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (profile && (profile.first_name || profile.last_name)) {
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setTrainerName(fullName);
          form.setValue('trainer_full_name', fullName);
        }
      }
    };
    loadTrainerName();
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return false;
      }
      return file.type.startsWith('image/');
    });
    
    if (validFiles.length + photoFiles.length > 5) {
      toast({
        title: "Too many photos",
        description: "Maximum 5 photos allowed",
        variant: "destructive",
      });
      return;
    }
    
    setPhotoFiles([...photoFiles, ...validFiles]);
  };

  const handleAttendanceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Attendance sheet must be smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setAttendanceFile(file);
    }
  };

  const uploadFiles = async (userId: string, reportId: string) => {
    const uploadedPhotos: string[] = [];
    let attendanceUrl = '';

    // Upload photos
    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const fileName = `${userId}/${reportId}/photo_${i + 1}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('master-trainer-reports')
        .upload(fileName, file);
      
      if (error) throw error;
      uploadedPhotos.push(data.path);
    }

    // Upload attendance sheet
    if (attendanceFile) {
      const fileName = `${userId}/${reportId}/attendance_${attendanceFile.name}`;
      
      const { data, error } = await supabase.storage
        .from('master-trainer-reports')
        .upload(fileName, attendanceFile);
      
      if (error) throw error;
      attendanceUrl = data.path;
    }

    return { uploadedPhotos, attendanceUrl };
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!photoFiles.length) {
      toast({
        title: "Photos required",
        description: "Please upload at least one event photo",
        variant: "destructive",
      });
      return;
    }

    if (!attendanceFile) {
      toast({
        title: "Attendance sheet required",
        description: "Please upload the attendance sheet",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Insert the report first to get the ID
      const { data: report, error: reportError } = await supabase
        .from('training_session_reports')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          trainer_full_name: values.trainer_full_name,
          workshop_date: values.workshop_date,
          workshop_location: values.workshop_location,
          region: values.region,
          province: values.province,
          lgu: values.lgu,
          affiliation_type: values.affiliation_type,
          affiliation_name: values.affiliation_name,
          total_participants: values.total_participants,
          youth_count: values.youth_count,
          parent_count: values.parent_count,
          educator_count: values.educator_count,
          status: 'submitted'
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Upload files
      const { uploadedPhotos, attendanceUrl } = await uploadFiles(user.id, report.id);

      // Update the report with file URLs
      const { error: updateError } = await supabase
        .from('training_session_reports')
        .update({
          photos: uploadedPhotos,
          attendance_sheet_url: attendanceUrl,
        })
        .eq('id', report.id);

      if (updateError) throw updateError;

      // Update progress targets by accumulating the new participants
      const fieldToUpdate = sessionType === 'hour_of_code' ? 'hour_of_code_current' : 'depth_training_current';
      
      // First, get the current targets to add to existing count
      const { data: currentTargets } = await supabase
        .from('master_trainer_targets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      const currentCount = currentTargets?.[fieldToUpdate] || 0;
      const newTotal = currentCount + values.total_participants;
      
      const { error: progressError } = await supabase
        .from('master_trainer_targets')
        .upsert({
          user_id: user.id,
          [fieldToUpdate]: newTotal
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });
      
      if (progressError) {
        console.warn('Error updating progress:', progressError);
        // Don't fail the entire submission if progress update fails
      }

      // Store participant count and show success page
      setSubmittedParticipantCount(values.total_participants);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <SuccessPage 
        sessionType={sessionType}
        participantCount={submittedParticipantCount}
        onBackToDashboard={onSubmitSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {sessionType === 'hour_of_code' ? '⏰ Hour of Code' : '🎓 12-Hour Training'} Session Report
          </CardTitle>
          <CardDescription>
            Complete all required fields to submit your training session report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="trainer_full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name of Master Trainer</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workshop_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Workshop</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workshop_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workshop Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Manila City Hall" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location Details</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedRegion(value);
                            setSelectedProvince("");
                            form.setValue('province', '');
                            form.setValue('lgu', '');
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(philippineLocations).map(([key, region]) => (
                              <SelectItem key={key} value={key}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedProvince(value);
                            form.setValue('lgu', '');
                          }}
                          value={field.value}
                          disabled={!selectedRegion}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedRegion && philippineLocations[selectedRegion as keyof typeof philippineLocations] &&
                              Object.keys(philippineLocations[selectedRegion as keyof typeof philippineLocations].provinces).map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lgu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LGU</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedProvince}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select LGU" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedRegion && selectedProvince && 
                              philippineLocations[selectedRegion as keyof typeof philippineLocations]?.provinces[selectedProvince]?.map((lgu) => (
                                <SelectItem key={lgu} value={lgu}>
                                  {lgu}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affiliation_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Affiliation of Participants</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select affiliation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="School">School</SelectItem>
                          <SelectItem value="Community">Community</SelectItem>
                          <SelectItem value="Workplace">Workplace</SelectItem>
                          <SelectItem value="University">University</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="affiliation_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Affiliation</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., ABC Elementary School" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Participant Summary</h3>
                
                <FormField
                  control={form.control}
                  name="total_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Number of Participants</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="1"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="youth_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Youth</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parent_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="educator_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Educator</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documentation</h3>
                
                <div>
                  <Label htmlFor="photos">Upload Event Photos (Max 5MB each, up to 5 photos)</Label>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="mt-1"
                  />
                  {photoFiles.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {photoFiles.length} photo(s) selected
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Label htmlFor="attendance">Attendance Sheet</Label>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => window.open('https://docs.google.com/spreadsheets/d/1W7lBLNerjb2KBkgfdasIFih_nOu7VyMFZh_EXVJfCME/edit?usp=sharing', '_blank')}
                      className="p-0 h-auto text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Template
                    </Button>
                  </div>
                  <Input
                    id="attendance"
                    type="file"
                    accept=".xlsx,.xls,.csv,.pdf"
                    onChange={handleAttendanceUpload}
                  />
                  {attendanceFile && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {attendanceFile.name} selected
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>
                  ← Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}