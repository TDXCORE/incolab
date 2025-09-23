import { use } from 'react';

import { PersonalAccountSettingsContainer } from '@kit/accounts/personal-account-settings';
import { PageBody } from '@kit/ui/page';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

const callbackPath = pathsConfig.auth.callback;

const features = {
  enableAccountDeletion: true,
  enablePasswordUpdate: authConfig.providers.password,
};

const paths = {
  callback: callbackPath + `?next=${pathsConfig.app.profileSettings}`,
};

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('account:settingsTab');

  return {
    title,
  };
};

function PersonalAccountSettingsPage() {
  const user = use(requireUserInServerComponent());
  const userId = user.id;

  return (
    <PageBody>
      <div className={'flex w-full flex-1 flex-col p-4 md:p-6'}>
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configuración de Perfil</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        <div className={'w-full max-w-4xl mx-auto'}>
          <PersonalAccountSettingsContainer
            userId={userId}
            paths={paths}
            features={features}
          />
        </div>
      </div>
    </PageBody>
  );
}

export default withI18n(PersonalAccountSettingsPage);
