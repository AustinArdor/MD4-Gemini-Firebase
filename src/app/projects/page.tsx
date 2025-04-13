'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Progress} from '@/components/ui/progress';
import {cn} from '@/lib/utils';
import {getGoogleDocumentChanges, GoogleDocument} from '@/services/google-docs';
import {analyzeDocumentChanges} from '@/ai/flows/analyze-document-changes';
import {generateSocialPost} from '@/ai/flows/generate-social-post';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {toast} from '@/hooks/use-toast';
import {format} from 'date-fns';
import Link from 'next/link';

// Define Project Type
interface Project {
  id: string;
  title: string;
  summary: string;
  status: 'In Progress' | 'Upcoming' | 'Completed';
  wordCount: number;
  wordCountGoal: number;
  googleDocId?: string;
  isPublic?: boolean;
}

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    summary: '',
    status: 'In Progress',
    wordCount: 0,
    wordCountGoal: 100000,
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [googleDocuments, setGoogleDocuments] = useState<GoogleDocument[]>([]);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [contributions, setContributions] = useState<{[key: string]: number}>({});
  const [showProjectsPublicly, setShowProjectsPublicly] = useState(true);
  const [showContributionsPublicly, setShowContributionsPublicly] = useState(true);

  const maxProjects = 3;
  const maxProjectsUpgrade = 9;
  const isUpgradePossible = projects.length < maxProjectsUpgrade;

    const updateContributions = useCallback(() => {
        const newContributions: {[key: string]: number} = {};

        projects.forEach(project => {
            const dateKey = format(new Date(), 'yyyy-MM-dd');
            if (project.googleDocId) {
                newContributions[dateKey] = (newContributions[dateKey] || 0) + 1;
            } else {
                newContributions[dateKey] = (newContributions[dateKey] || 0);
            }
        });

        setContributions(newContributions);
    }, [projects]);


  const handleProjectUpdate = (projectId: string, changes: Partial<Project>) => {
      setProjects(prevProjects =>
          prevProjects.map(project =>
              project.id === projectId ? {...project, ...changes} : project
          )
      );
  };

  const calculateContributionShade = (count: number): string => {
    if (count === 0) return 'var(--contribution-0)';
    if (count >= 1 && count <= 5) return 'var(--contribution-1-5)';
    if (count > 5 && count <= 10) return 'var(--contribution-5-10)';
    if (count > 10 && count <= 15) return 'var(--contribution-10-15)';
    return 'var(--contribution-15-plus)';
  };

  const loadProjects = useCallback(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
    updateContributions();
  }, [projects, updateContributions]);

  const handleCreateProject = () => {
    if (projects.length < maxProjects) {
      const newId = String(Date.now());
      setProjects([...projects, {...newProject, id: newId}]);
      setNewProject({
        title: '',
        summary: '',
        status: 'In Progress',
        wordCount: 0,
        wordCountGoal: 100000,
      });
    } else {
      toast({
        title: "Upgrade to Premium!",
        description: `Maximum ${maxProjects} projects allowed. Upgrade to premium for more!`,
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  const handleStartEditing = (projectId: string) => {
    setEditingProjectId(projectId);
  };

  const handleCancelEditing = () => {
    setEditingProjectId(null);
  };

  const handleDocumentSelect = (projectId: string, documentId: string) => {
      handleProjectUpdate(projectId, {googleDocId: documentId});
  };



  const today = new Date();
  const days = [];
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }

  const goToPrevious90Days = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 90);
    setCurrentDate(newDate);
  };

  const goToNext90Days = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 90);
    if (newDate <= new Date()) {
        setCurrentDate(newDate);
    }
  };

    const handleAnalyzeDocument = async (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project || !project.googleDocId) {
            toast({
                title: "Error!",
                description: "No Google Doc linked to this project.",
            });
            return;
        }

        try {
            const changes = await getGoogleDocumentChanges(project.googleDocId);
            if (changes && changes.length > 0) {
                const analysisResult = await analyzeDocumentChanges({documentId: project.googleDocId, changes: changes});
                setAnalysisSummary(analysisResult.summary);

                // TODO: implement auto update of word count.
                // const wordCountChange = changes.reduce((acc, change) => acc + change.wordsAdded - change.wordsRemoved, 0);
                // handleProjectUpdate(projectId, {wordCount: project.wordCount + wordCountChange});

            } else {
                setAnalysisSummary("No changes found in the last 24 hours.");
            }
        } catch (error: any) {
            console.error("Error analyzing document:", error);
            toast({
                title: "Error!",
                description: "Failed to analyze document: " + error.message,
            });
        }
    };

    const handleGenerateSocialPost = async (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project || !project.googleDocId) {
            toast({
                title: "Error!",
                description: "No Google Doc linked to this project.",
            });
            return;
        }
        try {
            const changes = await getGoogleDocumentChanges(project.googleDocId);
            if (changes && changes.length > 0) {
                const post = await generateSocialPost({documentId: project.googleDocId, changes: changes});
                if (post && post.postContent) {
                    // TODO: Implement posting to social feed.
                    toast({
                        title: "Generated!",
                        description: "Generated Post: " + post.postContent,
                    });// Replace with actual posting logic
                } else {
                    toast({
                        title: "Error!",
                        description: "Could not generate social post.",
                    });
                }
            } else {
                toast({
                    title: "Error!",
                    description: "No changes found to generate a social post.",
                });
            }
        } catch (error: any) {
            console.error("Error generating social post:", error);
            toast({
                title: "Error!",
                description: "Failed to generate social post: " + error.message,
            });
        }
    };

    const dateFormat = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const getDatesForDisplay = () => {
        const startDate = new Date(currentDate.getTime() - (90 * 24 * 60 * 60 * 1000));
        return {
            startDate: dateFormat.format(startDate),
            endDate: dateFormat.format(currentDate),
        };
    };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-[#4e6d7f]">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        
        <h2 className="text-2xl mt-2 text-[#d7d0d7]">Your Projects</h2>

        <div className="mt-6">
          {projects.map((project) => (
            <Card key={project.id} className="w-[600px] mb-4 bg-project-card-background text-project-card-foreground">
              <CardHeader>
                <CardTitle>
                  {editingProjectId === project.id ? (
                    <Input
                      type="text"
                      maxLength={30}
                      value={project.title}
                      onChange={(e) => handleProjectUpdate(project.id, {title: e.target.value})}
                    />
                  ) : (
                    project.title
                  )}
                </CardTitle>
                <CardDescription>
                  {editingProjectId === project.id ? (
                    <Textarea
                      maxLength={130}
                      value={project.summary}
                      onChange={(e) => handleProjectUpdate(project.id, {summary: e.target.value})}
                    />
                  ) : (
                    project.summary
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingProjectId === project.id ? (
                  <>
                    <div className="grid gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          defaultValue={project.status}
                          onValueChange={(value) => handleProjectUpdate(project.id, {status: value as 'In Progress' | 'Upcoming' | 'Completed'})}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder={project.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Label htmlFor="wordcount">Word Count</Label>
                        <Input
                          type="number"
                          id="wordcount"
                          value={project.wordCount.toString()}
                          onChange={(e) => {
                              const newWordCount = Number(e.target.value);
                              handleProjectUpdate(project.id, { wordCount: newWordCount });
                              const dateKey = format(new Date(), 'yyyy-MM-dd');
                              setContributions(prev => ({ ...prev, [dateKey]: (prev[dateKey] || 0) + 1 }));
                          }}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Label htmlFor="wordcountgoal">Word Count Goal</Label>
                        <Input
                          type="number"
                          id="wordcountgoal"
                          value={project.wordCountGoal.toString()}
                          onChange={(e) => handleProjectUpdate(project.id, {wordCountGoal: Number(e.target.value)})}
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label>Link Google Document</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              {project.googleDocId ? googleDocuments.find(doc => doc.documentId === project.googleDocId)?.title : "Select a document"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            {googleDocuments.map((doc) => (
                              <DropdownMenuItem key={doc.documentId} onSelect={() => handleDocumentSelect(project.id, doc.documentId)}>
                                {doc.title}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center space-x-2">
                          <Label htmlFor="public">Make Project Public</Label>
                          <Switch
                              id="public"
                              checked={project.isPublic}
                              onCheckedChange={(checked) => handleProjectUpdate(project.id, { isPublic: checked })}
                          />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="secondary" onClick={handleCancelEditing}>Cancel</Button>
                      <Button onClick={() => setEditingProjectId(null)}>Save</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <Label>Status: </Label>
                      <span className={cn(
                        "ml-2 rounded-full px-2 py-1 text-xs font-semibold",
                        project.status === 'In Progress' && "bg-[var(--project-status-inprogress)] text-background",
                        project.status === 'Upcoming' && "bg-[var(--project-status-upcoming)] text-background",
                        project.status === 'Completed' && "bg-[var(--project-status-completed)] text-background"
                      )}>
                        {project.status}
                      </span>
                    </div>
                    <div className="mb-4">
                      <Label>Progress: {project.wordCount} / {project.wordCountGoal}</Label>
                      <Progress value={(project.wordCount / project.wordCountGoal) * 100} />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button onClick={() => handleStartEditing(project.id)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                    </div>
                  </>
                )}
                {project.googleDocId && !editingProjectId && (
                  <div className="mt-4 flex justify-between">
                    <Button onClick={() => handleAnalyzeDocument(project.id)}>Analyze Document</Button>
                    <Button onClick={() => handleGenerateSocialPost(project.id)}>Generate Social Post</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length < maxProjects && (
          <Card className="w-[600px] mt-6 bg-project-card-background text-project-card-foreground">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Add a new project to your collection.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="new-project-title">Title</Label>
                  <Input
                    type="text"
                    id="new-project-title"
                    maxLength={30}
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="new-project-summary">Summary</Label>
                  <Textarea
                    id="new-project-summary"
                    maxLength={130}
                    placeholder="Project Summary"
                    value={newProject.summary}
                    onChange={(e) => setNewProject({...newProject, summary: e.target.value})}
                  />
                </div>
              </div>
              <Button className="mt-4" onClick={handleCreateProject}>Create Project</Button>
              {isUpgradePossible ? null :(
                <div className="text-sm text-muted-foreground mt-2">
                  Upgrade to premium to create more than {maxProjects} projects!
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {analysisSummary && (
          <div className="mt-6">
            <Card className="w-[600px]">
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
                <CardDescription>Summary of changes in the document</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{analysisSummary}</p>
              </CardContent>
            </Card>
          </div>
        )}

       <div className="mt-12 w-full">
          <h2 className="text-2xl font-bold text-[#d7d0d7] mb-4">Contribution Tracker</h2>

          <div className="flex justify-center items-center mb-2">
              <Button variant="outline" size="icon" onClick={goToPrevious90Days}><ChevronLeft /></Button>
              <h3 className="mx-4 text-lg font-semibold text-[#d7d0d7]">
                  {(() => {
                      const {startDate, endDate} = getDatesForDisplay();
                      return `${startDate} - ${endDate}`;
                  })()}
              </h3>
              <Button variant="outline" size="icon" onClick={goToNext90Days} disabled={new Date(currentDate.getTime() + (90 * 24 * 60 * 60 * 1000)) > new Date()}><ChevronRight /></Button>
          </div>
          <div className="bg-light-gray p-2 rounded-md">
            <div className="flex gap-1">
              {days.map((day, index) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const contributionCount = contributions[dateKey] || 0;
                const contributionShade = calculateContributionShade(contributionCount);

                return (
                  <div
                    key={`${dateKey}-${index}`}
                    className="w-6 h-6 rounded-sm"
                    style={{backgroundColor: contributionShade}}
                    title={`${dateKey}: ${contributionCount} contributions`}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center space-x-4">
            <Label htmlFor="projects-public" className="text-[#d7d0d7]">Show Projects Publicly</Label>
            <Switch id="projects-public" checked={showProjectsPublicly} onCheckedChange={setShowProjectsPublicly} />

            <Label htmlFor="contributions-public" className="text-[#d7d0d7]">Show Contributions Publicly</Label>
            <Switch id="contributions-public" checked={showContributionsPublicly} onCheckedChange={setShowContributionsPublicly} />
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-12 text-[#d7d0d7] bg-[#344870]">
          <Link href="/settings" className="text-sm font-medium hover:text-accent text-[#d7d0d7] mr-4">
              Settings
          </Link>
          <Link href="/terms" className="text-sm font-medium hover:text-accent text-[#d7d0d7]">
              Terms of Service
          </Link>
      </footer>
    </div>
  );
};

export default ProjectPage;
