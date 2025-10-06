
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import type { Contractor, MetroCode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HardHat, Users, Wrench, Zap, MapPin, Loader2, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDoc, useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';

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
                    <AvatarFallback className="text-2xl bg-muted">
                        {getIconForType(contractor.type)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-3xl">{contractor.name}</CardTitle>
                    <CardDescription className="text-md">{contractor.type}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                        {contractor.preferred && <Badge>Preferred</Badge>}
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <Separator />
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-4 text-sm">
                        {contactNames.map((name, index) => (
                            <div key={index}>
                                <p><strong>Contact:</strong> {name}</p>
                                {contactEmails[index] && <p className="text-muted-foreground"><strong>Email:</strong> {contactEmails[index]}</p>}
                            </div>
                        ))}
                         <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <p><strong>Phone:</strong> {contractor.contactPhone}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>Region:</strong> {contractor.region}</p>
                        <p><strong>Performance Score:</strong> {contractor.performance}%</p>
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
                        <Badge key={metro.id} variant="outline">{metro.code} - {metro.city}, {metro.state}</Badge>
                    ))}
                    {!metroDetails && contractor.metroCodes.map(code => (
                         <Badge key={code} variant="outline">{code}</Badge>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
