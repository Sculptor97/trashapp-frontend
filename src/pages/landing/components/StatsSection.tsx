import { APP_CONFIG } from '@/config/app';

export function StatsSection() {
  return (
    <section className="py-20 bg-brand-primary text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold">
              {APP_CONFIG.stats.users}
            </div>
            <div className="text-brand-light">Happy Users</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold">
              {APP_CONFIG.stats.pickups}
            </div>
            <div className="text-brand-light">Pickups Completed</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold">
              {APP_CONFIG.stats.recycled}
            </div>
            <div className="text-brand-light">Tons Recycled</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold">
              {APP_CONFIG.stats.cities}
            </div>
            <div className="text-brand-light">Cities Served</div>
          </div>
        </div>
      </div>
    </section>
  );
}
