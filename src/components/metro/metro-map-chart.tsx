
'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Metro = {
  code: string;
  city: string;
  state: string;
  region: string;
  lat: number;
  lon: number;
};

type MetroMapChartProps = {
  metros: Metro[];
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 border bg-background rounded-md shadow-lg text-sm">
        <p className="font-bold">{data.code}</p>
        <p>{data.city}, {data.state}</p>
      </div>
    );
  }
  return null;
};

export function MetroMapChart({ metros }: MetroMapChartProps) {
  const mapImage = PlaceHolderImages.find(img => img.id === 'usa-map');

  const validMetros = metros.filter(m => 
    m.region !== 'Canada' &&
    typeof m.lat === 'number' && isFinite(m.lat) &&
    typeof m.lon === 'number' && isFinite(m.lon)
  );

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: '1000 / 600' }}
    >
      {mapImage && (
        <img
          src={mapImage.imageUrl}
          alt="USA Map"
          data-ai-hint={mapImage.imageHint}
          className="absolute inset-0 w-full h-full object-contain opacity-40"
        />
      )}
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
          <XAxis 
            type="number" 
            dataKey="lon" 
            name="longitude" 
            domain={[-130, -65]} 
            tick={false}
            axisLine={false}
          />
          <YAxis 
            type="number" 
            dataKey="lat" 
            name="latitude" 
            domain={[24, 50]} 
            tick={false}
            axisLine={false}
          />
          <ZAxis dataKey="code" name="code" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Scatter name="Metros" data={validMetros} fill="hsl(var(--primary))" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
