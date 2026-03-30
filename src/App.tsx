import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="test-tailwind bg-red-500 text-white p-4 rounded-lg mb-4">
        Test Tailwind - This should be red with white text
      </div>
      
      <h1 className="text-5xl font-bold mb-6 text-gray-900">
        SignalFromNoise
      </h1>

      <p className="text-xl text-muted-foreground mb-8 max-w-xl bg-white p-4 rounded-lg shadow-lg">
        Know what's quietly gaining traction — before it explodes.
      </p>

      <div className="flex gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
        <div className="w-16 h-16 bg-green-500 rounded-lg"></div>
        <div className="w-16 h-16 bg-purple-500 rounded-xl"></div>
      </div>

      <Button size="lg" asChild className="bg-indigo-600 hover:bg-indigo-700">
        <Link to="/dashboard">
          View Today's Report
        </Link>
      </Button>
    </main>
  );
}