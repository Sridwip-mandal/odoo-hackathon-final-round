// Pure Ambient Declaration File (No top-level import/export so it applies globally across all TSX files)

declare namespace React {
  interface FunctionComponent<P = {}> {
    (props: P & { key?: any; onClick?: any }, context?: any): any;
  }
  type FC<P = {}> = FunctionComponent<P>;
  interface ReactElement<P = any, T extends string | FunctionComponent<any> = string | FunctionComponent<any>> {
    type: T;
    props: P;
    key: any;
  }
  type ReactNode = any;
  type FormEvent<T = Element> = any;
  type ChangeEvent<T = Element> = any;
  type MouseEvent<T = Element> = any;
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useRef<T = any>(initialValue?: T): { current: T };
  function useMemo<T>(factory: () => T, deps: any[] | undefined): T;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  interface Context<T> {
    Provider: FunctionComponent<{ value: T; children?: ReactNode }>;
    Consumer: FunctionComponent<{ children: (value: T) => ReactNode }>;
    displayName?: string;
  }
  function createContext<T>(defaultValue: T): Context<T>;
  function useContext<T = any>(context: Context<T> | any): T;
  function createElement(type: any, props?: any, ...children: any[]): any;
  const StrictMode: FunctionComponent<{ children?: ReactNode }>;
  const Fragment: FunctionComponent<{ children?: ReactNode }>;
}

declare module 'react' {
  export = React;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}

declare module 'react-dom' {
  export function render(element: any, container: any): void;
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: any): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment): Root;
}

declare module 'react-router-dom' {
  export const BrowserRouter: React.FC<{ key?: any; children?: React.ReactNode }>;
  export const HashRouter: React.FC<{ key?: any; children?: React.ReactNode }>;
  export const Routes: React.FC<{ key?: any; children?: React.ReactNode }>;
  export const Route: React.FC<{ key?: any; path?: string; element?: React.ReactNode; index?: boolean; children?: React.ReactNode }>;
  export const Link: React.FC<{ key?: any; to: string; className?: string; onClick?: (e?: any) => void; children?: React.ReactNode }>;
  export const NavLink: React.FC<{ key?: any; to: string; className?: string | ((props: { isActive: boolean }) => string); onClick?: (e?: any) => void; children?: React.ReactNode }>;
  export const Outlet: React.FC<{ key?: any }>;
  export const Navigate: React.FC<{ key?: any; to: string; replace?: boolean }>;
  export function useNavigate(): (to: string, options?: any) => void;
  export function useLocation(): { pathname: string; search: string; hash: string; state: any };
  export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T;
}

declare module 'lucide-react' {
  export const Car: React.FC<any>;
  export const PlusCircle: React.FC<any>;
  export const Search: React.FC<any>;
  export const CheckCircle2: React.FC<any>;
  export const Trash2: React.FC<any>;
  export const Edit: React.FC<any>;
  export const Edit3: React.FC<any>;
  export const ShieldCheck: React.FC<any>;
  export const Sliders: React.FC<any>;
  export const Building: React.FC<any>;
  export const Building2: React.FC<any>;
  export const Fuel: React.FC<any>;
  export const DollarSign: React.FC<any>;
  export const Save: React.FC<any>;
  export const Zap: React.FC<any>;
  export const Route: React.FC<any>;
  export const Filter: React.FC<any>;
  export const Eye: React.FC<any>;
  export const Navigation: React.FC<any>;
  export const XCircle: React.FC<any>;
  export const Clock: React.FC<any>;
  export const BarChart3: React.FC<any>;
  export const TrendingUp: React.FC<any>;
  export const TrendingDown: React.FC<any>;
  export const Download: React.FC<any>;
  export const Leaf: React.FC<any>;
  export const Users: React.FC<any>;
  export const Activity: React.FC<any>;
  export const FileSpreadsheet: React.FC<any>;
  export const HelpCircle: React.FC<any>;
  export const MessageSquare: React.FC<any>;
  export const Send: React.FC<any>;
  export const Sparkles: React.FC<any>;
  export const Phone: React.FC<any>;
  export const PhoneCall: React.FC<any>;
  export const PhoneOff: React.FC<any>;
  export const Mail: React.FC<any>;
  export const FileText: React.FC<any>;
  export const ArrowUpDown: React.FC<any>;
  export const ArrowRight: React.FC<any>;
  export const ArrowLeft: React.FC<any>;
  export const ArrowLeftRight: React.FC<any>;
  export const MapPin: React.FC<any>;
  export const Calendar: React.FC<any>;
  export const CalendarDays: React.FC<any>;
  export const Check: React.FC<any>;
  export const CheckCheck: React.FC<any>;
  export const X: React.FC<any>;
  export const Wallet: React.FC<any>;
  export const CreditCard: React.FC<any>;
  export const Settings: React.FC<any>;
  export const History: React.FC<any>;
  export const Bell: React.FC<any>;
  export const User: React.FC<any>;
  export const UserPlus: React.FC<any>;
  export const UserCheck: React.FC<any>;
  export const UserX: React.FC<any>;
  export const Shield: React.FC<any>;
  export const Star: React.FC<any>;
  export const Mic: React.FC<any>;
  export const MicOff: React.FC<any>;
  export const Volume2: React.FC<any>;
  export const VolumeX: React.FC<any>;
  export const AlertTriangle: React.FC<any>;
  export const AlertCircle: React.FC<any>;
  export const QrCode: React.FC<any>;
  export const Copy: React.FC<any>;
  export const Lock: React.FC<any>;
  export const Info: React.FC<any>;
  export const LogOut: React.FC<any>;
  export const ExternalLink: React.FC<any>;
  export const LayoutDashboard: React.FC<any>;
  export const ChevronDown: React.FC<any>;
  export const Menu: React.FC<any>;
  export const RefreshCw: React.FC<any>;
  export const Banknote: React.FC<any>;
  export const Receipt: React.FC<any>;
  export const Bot: React.FC<any>;
  export const Smile: React.FC<any>;
  export const Compass: React.FC<any>;
  export const Layers: React.FC<any>;
  export const Maximize2: React.FC<any>;
  export const Repeat: React.FC<any>;
  export const SlidersHorizontal: React.FC<any>;
  export const ShieldAlert: React.FC<any>;
  export const EyeOff: React.FC<any>;
  export const ArrowDownLeft: React.FC<any>;
  export const ArrowUpRight: React.FC<any>;
  export type LucideIcon = React.FC<any>;
  export const LucideIcon: LucideIcon;
}

declare module 'recharts' {
  export const ResponsiveContainer: React.FC<any>;
  export const LineChart: React.FC<any>;
  export const Line: React.FC<any>;
  export const BarChart: React.FC<any>;
  export const Bar: React.FC<any>;
  export const AreaChart: React.FC<any>;
  export const Area: React.FC<any>;
  export const PieChart: React.FC<any>;
  export const Pie: React.FC<any>;
  export const Cell: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const Legend: React.FC<any>;
  export const CartesianGrid: React.FC<any>;
}

declare module 'leaflet' {
  const L: any;
  export default L;
}

interface Window {
  L: any;
  CARPOOL: any;
  CARPOOL_COMPONENTS: any;
}
