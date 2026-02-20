import { Home, LineChart, FileText, Upload, Settings, User, AlertTriangle, ShieldCheck, Coins, Gavel, ScanSearch, Workflow, FileUp, Users, MessageSquare } from 'lucide-react';

export const LS_KEYS = {
  token: 'infralith_token',
  project: 'infralith_current_project',
  user: 'infralith_user_name',
  avatar: 'infralith_user_avatar',
  email: 'infralith_email',
  logs: 'infralith_logs',
  resume: 'infralith_resume_temp',
};

const mainNav = {
  key: 'main',
  label: '',
  items: [
    { key: 'home', label: 'Overview', icon: Home, auth: false },
    { key: 'upload', label: 'Blueprint Upload', icon: Upload, auth: true, roles: ['Engineer', 'Admin'] },
  ],
};

const pipelineNav = {
  key: 'pipeline',
  label: 'AI Processing',
  items: [
    { key: 'search', label: 'AI Search Index', icon: ScanSearch, auth: true },
  ],
};

const communityNav = {
  key: 'social',
  label: 'Communication',
  items: [
    { key: 'community', label: 'Community', icon: Users, auth: true },
    { key: 'chat', label: 'AI Career Chat', icon: MessageSquare, auth: true },
  ],
};

const evaluationNav = {
  key: 'evaluation',
  label: 'Evaluation',
  items: [
    { key: 'compliance', label: 'Compliance', icon: ShieldCheck, auth: true },
    { key: 'risk', label: 'Risk Analysis', icon: AlertTriangle, auth: true },
    { key: 'cost', label: 'Cost Prediction', icon: Coins, auth: true },
  ],
};

const decisionNav = {
  key: 'decision',
  label: 'Decision',
  items: [
    { key: 'decision', label: 'Supervisor Panel', icon: Gavel, auth: true, roles: ['Supervisor', 'Admin'] },
    { key: 'report', label: 'Final Report', icon: FileText, auth: true },
  ],
};

const accountNav = {
  key: 'account',
  label: 'Account',
  items: [
    { key: 'settings', label: 'Settings', icon: Settings, auth: true },
  ],
};

export const navGroups = [mainNav, pipelineNav, communityNav, evaluationNav, decisionNav, accountNav];

export const navItems = [...mainNav.items, ...pipelineNav.items, ...communityNav.items, ...evaluationNav.items, ...decisionNav.items, ...accountNav.items];