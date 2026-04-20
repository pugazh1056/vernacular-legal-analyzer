"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FIXED_DISCLAIMER } from "@/lib/constants";
import { useLegalFlow } from "@/context/LegalFlowContext";
import { usePreferredOutputLanguage } from "@/hooks/usePreferredOutputLanguage";
import { UploadZone } from "@/components/legal/UploadZone";
import { LANGUAGE_OPTIONS } from "@/lib/profile-preferences";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, BrainCircuit, ShieldAlert, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [preferredLanguage, setPreferredLanguage] = usePreferredOutputLanguage();
  const {
    role,
    roleHydrated,
    sessionId,
    analysis,
    uploadError,
    uploading,
    uploadFile,
    reset,
  } = useLegalFlow();

  const stats = getDashboardStats();

  useEffect(() => {
    if (!roleHydrated) return;
    if (!role) {
      router.replace("/role");
    }
  }, [roleHydrated, role, router]);

  useEffect(() => {
    if (!roleHydrated) return;
    if (analysis && sessionId) {
      router.replace("/results");
    }
  }, [roleHydrated, analysis, sessionId, router]);

  if (!roleHydrated || !role) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-center text-slate-600 dark:text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Upload new legal documents and monitor risk analytics across the platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Docs Analyzed</CardTitle>
            <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.docsAnalyzed}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Responses</CardTitle>
            <BrainCircuit className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionsAsked}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Questions answered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risks Identified</CardTitle>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.docsAnalyzed > 0 ? (stats.docsAnalyzed * 3) + 2 : 0}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Across all docs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 items-start">
        
        {/* Upload Zone & Actions */}
        <Card className="md:col-span-4 bg-slate-50/50 dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle>New Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadZone
              uploading={uploading}
              uploadError={uploadError}
              onFileSelected={(file) => void uploadFile(file, preferredLanguage, role)}
            />
            {sessionId && (
               <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                 <Button onClick={() => reset()} variant="outline" size="sm">
                   Reset Session
                 </Button>
               </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Info */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-500" />
              AI Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Output Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  disabled={uploading}
                  className="w-full flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-slate-300"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  The model reads your file as-is and uses this language for analysis outputs.
                </p>
             </div>
             
             <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900 border border-amber-200">
               {FIXED_DISCLAIMER}
             </p>
          </CardContent>
        </Card>

        {/* History Table mock */}
        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.docsAnalyzed === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                      No documents analyzed yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    <TableRow>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        contract_v4_final.pdf
                      </TableCell>
                      <TableCell><Badge variant="secondary">Analyzed</Badge></TableCell>
                      <TableCell>Today</TableCell>
                      <TableCell className="text-right"><Badge variant="destructive">Critical</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        nda_supplier_x.docx
                      </TableCell>
                      <TableCell><Badge variant="secondary">Analyzed</Badge></TableCell>
                      <TableCell>Yesterday</TableCell>
                      <TableCell className="text-right"><Badge variant="default" className="bg-amber-500 hover:bg-amber-500/80">Medium</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        terms_of_service.txt
                      </TableCell>
                      <TableCell><Badge variant="secondary">Analyzed</Badge></TableCell>
                      <TableCell>3 days ago</TableCell>
                      <TableCell className="text-right"><Badge variant="outline" className="text-green-600 border-green-600">Low</Badge></TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
