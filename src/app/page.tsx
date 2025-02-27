import { Metadata } from "next";
import { AppIdeaForm } from "@/components/app-idea-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "App Store Guidelines Checker",
  description:
    "Check if your iOS app idea complies with Apple's App Store Review Guidelines",
};

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>App Store Guidelines Checker</CardTitle>
          <CardDescription>
            Describe your iOS app idea, and we&apos;ll analyze it against
            Apple&apos;s App Store Review Guidelines to identify potential
            compliance issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppIdeaForm />
        </CardContent>
      </Card>
    </main>
  );
}
