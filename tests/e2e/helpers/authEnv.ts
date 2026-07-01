export const hasClerkE2EConfig =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk") &&
  !!process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("mocksecretkeyfordevelopmentonly");
