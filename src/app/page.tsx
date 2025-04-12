'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {listGoogleDocuments, getGoogleDocumentChanges, GoogleDocument} from '@/services/google-docs';
import {analyzeDocumentChanges} from '@/ai/flows/analyze-document-changes';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {GoogleDocsLogoIcon, AsteriskIcon} from '@/components/icons';
import {generateSocialPost} from '@/ai/flows/generate-social-post';

export default function Home() {
  const [googleDocuments, setGoogleDocuments] = useState<GoogleDocument[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const documents = await listGoogleDocuments();
      setGoogleDocuments(documents);
    };

    fetchDocuments();
  }, []);

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const handleAnalyzeDocument = async () => {
    if (selectedDocumentId) {
      const changes = await getGoogleDocumentChanges(selectedDocumentId);
      if (changes && changes.length > 0) {
        const analysisResult = await analyzeDocumentChanges({documentId: selectedDocumentId, changes: changes});
        setAnalysisSummary(analysisResult.summary);
      } else {
        setAnalysisSummary("No changes found in the last 24 hours.");
      }
    }
  };

  const handleGenerateSocialPost = async () => {
      if (selectedDocumentId) {
          const changes = await getGoogleDocumentChanges(selectedDocumentId);
          if (changes && changes.length > 0) {
              const post = await generateSocialPost({documentId: selectedDocumentId, changes: changes});
              if (post && post.postContent) {
                  // TODO: Implement posting to social feed.
                  alert("Generated Post: " + post.postContent); // Replace with actual posting logic
              } else {
                  alert("Could not generate social post.");
              }
          } else {
              alert("No changes found to generate a social post.");
          }
      }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-3xl font-bold text-calm-blue">
          Welcome to{' '}
          <span className="text-accent">The Myth Dimension</span>
        </h1>

        <div className="mt-6">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Select Google Document</CardTitle>
              <CardDescription>Choose a document to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              {googleDocuments.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {selectedDocumentId ? googleDocuments.find(doc => doc.documentId === selectedDocumentId)?.title : "Select a document"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {googleDocuments.map((doc) => (
                      <DropdownMenuItem key={doc.documentId} onSelect={() => handleDocumentSelect(doc.documentId)}>
                        {doc.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div>Loading documents...</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button onClick={handleAnalyzeDocument} disabled={!selectedDocumentId}>
            Analyze Document
          </Button>
          <Button onClick={handleGenerateSocialPost} disabled={!selectedDocumentId} className="ml-4">
              Generate Social Post
          </Button>
        </div>

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
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p>
          Powered by Firebase Studio
        </p>
      </footer>
    </div>
  );
}
