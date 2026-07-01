"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Activity,
  Globe,
  ShieldAlert,
} from "lucide-react";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("technical");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    }, 1200);
  };

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-[30px] leading-[38px] font-semibold text-[#151C27] tracking-[-0.02em]">
          Support
        </h2>
        <p className="text-text-secondary text-base">
          Submit help requests or check platform system health parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Support Ticket Form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="border-border-subtle ambient-shadow">
              <CardHeader className="border-b border-border-subtle bg-surface-sidebar/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo" />
                  <CardTitle className="text-lg font-semibold text-[#151C27]">
                    Submit a Ticket
                  </CardTitle>
                </div>
                <CardDescription>
                  Describe your problem or request, and our engineering team will get back to you.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {sent && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <span className="font-bold block">Ticket Submitted Successfully</span>
                      <span className="text-xs text-emerald-700 mt-0.5 block">
                        We have logged your ticket. Our team will contact you shortly via email.
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Ticket Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-border-subtle bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo"
                    >
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Account</option>
                      <option value="schema">Zod Schema Help</option>
                      <option value="feedback">Feedback & Ideas</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Subject
                    </label>
                    <Input
                      required
                      placeholder="e.g. Testimonial section render issues"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="border-border-subtle focus-visible:ring-indigo bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Description & Error Logs
                  </label>
                  <Textarea
                    required
                    rows={6}
                    placeholder="Describe what occurred, including any steps to reproduce, or paste API error logs."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border-border-subtle focus-visible:ring-indigo bg-white text-sm min-h-[140px]"
                  />
                </div>
              </CardContent>

              <CardFooter className="border-t border-border-subtle p-4 bg-surface-sidebar/30 flex justify-between items-center">
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> support@launchpad.dev
                </span>
                <Button
                  type="submit"
                  disabled={isSending || !subject || !message}
                  className="bg-indigo hover:bg-[#4338CA] text-white flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Submitting..." : "Send Ticket"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Sidebar Info Card */}
        <div className="space-y-6">
          {/* System Health */}
          <Card className="border-border-subtle ambient-shadow">
            <CardHeader className="border-b border-border-subtle bg-surface-sidebar/50">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-sm font-bold text-[#151C27] uppercase tracking-wider">
                  Platform Status
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Visual Sandbox</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">CDN API Gateway</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  99.98% operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Release Persistency</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Normal (12ms latency)
                </span>
              </div>
              <div className="pt-3 border-t border-border-subtle text-[11px] text-text-secondary flex items-start gap-1">
                <Globe className="w-3.5 h-3.5 shrink-0 mt-0.5 text-text-muted" />
                <span>All global regions operational. CDN endpoints synced.</span>
              </div>
            </CardContent>
          </Card>

          {/* SLA Warning */}
          <Card className="border-border-subtle ambient-shadow bg-amber-50/20 border-amber-100">
            <CardContent className="p-5 flex items-start gap-3 text-left">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Developer Support SLA
                </h4>
                <p className="text-xs text-amber-700 leading-normal mt-1">
                  Standard organization users receive responses within 24 hours. Enterprise users have access to 1-hour priority response SLAs and Slack channels.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
