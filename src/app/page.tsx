'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {listGoogleDocuments, getGoogleDocumentChanges, GoogleDocument} from '@/services/google-docs';
import {analyzeDocumentChanges} from '@/ai/flows/analyze-document-changes';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {GoogleDocsLogoIcon, AsteriskIcon} from '@/components/icons';

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
      const analysisResult = await analyzeDocumentChanges({documentId: selectedDocumentId});
      setAnalysisSummary(analysisResult.summary);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-3xl font-bold">
          Welcome to{' '}
          <span className="text-primary">The Myth Dimension</span>
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
