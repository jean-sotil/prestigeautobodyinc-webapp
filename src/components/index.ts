// UI Components - Atomic Components
export { Button, ButtonLink, IconButton } from './ui/Button';
export { Icon, IconFill, IconLink } from './ui/Icon';
export {
  Badge,
  TrustBadge,
  CertificationRow,
  StatusBadge,
  CERTIFICATIONS,
  type CertificationInfo,
} from './ui/Badge';
export {
  Typography,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Body,
  Caption,
  Label,
  LeadText,
  VisuallyHidden,
} from './ui/Typography';

export {
  Skeleton,
  CardSkeleton,
  FormSkeleton,
  EmbedSkeleton,
} from './ui/Skeleton';

// Icons (SVG Components)
export {
  PhoneIcon,
  EmailIcon,
  LocationIcon,
  ClockIcon,
  WrenchIcon,
  ShieldIcon,
  AwardIcon,
  CarIcon,
  PaintbrushIcon,
  TowTruckIcon,
  ChevronRightIcon,
  MenuIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  QuoteIcon,
} from './ui/Icons';

// Embed Components — use dynamic imports from @/components/dynamic/ instead
// Direct re-exports removed to improve tree-shaking

// Performance Components
export { WebVitals } from './performance/WebVitals';

export { default as Breadcrumbs } from './Breadcrumbs';
