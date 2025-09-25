import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectIntakeForm } from "@/components/rfp/project-intake-form";

export default function NewRfpPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a New RFP</CardTitle>
          <CardDescription>
            Fill out the details below to start a new Request for Proposal. This will create a draft that you can finalize and send later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectIntakeForm />
        </CardContent>
      </Card>
    </div>
  )
}
