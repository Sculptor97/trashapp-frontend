import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Calendar } from 'lucide-react';

interface QuickActionsProps {
  onSchedulePickup: () => void;
}

export function QuickActions({ onSchedulePickup }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={onSchedulePickup}
          >
            <div className="text-left">
              <div className="flex items-center gap-2 font-medium">
                <Plus className="h-4 w-4" />
                Schedule Pickup
              </div>
              <div className="text-sm text-muted-foreground">
                Request a new waste collection
              </div>
            </div>
          </Button>

          <Button variant="outline" className="justify-start h-auto p-4">
            <div className="text-left">
              <div className="flex items-center gap-2 font-medium">
                <RefreshCw className="h-4 w-4" />
                Track Active
              </div>
              <div className="text-sm text-muted-foreground">
                View ongoing pickups
              </div>
            </div>
          </Button>

          <Button variant="outline" className="justify-start h-auto p-4">
            <div className="text-left">
              <div className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4" />
                View Schedule
              </div>
              <div className="text-sm text-muted-foreground">
                See upcoming pickups
              </div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
