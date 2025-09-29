
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getContractorById } from '@/lib/data';
import type { Contractor } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HardHat, Users, Wrench, Zap, Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getContractorById(id).then(data => {
        setContractor(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div>Loading contractor details...</div>;
  }

  if (!contractor) {
    notFound();
  }

  const contactNames = contractor.contactName.split(';').map(name => name.trim());
  const contactEmails = contractor.contactEmail.split(';').map(email => email.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
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
                    Operating Metro Codes
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {contractor.metroCodes.map(code => (
                        <Badge key={code} variant="outline">{code}</Badge>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
