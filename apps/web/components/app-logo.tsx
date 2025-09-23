import Link from 'next/link';

import { cn } from '@kit/ui/utils';

function LogoText({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-2xl font-bold text-primary dark:text-white tracking-tight',
        className
      )}
    >
      Incolab
    </span>
  );
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  if (href === null) {
    return <LogoText className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <LogoText className={className} />
    </Link>
  );
}
