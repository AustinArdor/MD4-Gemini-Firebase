import {ArrowRight, Check, ChevronsUpDown, Circle, Copy, Edit, ExternalLink, File, HelpCircle, Home, Loader2, Mail, MessageSquare, Moon, Plus, PlusCircle, Search, Server, Settings, Share2, Shield, Sun, Trash, User, X, Workflow} from 'lucide-react';

const Icons = {
  arrowRight: ArrowRight,
  check: Check,
  chevronDown: ChevronsUpDown,
  circle: Circle,
  workflow: Workflow,
  close: X,
  copy: Copy,
  dark: Moon,
  edit: Edit,
  externalLink: ExternalLink,
  file: File,
  help: HelpCircle,
  home: Home,
  light: Sun,
  loader: Loader2,
  mail: Mail,
  messageSquare: MessageSquare,
  plus: Plus,
  plusCircle: PlusCircle,
  search: Search,
  server: Server,
  settings: Settings,
  share: Share2,
  shield: Shield,
  spinner: Loader2,
  trash: Trash,
  user: User,
  googleDocs: GoogleDocsLogoIcon,
  asterisk: AsteriskIcon,
};

function GoogleDocsLogoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-google-docs"
    >
      <path d="M2 20V4c0-.5.3-1 .7-1.3C3.2.3 3.8 0 4 0h16c.5 0 1 .3 1.3.7.4.3.7.8.7 1.3v16c0 .5-.3 1-.7 1.3-.3.4-.8.7-1.3.7H4c-.5 0-1-.3-1.3-.7C2.3 19 2 19.5 2 20Z" />
      <path d="M8 2v20" />
      <path d="M16 2v20" />
      <path d="M2 8h20" />
      <path d="M2 16h20" />
    </svg>
  )
}

function AsteriskIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-asterisk"
    >
      <path d="M12 17.5V6.5" />
      <path d="m6.5 12 11 0" />
      <path d="m17.5 17.5-11-11" />
      <path d="m6.5 17.5 11-11" />
    </svg>
  )
}

export {Icons};
