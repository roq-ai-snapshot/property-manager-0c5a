const mapping: Record<string, string> = {
  companies: 'company',
  'maintenance-schedules': 'maintenance_schedule',
  'maintenance-tasks': 'maintenance_task',
  properties: 'property',
  'rent-payments': 'rent_payment',
  'supply-orders': 'supply_order',
  tenants: 'tenant',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
