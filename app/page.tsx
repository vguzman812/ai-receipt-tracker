import PDFDropzone from "@/components/PDFDropzone";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Search, Shield, Upload } from "lucide-react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark: dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Intelligent Receipt Scanning
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Scan, analyze, and organize your receipts with AI-powered
                precision. Save time and gain insights from your expenses.
              </p>
            </div>

            <div className="space-x-4">
              <Link href="/receipts">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
          {/* PDF Dropzone */}
          <div className="mt-12 flex justify-center">
            <div className="relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden dark:border-gray-800 dark:bg-gray-950">
              <div className="p-6 md:p-8 relative">
                <PDFDropzone />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Powerful Features
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Transform your receipts into actionable insights with our
                AI-powered tool.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-grat-800">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Upload className="h-6-w-6-text-blue-600 dark:text-blue-400"></Upload>
                </div>
                <h3 className="text-xl font-bold">Easty Uploads</h3>
                <p className="text-gray-500 dar:text-gray-400 text-center">
                  Drag and drop your PDF receipts for instant scanning and
                  processing.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-00">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Automatically extract and categorize expense data with
                  intelligent AI
                </p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Expense Insights</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Generate reports and gain valuable insights from your
                  spending.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing */}
      <section className="py-16 md:py-24 bg-gray50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center jsutify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Simple Pricing
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Choose the plan that fits your needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Plan 1 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Upload className="h-6-w-6-text-blue-600 dark:text-blue-400"></Upload>
                </div>
                <h3 className="text-xl font-bold">Free Plan</h3>
                <p className="text-gray-500 dar:text-gray-400 text-center">
                  Ideal for occasional use.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  $0/month
                </p>
                <div className="mt-6">
                  <Link href="/manage-plan">
                    <Button className="w-full">Sign Up Free</Button>
                  </Link>
                </div>
              </div>
              {/* Plan 2 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Starter Plan</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Ideal for frequent use.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  $5/month
                </p>
                <div className="mt-6">
                  <Link href="/manage-plan">
                    <Button className="w-full">Choose Plan</Button>
                  </Link>
                </div>
              </div>
              {/* Plan 3 */}
              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Pro Plan</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Ideal for large organizations.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  $10/month
                </p>
                <div className="mt-6">
                  <Link href="/manage-plan">
                    <Button className="w-full">Choose Plan</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Info */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Joun Thousands of users who have lorem ipsum.
              </h2>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 md:px-6 py-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1">
              <Shield className="h-6 2-6 text-blue-600" />
              <span className="text-xl font-semibold">Expensio</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expensio. The smarter way to track your moeny
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Home;
