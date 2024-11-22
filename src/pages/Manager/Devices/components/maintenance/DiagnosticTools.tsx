import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Wifi, 
  BarChart2,
  PlayCircle,
  StopCircle
} from "lucide-react";
import { toast } from "sonner";

interface DiagnosticTest {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "completed" | "failed";
  progress: number;
  result?: string;
}

export function DiagnosticTools() {
  const [tests, setTests] = useState<DiagnosticTest[]>([
    {
      id: "1",
      name: "CPU Stress Test",
      description: "Tests CPU performance under load",
      status: "idle",
      progress: 0
    },
    {
      id: "2",
      name: "Memory Test",
      description: "Checks memory integrity and performance",
      status: "idle",
      progress: 0
    },
    {
      id: "3",
      name: "Network Test",
      description: "Verifies network connectivity and speed",
      status: "idle",
      progress: 0
    },
    {
      id: "4",
      name: "Storage Test",
      description: "Checks storage health and performance",
      status: "idle",
      progress: 0
    }
  ]);

  const runTest = (testId: string) => {
    setTests(tests.map(test => {
      if (test.id === testId) {
        return { ...test, status: "running" as const, progress: 0 };
      }
      return test;
    }));

    // Simulate test progress
    const interval = setInterval(() => {
      setTests(prevTests => {
        const updatedTests = prevTests.map(test => {
          if (test.id === testId) {
            const newProgress = test.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              toast.success(`${test.name} completed successfully`);
              return { 
                ...test, 
                status: "completed" as const, 
                progress: 100,
                result: "All parameters within normal range"
              };
            }
            return { ...test, progress: newProgress };
          }
          return test;
        });
        return updatedTests;
      });
    }, 500);
  };

  const stopTest = (testId: string) => {
    setTests(tests.map(test => {
      if (test.id === testId) {
        return { ...test, status: "idle" as const, progress: 0 };
      }
      return test;
    }));
    toast.info("Test stopped");
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "CPU Stress Test":
        return <Cpu className="h-5 w-5" />;
      case "Memory Test":
        return <BarChart2 className="h-5 w-5" />;
      case "Network Test":
        return <Wifi className="h-5 w-5" />;
      case "Storage Test":
        return <HardDrive className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {tests.map((test) => (
          <Card key={test.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                {getIcon(test.name)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{test.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{test.description}</p>
                
                <div className="mt-4 space-y-4">
                  {test.status !== "idle" && (
                    <Progress value={test.progress} className="h-2" />
                  )}
                  
                  {test.result && test.status === "completed" && (
                    <p className="text-sm text-green-600">{test.result}</p>
                  )}

                  <div className="flex gap-2">
                    {test.status === "idle" || test.status === "failed" ? (
                      <Button 
                        onClick={() => runTest(test.id)}
                        className="flex items-center gap-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Run Test
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => stopTest(test.id)}
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <StopCircle className="h-4 w-4" />
                        Stop Test
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}