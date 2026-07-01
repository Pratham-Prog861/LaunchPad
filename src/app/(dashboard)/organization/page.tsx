import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[30px] leading-[38px] font-semibold text-[#151C27] tracking-[-0.02em]">
          Organization Settings
        </h2>
        <p className="text-text-secondary text-base">
          Manage members, invite team members, configure roles, and view organization profile.
        </p>
      </div>

      <div className="bg-white border border-border-subtle rounded-xl p-4 sm:p-6 md:p-8 ambient-shadow flex justify-center">
        <OrganizationProfile
          routing="hash"
          appearance={{
            elements: {
              cardBox: "shadow-none border-0 w-full max-w-full",
              rootBox: "w-full max-w-full",
            },
          }}
        />
      </div>
    </div>
  );
}
