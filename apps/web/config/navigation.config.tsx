import { Home, User, FileText, Truck, FlaskConical, BarChart3 } from 'lucide-react';
import { z } from 'zod';

import { NavigationConfigSchema } from '@kit/ui/navigation-schema';

import pathsConfig from '~/config/paths.config';

const iconClasses = 'w-4';

const routes = [
  {
    label: 'Incolab',
    children: [
      {
        label: 'Dashboard',
        path: '/home/dashboard',
        Icon: <BarChart3 className={iconClasses} />,
      },
      {
        label: 'Referencias',
        path: '/home/references',
        Icon: <FileText className={iconClasses} />,
      },
      {
        label: 'Operaciones',
        path: '/home/operations',
        Icon: <Truck className={iconClasses} />,
      },
      {
        label: 'Laboratorio',
        path: '/home/laboratory',
        Icon: <FlaskConical className={iconClasses} />,
      },
    ],
  },
  {
    label: 'common:routes.settings',
    children: [
      {
        label: 'common:routes.profile',
        path: pathsConfig.app.profileSettings,
        Icon: <User className={iconClasses} />,
      },
    ],
  },
] satisfies z.infer<typeof NavigationConfigSchema>['routes'];

export const navigationConfig = NavigationConfigSchema.parse({
  routes,
  style: process.env.NEXT_PUBLIC_NAVIGATION_STYLE,
  sidebarCollapsed: process.env.NEXT_PUBLIC_HOME_SIDEBAR_COLLAPSED,
});
