
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import type { Contractor, MetroCode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HardHat, Users, Wrench, Zap, Star, MapPin, Loader2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDoc, useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const getIconForType = (type: string) => {
    switch (type) {
      case 'General Contractor':
        return <HardHat className="h-5 w-5" />;
      case 'Electrical':
      case 'Electrical / NICON':
      case 'Electrical / Professional Services':
        return <Zap className="h-5 w-5" />;
      case 'Mechanical':
      case 'Electrical / Mechanical':
        return <Wrench className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

export default function ContractorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const contractorRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'contractors', id);
  }, [firestore, id, user]);
  const { data: contractor, isLoading: contractorLoading } = useDoc<Contractor>(contractorRef);

  const metroCodesQuery = useMemoFirebase(() => {
    if (!user || !contractor || !contractor.metroCodes || contractor.metroCodes.length === 0) return null;
    return query(collection(firestore, 'metro_codes'), where('code', 'in', contractor.metroCodes));
  }, [firestore, contractor, user]);

  const { data: metroDetails, isLoading: metrosLoading } = useCollection<MetroCode>(metroCodesQuery);

  const loading = isUserLoading || contractorLoading || metrosLoading;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!contractor) {
    notFound();
  }

  const contactNames = contractor.contactName.split(';').map(name => name.trim());
  const contactEmails = contractor.contactEmail.split(';').map(email => email.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex flex-row items-start gap-4">
                <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-2xl">
                        {getIconForType(contractor.type)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-3xl">{contractor.name}</CardTitle>
                    <CardDescription className="text-md">{contractor.type}</CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                        <Badge variant={contractor.preferredStatus === 'Most Preferred' ? 'default' : 'secondary'}>
                            {contractor.preferredStatus}
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-bold text-lg text-foreground">{contractor.performance}%</span>
                            <span className="text-sm text-muted-foreground">Performance</span>
                        </div>
                    </div>
                </div>
            </div>
            <Button asChild variant="outline">
                <Link href={`/contractors/${id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Link>
            </Button>
        </CardHeader>
        <CardContent className="space-y-6">
            <Separator />
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                        {contactNames.map((name, index) => (
                            <div key={index}>
                                <p><strong>Contact:</strong> {name}</p>
                                {contactEmails[index] && <p className="text-muted-foreground"><strong>Email:</strong> {contactEmails[index]}</p>}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>Region:</strong> {contractor.region}</p>
                        <p><strong>Metro/Site:</strong> {contractor.metroSite}</p>
                    </div>
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Operating Locations
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {metroDetails && metroDetails.map(metro => (
                        <Badge key={metro.code} variant="outline">{metro.code} - {metro.city}, {metro.state}</Badge>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
