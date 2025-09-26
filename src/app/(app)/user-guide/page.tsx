
'use client';
import { generateUserGuide } from '@/ai/flows/generate-user-guide';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { HelpCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserGuidePage() {
    const [guideContent, setGuideContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            setIsLoading(true);
            try {
                const result = await generateUserGuide();
                setGuideContent(result.userGuideHtml);
            } catch (error) {
                console.error("Failed to generate user guide:", error);
                setGuideContent("<p>Sorry, we couldn't load the user guide at this moment. Please try again later.</p>");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGuide();
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="w-6 h-6" />
                        User Guide
                    </CardTitle>
                    <CardDescription>
                        A comprehensive, AI-generated guide to using the RFP Automation Suite.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="ml-3">The AI is generating your user guide...</p>
                        </div>
                    ) : (
                        <div
                            className={cn(
                                "prose prose-sm max-w-none dark:prose-invert",
                                "[&_h2]:mt-8 [&_h2]:border-b [&_h2]:pb-2",
                                "[&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse",
                                "[&_th]:border [&_th]:p-2 [&_th]:font-bold",
                                "[&_td]:border [&_td]:p-2",
                                "[&_ul]:list-disc [&_ul]:pl-5",
                                "[&_details]:border [&_details]:rounded-lg [&_details]:p-4 [&_details]:mt-4",
                                "[&_summary]:font-semibold [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:-m-4 [&_summary]:p-4",
                                "[&_summary::-webkit-details-marker]:hidden",
                                "[&_summary]:before:content-['+'] [&_summary]:before:mr-2",
                                "[&_details[open]>summary]:before:content-['-']"

                            )}
                            dangerouslySetInnerHTML={{ __html: guideContent || '' }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
