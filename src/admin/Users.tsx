import { Plus, Search } from 'lucide-react';
import { AdminTopBar } from '../components/layout';
import { Avatar, Badge, Button, Card, Input, Tabs } from '../components/ui';
import { approvedDrivers, riders } from '../data/mock';
import { useState } from 'react';

type UsersTab = 'riders' | 'drivers' | 'admins';

export function AdminUsers() {
  const [tab, setTab] = useState<UsersTab>('riders');

  return (
    <>
      <AdminTopBar
        title="Users"
        subtitle="Riders, drivers and admin accounts"
        actions={
          <Button size="sm" leftIcon={Plus}>
            Invite user
          </Button>
        }
      />

      <div className="p-6 space-y-5 max-w-7xl">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <Tabs<UsersTab>
            value={tab}
            onChange={setTab}
            items={[
              { id: 'riders', label: 'Riders', count: riders.length },
              { id: 'drivers', label: 'Drivers', count: approvedDrivers.length },
              { id: 'admins', label: 'Admins', count: 2 },
            ]}
          />
          <div className="w-64">
            <Input leftIcon={Search} placeholder="Search name, email, phone" />
          </div>
        </div>

        <Card padding="none">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-text-muted uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">{tab === 'riders' ? 'Trips' : 'Rides'}</th>
              </tr>
            </thead>
            <tbody>
              {(tab === 'riders' ? riders : tab === 'drivers' ? approvedDrivers : adminUsers).map((u: any, i, arr) => (
                <tr key={u.id} className={`text-sm hover:bg-surface-soft ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size={32} />
                      <span className="font-medium text-text">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-text-muted">{u.email}</td>
                  <td className="px-5 py-3 text-text-muted">{u.phone}</td>
                  <td className="px-5 py-3">
                    <Badge tone="success">Active</Badge>
                  </td>
                  <td className="px-5 py-3 text-right text-text font-medium">{u.totalTrips ?? u.totalRides ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}

const adminUsers = [
  { id: 1, name: 'Admin Desk', email: 'ops@streetlift.app', phone: '+234 811 000 0001', totalTrips: '-' },
  { id: 2, name: 'Tolu Adewale', email: 'tolu@streetlift.app', phone: '+234 811 000 0002', totalTrips: '-' },
];
