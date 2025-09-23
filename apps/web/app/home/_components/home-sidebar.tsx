import type { JwtPayload } from '@supabase/supabase-js';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNavigation,
  SidebarTrigger,
  useSidebar,
} from '@kit/ui/shadcn-sidebar';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';
import { navigationConfig } from '~/config/navigation.config';
import { Tables } from '~/lib/database.types';

function SidebarLogo() {
  const { open } = useSidebar();

  return (
    <div className={'flex items-center justify-center'}>
      {open ? (
        <AppLogo className={'max-w-full'} />
      ) : (
        <span className="text-lg font-bold text-primary dark:text-white">I</span>
      )}
    </div>
  );
}

export function HomeSidebar(props: {
  account?: Tables<'accounts'>;
  user: JwtPayload;
}) {
  return (
    <Sidebar collapsible={'icon'}>
      <SidebarHeader className={'h-16 justify-center'}>
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavigation config={navigationConfig} />
      </SidebarContent>

      <SidebarFooter>
        <div className={'flex flex-col space-y-2'}>
          <ProfileAccountDropdownContainer
            user={props.user}
            account={props.account}
          />
          <div className={'flex justify-center px-2'}>
            <SidebarTrigger
              variant={'ghost'}
              className={'h-9 w-9 [&>svg]:h-4 [&>svg]:w-4'}
            />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
