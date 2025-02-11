import { ThemeSwitcher } from "@/components/molecules/theme-switcher";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-center justify-center from-[#810101] bg-gradient-to-b dark:from-[#810101]/50 to-transparent rounded-xl">
        <div className="flex w-full h-full gap-4 items-center justify-between py-3 px-6">
          <Image
            src="/images/psna-logo.avif"
            alt="Logo"
            width={600}
            height={600}
            className="w-10 h-auto object-cover"
          />
          <div>
            <p className="text-white font-semibold text-sm w-full text-center">
              Niucare Login
            </p>
          </div>
          <ThemeSwitcher />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          {children}
        </div>
      </div>
      <Separator className="my-8 max-w-[20rem] bg-muted-foreground/50" />
      <div className="text-balance text-center text-xs  flex-col text-muted-foreground flex items-center gap-4 justify-center [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        <div className="max-w-xs">
          By using this platform, you&apos;re agreeing to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
