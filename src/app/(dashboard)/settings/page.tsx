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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Database,
  Server,
  Key,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [spaceId, setSpaceId] = useState("sp_prod_0091");
  const [deliveryToken, setDeliveryToken] = useState("••••••••••••••••••••");
  const [previewToken, setPreviewToken] = useState("••••••••••••••••••••");
  const [env, setEnv] = useState("master");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <>
      <div>
        <h2 className="text-[30px] leading-[38px] font-semibold text-[#151C27] tracking-[-0.02em]">
          Settings
        </h2>
        <p className="text-[#6B7280] text-base">
          Configure Contentful integrations and environment parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Connection Form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSave}>
            <Card className="border-[#E5E7EB] ambient-shadow">
              <CardHeader className="border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#4F46E5]" />
                  <CardTitle className="text-lg font-semibold text-[#151C27]">
                    Contentful Integration
                  </CardTitle>
                </div>
                <CardDescription>
                  Enter your Space ID and API Access Tokens to establish a CMS handshake.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Space ID
                    </label>
                    <Input
                      value={spaceId}
                      onChange={(e) => setSpaceId(e.target.value)}
                      className="border-[#E5E7EB] focus-visible:ring-[#4F46E5] bg-white text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Environment
                    </label>
                    <Input
                      value={env}
                      onChange={(e) => setEnv(e.target.value)}
                      className="border-[#E5E7EB] focus-visible:ring-[#4F46E5] bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#777587]" />
                    Content Delivery API Access Token
                  </label>
                  <Input
                    type="password"
                    value={deliveryToken}
                    onChange={(e) => setDeliveryToken(e.target.value)}
                    className="border-[#E5E7EB] focus-visible:ring-[#4F46E5] bg-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#777587]" />
                    Content Preview API Access Token
                  </label>
                  <Input
                    type="password"
                    value={previewToken}
                    onChange={(e) => setPreviewToken(e.target.value)}
                    className="border-[#E5E7EB] focus-visible:ring-[#4F46E5] bg-white text-sm"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#E5E7EB] bg-[#F9FAFB]/50 py-4 flex justify-between items-center">
                <p className="text-xs text-[#6B7280]">
                  Credentials are encrypted and stored in environment configuration.
                </p>
                <Button
                  type="submit"
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 gap-2"
                  disabled={isSaving}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Config"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Status / Env Info Card */}
        <div className="xl:col-span-1">
          <Card className="border-[#E5E7EB] ambient-shadow">
            <CardHeader className="border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#4F46E5]" />
                <CardTitle className="text-lg font-semibold text-[#151C27]">
                  Environment Status
                </CardTitle>
              </div>
              <CardDescription>
                System configuration and connectivity overview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280]">CMS Mode</span>
                  <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border border-[#A7F3D0] font-normal">
                    Adapter: Mock
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280]">Clerk Middleware</span>
                  <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border border-[#A7F3D0] font-normal">
                    Enabled
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280]">Draft Storage</span>
                  <Badge className="bg-indigo-50 text-[#4F46E5] hover:bg-indigo-50 border border-indigo-100 font-mono font-normal">
                    JSON File (dev)
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-[#ECFDF5] rounded-lg border border-[#059669]/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#065F46]">
                    Handshake Established
                  </h4>
                  <p className="text-xs text-[#059669] mt-1 leading-relaxed">
                    Local server is running with persistence adapters ready. Redux Toolkit
                    is synchronized with draft state.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
