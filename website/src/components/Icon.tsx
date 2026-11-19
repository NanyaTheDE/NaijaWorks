import {
  ArrowLeft, ArrowRight, Binoculars, BookOpen, Building2, Bus, CalendarDays, Camera, ChartColumn, Check, ChevronDown, ChevronLeft,
  ChevronRight, ClipboardCheck, Clock, CloudRain, Construction, Droplet, Ellipsis, Eye, Filter, Flag, Globe, HandHelping, Hammer,
  HardHat, Heart, Hospital, House, Image, Inbox, Info, Layers, LayoutGrid, Leaf, LampFloor, Lock, LogOut, Map, MapPin, Megaphone,
  Menu, Mic, Moon, Navigation, Pause, Play, Plus, RefreshCw, School, Search, Send, Settings, ShieldCheck, Smartphone, Sparkles,
  Star, Sun, TrafficCone, Trash2, Trees, TriangleAlert, Upload, User, Users, Video, Volume2, VolumeX, Waves, Wifi, Wrench, X, Zap,
  Bell, type LucideIcon,
} from 'lucide-react';

/**
 * One icon family for the whole site (Lucide), drawn on a single 24px grid with round caps and joins.
 * Pages refer to icons by these short names, so the family can change here without touching any page.
 */
const ICONS: Record<string, LucideIcon> = {
  home: House, map: Map, plus: Plus, list: Menu, users: Users, user: User, bell: Bell, search: Search, pin: MapPin,
  camera: Camera, image: Image, video: Video, mic: Mic, chevronR: ChevronRight, chevronL: ChevronLeft, chevronD: ChevronDown,
  x: X, check: Check, flag: Flag, building: Building2, calendar: CalendarDays, clipboard: ClipboardCheck, tools: Wrench,
  hammer: Hammer, sparkle: Sparkles, eye: Eye, refresh: RefreshCw, pause: Pause, play: Play,
  // categories of public problems
  road: Construction, droplet: Droplet, bolt: Zap, lamp: LampFloor, waves: Waves, cloudrain: CloudRain, trash: Trash2, bus: Bus,
  school: School, health: Hospital, leaf: Leaf, park: Trees, crane: HardHat, target: TrafficCone,
  // general UI
  shield: ShieldCheck, dots: Ellipsis, alert: TriangleAlert, info: Info, clock: Clock, heart: Heart, hand: HandHelping, star: Star,
  binoculars: Binoculars, layers: Layers, chart: ChartColumn, grid: LayoutGrid, inbox: Inbox, wrench: Wrench, megaphone: Megaphone,
  settings: Settings, nav: Navigation, upload: Upload, globe: Globe, wifi: Wifi, lock: Lock, phone: Smartphone,
  arrowR: ArrowRight, arrowL: ArrowLeft, sun: Sun, moon: Moon, filter: Filter, book: BookOpen, logout: LogOut,
  volume: Volume2, mute: VolumeX, send: Send,
};

export function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const Glyph = ICONS[name] ?? Ellipsis;
  // A slightly lighter stroke than Lucide's default matches the site's soft, refined type.
  return <Glyph className={`ic ${className}`} size={size} strokeWidth={1.8} aria-hidden="true" focusable="false" />;
}
