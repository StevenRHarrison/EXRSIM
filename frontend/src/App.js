import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Leaflet imports
import { MapContainer as LeafletMapContainer, TileLayer, LayersControl, FeatureGroup, Marker, Popup, Polygon, Polyline, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import leaflet-draw
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

// Import shadcn components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { ScrollArea } from './components/ui/scroll-area';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Textarea } from './components/ui/textarea';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { 
  CalendarDays, 
  Users, 
  AlertTriangle, 
  ClipboardList, 
  Plus, 
  Printer,
  Settings,
  Home,
  BookOpen,
  Target,
  Shield,
  ArrowLeft,
  Camera,
  Upload,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Save,
  Info,
  FileText,
  Flag,
  Map,
  Trophy,
  CheckCircle,
  Calendar,
  Building,
  Key,
  Radio,
  Headphones,
  MessageSquare,
  ShieldAlert,
  Clock,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Lightbulb,
  AlertCircle,
  Zap,
  MessageCircle,
  CheckSquare,
  PenTool,
  FileEdit,
  Package,
  Palette,
  DollarSign,
  BookText,
  ExternalLink,
  UserCog,
  FileCheck
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme configurations
const themes = {
  dark: {
    name: 'Dark Theme',
    colors: {
      // Main backgrounds
      primary: 'bg-black',
      secondary: 'bg-gray-900',
      tertiary: 'bg-gray-800',
      quaternary: 'bg-gray-700',
      
      // Text colors
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      
      // Borders
      border: 'border-gray-700',
      borderLight: 'border-gray-600',
      borderAccent: 'border-orange-500/20',
      
      // Interactive elements
      hover: 'hover:bg-gray-700',
      active: 'bg-orange-500/5',
      
      // Form elements
      input: 'bg-gray-800 border-gray-700 text-white placeholder-gray-400',
      select: 'bg-gray-800 border-gray-700 text-white',
      
      // Cards and containers
      card: 'bg-gray-800 border-gray-700',
      modal: 'bg-gray-900 border-gray-700',
    }
  },
  light: {
    name: 'Light Theme',
    colors: {
      // Main backgrounds
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
      quaternary: 'bg-gray-200',
      
      // Text colors
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      
      // Borders
      border: 'border-gray-300',
      borderLight: 'border-gray-200',
      borderAccent: 'border-orange-500/30',
      
      // Interactive elements
      hover: 'hover:bg-gray-100',
      active: 'bg-orange-500/10',
      
      // Form elements
      input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      select: 'bg-white border-gray-300 text-gray-900',
      
      // Cards and containers
      card: 'bg-white border-gray-300',
      modal: 'bg-white border-gray-300',
    }
  }
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  
  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('exrsim-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);
  
  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('exrsim-theme', currentTheme);
    // Update document class for global styling
    document.documentElement.className = currentTheme;
  }, [currentTheme]);
  
  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };
  
  const theme = themes[currentTheme];
  
  return (
    <ThemeContext.Provider value={{ currentTheme, theme, switchTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Validation functions
const validateLatitude = (lat) => {
  if (lat === '' || lat === null || lat === undefined) return true; // Allow empty for optional fields
  
  // Check for proper format: digits + optional decimal + up to 4 decimal places (no sign required)
  const formatRegex = /^-?\d+\.?\d{0,4}$/;
  if (!formatRegex.test(lat.toString())) return false;
  
  const num = parseFloat(lat);
  return !isNaN(num) && num >= -90.0000 && num <= 90.0000;
};

const validateLongitude = (lng) => {
  if (lng === '' || lng === null || lng === undefined) return true; // Allow empty for optional fields
  
  // Check for proper format: digits + optional decimal + up to 4 decimal places (no sign required)
  const formatRegex = /^-?\d+\.?\d{0,4}$/;
  if (!formatRegex.test(lng.toString())) return false;
  
  const num = parseFloat(lng);
  return !isNaN(num) && num >= -180.0000 && num <= 180.0000;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

const formatPhone = (input) => {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

const formatCoordinate = (input, type) => {
  // Remove any non-digit, non-decimal, non-minus characters
  const cleaned = input.replace(/[^0-9.-]/g, '');
  
  // Ensure only one decimal point and one minus sign at the beginning
  let formatted = cleaned;
  const decimalCount = (formatted.match(/\./g) || []).length;
  const minusCount = (formatted.match(/-/g) || []).length;
  
  if (decimalCount > 1) {
    const firstDecimalIndex = formatted.indexOf('.');
    formatted = formatted.substring(0, firstDecimalIndex + 1) + formatted.substring(firstDecimalIndex + 1).replace(/\./g, '');
  }
  
  if (minusCount > 1 || (minusCount === 1 && formatted.indexOf('-') !== 0)) {
    formatted = formatted.replace(/-/g, '');
    if (input.startsWith('-')) {
      formatted = '-' + formatted;
    }
  }
  
  return formatted;
};

// Navigation Component
// Theme Settings Component
const ThemeSettings = ({ onClose }) => {
  const { currentTheme, switchTheme, themes } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${themes[currentTheme].colors.modal} rounded-lg shadow-xl w-full max-w-md mx-4`}>
        <div className={`flex items-center justify-between p-6 ${themes[currentTheme].colors.borderAccent} border-b`}>
          <h2 className={`text-xl font-bold ${themes[currentTheme].colors.textPrimary}`}>Theme Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`${themes[currentTheme].colors.textMuted} hover:${themes[currentTheme].colors.textPrimary}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <Label className={`${themes[currentTheme].colors.textPrimary} text-sm font-medium mb-3 block`}>
              Select Theme
            </Label>
            <div className="space-y-2">
              {Object.entries(themes).map(([themeKey, themeConfig]) => (
                <button
                  key={themeKey}
                  onClick={() => switchTheme(themeKey)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    currentTheme === themeKey
                      ? 'border-orange-500 bg-orange-500/10'
                      : `${themes[currentTheme].colors.border} ${themes[currentTheme].colors.hover}`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      themeKey === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                    } border-2 ${themes[currentTheme].colors.border}`} />
                    <span className={themes[currentTheme].colors.textPrimary}>
                      {themeConfig.name}
                    </span>
                  </div>
                  {currentTheme === themeKey && (
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-600">
            <p className={`text-xs ${themes[currentTheme].colors.textMuted}`}>
              Theme settings are saved automatically and will persist across sessions.
            </p>
          </div>
        </div>
        
        <div className={`flex justify-end p-6 ${themes[currentTheme].colors.borderAccent} border-t`}>
          <Button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-black"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

// Financial Categories Manager Component (Placeholder)
const FinancialCategoriesManager = ({ onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.colors.modal} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center`}>
          <h2 className="text-2xl font-bold text-orange-500">Financial Categories Manager</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <DollarSign className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${theme.colors.textPrimary} mb-2`}>
              Financial Categories Management
            </h3>
            <p className={`${theme.colors.textMuted} mb-6`}>
              Manage financial categories for exercise budgeting and cost tracking.
            </p>
            <p className={`${theme.colors.textSecondary} text-sm`}>
              This feature will be implemented to manage exercise-related financial categories,
              cost centers, and budget allocation tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Acronyms Manager Component (Placeholder)
const AcronymsManager = ({ onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.colors.modal} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center`}>
          <h2 className="text-2xl font-bold text-orange-500">Acronyms Manager</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <BookText className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${theme.colors.textPrimary} mb-2`}>
              Acronyms & Terminology Management
            </h3>
            <p className={`${theme.colors.textMuted} mb-6`}>
              Manage emergency management acronyms and terminology definitions.
            </p>
            <p className={`${theme.colors.textSecondary} text-sm`}>
              This feature will be implemented to manage emergency management acronyms,
              terminology definitions, and standardized language for exercise documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Definitions Manager Component (Placeholder)
const DefinitionsManager = ({ onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.colors.modal} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center`}>
          <h2 className="text-2xl font-bold text-orange-500">Definitions Manager</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <BookOpen className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${theme.colors.textPrimary} mb-2`}>
              Definitions Management
            </h3>
            <p className={`${theme.colors.textMuted} mb-6`}>
              Manage exercise and emergency management definitions and glossary terms.
            </p>
            <p className={`${theme.colors.textSecondary} text-sm`}>
              This feature will be implemented to manage standardized definitions,
              glossary terms, and terminology used in exercise documentation and training materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quicklinks Manager Component (Placeholder)
const QuicklinksManager = ({ onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.colors.modal} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center`}>
          <h2 className="text-2xl font-bold text-orange-500">Quicklinks Manager</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <ExternalLink className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${theme.colors.textPrimary} mb-2`}>
              Quicklinks Management
            </h3>
            <p className={`${theme.colors.textMuted} mb-6`}>
              Manage quick access links to external resources and emergency management tools.
            </p>
            <p className={`${theme.colors.textSecondary} text-sm`}>
              This feature will be implemented to manage external links, resources,
              and tools frequently used during exercise planning and execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Position Manager Component (Placeholder)
const PositionManager = ({ onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.colors.modal} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center`}>
          <h2 className="text-2xl font-bold text-orange-500">Position Manager</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <UserCog className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${theme.colors.textPrimary} mb-2`}>
              Position Management
            </h3>
            <p className={`${theme.colors.textMuted} mb-6`}>
              Manage organizational positions, roles, and responsibilities for exercise participants.
            </p>
            <p className={`${theme.colors.textSecondary} text-sm`}>
              This feature will be implemented to manage standardized positions, job titles,
              and role definitions used in emergency response exercises and training scenarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Policies and Procedures Manager Component (Placeholder)
const PoliciesProceduresManager = ({ onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.colors.modal} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center`}>
          <h2 className="text-2xl font-bold text-orange-500">Policies and Procedures Manager</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <FileCheck className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${theme.colors.textPrimary} mb-2`}>
              Policies and Procedures Management
            </h3>
            <p className={`${theme.colors.textMuted} mb-6`}>
              Manage organizational policies, procedures, and standard operating procedures (SOPs).
            </p>
            <p className={`${theme.colors.textSecondary} text-sm`}>
              This feature will be implemented to manage policy documents, procedures,
              and SOPs that govern emergency response operations and exercise conduct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ICS Dashboard Component
const ICSDashboard = ({ currentExercise }) => {
  const { theme } = useTheme();
  const [activeICSMenu, setActiveICSMenu] = useState('mapping');
  const [operationsExpanded, setOperationsExpanded] = useState(false);
  const [planningExpanded, setPlanningExpanded] = useState(true);
  const [logisticsExpanded, setLogisticsExpanded] = useState(false);
  const [finAdminExpanded, setFinAdminExpanded] = useState(false);

  const icsMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'command-staff', label: 'Command Staff', icon: UserCog, backgroundColor: 'bg-red-900' },
    {
      id: 'operations',
      label: 'Operations',
      icon: Users,
      hasSubmenu: true,
      submenuItems: [
        { id: 'scenario', label: 'Scenario', icon: FileText },
        { id: 'incident-status', label: 'Incident Status', icon: AlertCircle },
        { id: 'objectives', label: 'Objectives', icon: Target },
        { id: 'safety', label: 'Safety', icon: Shield }
      ]
    },
    { 
      id: 'planning', 
      label: 'Planning', 
      icon: Calendar, 
      backgroundColor: 'bg-blue-500',
      hasSubmenu: true,
      submenuItems: [
        { id: 'mapping', label: 'Mapping', icon: Map, backgroundColor: 'bg-blue-500' },
        { id: 'situation-unit', label: 'Situation Unit', icon: Info, backgroundColor: 'bg-blue-500' },
        { id: 'documentation-unit', label: 'Documentation Unit', icon: FileText, backgroundColor: 'bg-blue-500' },
        { id: 'demobilization-unit', label: 'Demobilization Unit', icon: ArrowLeft, backgroundColor: 'bg-blue-500' }
      ]
    },
    { 
      id: 'logistics', 
      label: 'Logistics', 
      icon: Package, 
      backgroundColor: 'bg-yellow-500',
      hasSubmenu: true,
      submenuItems: [
        { id: 'services', label: 'Services', icon: Settings, backgroundColor: 'bg-yellow-500' },
        { id: 'support', label: 'Support', icon: Headphones, backgroundColor: 'bg-yellow-500' }
      ]
    },
    { 
      id: 'fin-admin', 
      label: 'Fin / Admin', 
      icon: DollarSign, 
      backgroundColor: 'bg-gray-500',
      hasSubmenu: true,
      submenuItems: [
        { id: 'time-unit', label: 'Time Unit', icon: Clock, backgroundColor: 'bg-gray-500' },
        { id: 'procurement-unit', label: 'Procurement Unit', icon: Package, backgroundColor: 'bg-gray-500' },
        { id: 'comp-claims-unit', label: 'Comp and Claims Unit', icon: FileCheck, backgroundColor: 'bg-gray-500' },
        { id: 'cost-unit', label: 'Cost Unit', icon: DollarSign, backgroundColor: 'bg-gray-500' }
      ]
    },
    { id: 'ics-2xx-forms', label: 'ICS 2XX Form Series', icon: FileCheck, backgroundColor: 'bg-green-500' }
  ];

  const renderICSContent = () => {
    console.log('renderICSContent called with activeICSMenu:', activeICSMenu);
    console.log('Available cases: dashboard, scenario, command-staff, operations, mapping, etc.');
    
    switch (activeICSMenu) {
      case 'dashboard':
        console.log('Dashboard case triggered');
        return <ICSDashboardOverview exerciseId={currentExercise?.id} />;
      case 'scenario':
        return <ScenarioManagement exerciseId={currentExercise?.id} />;
      case 'command-staff':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <UserCog className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Command Staff</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Command Staff module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'operations':
      case 'incident-status':
      case 'objectives':
      case 'safety':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Users className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>
                {icsMenuItems.find(item => item.id === activeICSMenu)?.label || 
                 icsMenuItems.find(item => item.submenuItems)?.submenuItems?.find(subItem => subItem.id === activeICSMenu)?.label}
              </h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                ICS module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'planning':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Calendar className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Planning</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Planning module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'logistics':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Package className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Logistics</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Logistics module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'fin-admin':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <DollarSign className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Fin / Admin</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Finance and Administration module content will be implemented here.
              </p>
            </div>
          </div>
        );
      // Planning submenu items
      case 'mapping':
        console.log('Mapping case triggered - rendering LeafletMapping with satellite view');
        return (
          <div className="h-full w-full">
            <LeafletMapping exerciseId={currentExercise?.id} />
          </div>
        );
      case 'situation-unit':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Info className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Situation Unit</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Situation Unit module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'documentation-unit':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <FileText className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Documentation Unit</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Documentation Unit module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'demobilization-unit':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <ArrowLeft className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Demobilization Unit</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Demobilization Unit module content will be implemented here.
              </p>
            </div>
          </div>
        );
      // Logistics submenu items
      case 'services':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Settings className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Services</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Services module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Headphones className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Support</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Support module content will be implemented here.
              </p>
            </div>
          </div>
        );
      // Fin/Admin submenu items
      case 'ics-2xx-forms':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <FileCheck className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>ICS 2XX Form Series</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                ICS 2XX Form Series module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'time-unit':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Clock className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Time Unit</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Time Unit module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'procurement-unit':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Package className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Procurement Unit</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Procurement Unit module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'comp-claims-unit':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <FileCheck className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Comp and Claims Unit</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Comp and Claims Unit module content will be implemented here.
              </p>
            </div>
          </div>
        );
      case 'cost-unit':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <DollarSign className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>Cost Unit</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Cost Unit module content will be implemented here.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Shield className={`h-16 w-16 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>ICS Dashboard</h2>
              <p className={`${theme.colors.textMuted} mb-6`}>
                Select a module from the sidebar to get started.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
        {/* ICS Sidebar */}
        <div className={`w-64 ${theme.colors.secondary} border-r ${theme.colors.border} h-screen sticky top-0`}>
          <div className="p-4">
            <h2 className={`text-lg font-semibold ${theme.colors.textPrimary} mb-4`}>
              Incident Command System
            </h2>
            <nav className="space-y-1">
              {icsMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeICSMenu === item.id;
                
                return (
                  <div key={item.id}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start text-left ${
                        item.id === 'operations' 
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : item.backgroundColor
                          ? `${item.backgroundColor} text-white hover:opacity-80`
                          : isActive
                            ? `${theme.colors.accent} ${theme.colors.textPrimary}`
                            : `${theme.colors.textSecondary} ${theme.colors.hover}`
                      }`}
                      onClick={() => {
                        setActiveICSMenu(item.id);
                        if (item.id === 'operations') {
                          setOperationsExpanded(!operationsExpanded);
                        }
                        if (item.id === 'planning' && item.hasSubmenu) {
                          setPlanningExpanded(!planningExpanded);
                        }
                        if (item.id === 'logistics' && item.hasSubmenu) {
                          setLogisticsExpanded(!logisticsExpanded);
                        }
                        if (item.id === 'fin-admin' && item.hasSubmenu) {
                          setFinAdminExpanded(!finAdminExpanded);
                        }
                      }}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <span className={item.id === 'operations' || item.backgroundColor ? 'text-white' : ''}>{item.label}</span>
                      {item.hasSubmenu && item.id === 'operations' && (
                        operationsExpanded ? (
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        ) : (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )
                      )}
                      {item.hasSubmenu && item.id === 'planning' && (
                        planningExpanded ? (
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        ) : (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )
                      )}
                      {item.hasSubmenu && item.id === 'logistics' && (
                        logisticsExpanded ? (
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        ) : (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )
                      )}
                      {item.hasSubmenu && item.id === 'fin-admin' && (
                        finAdminExpanded ? (
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        ) : (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )
                      )}
                    </Button>
                    
                    {/* Operations Submenu */}
                    {item.hasSubmenu && item.id === 'operations' && operationsExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenuItems?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activeICSMenu === subItem.id;
                          
                          return (
                            <Button
                              key={subItem.id}
                              variant="ghost"
                              className={`w-full justify-start text-left text-sm ${
                                isSubActive
                                  ? `${theme.colors.accent} ${theme.colors.textPrimary}`
                                  : `${theme.colors.textMuted} ${theme.colors.hover}`
                              }`}
                              onClick={() => setActiveICSMenu(subItem.id)}
                            >
                              <SubIcon className="h-4 w-4 mr-3" />
                              <span className="text-white">{subItem.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}

                    {/* Planning Submenu */}
                    {item.hasSubmenu && item.id === 'planning' && planningExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenuItems?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activeICSMenu === subItem.id;
                          
                          return (
                            <Button
                              key={subItem.id}
                              variant="ghost"
                              className={`w-full justify-start text-left text-sm ${
                                subItem.backgroundColor 
                                  ? `${subItem.backgroundColor} text-white hover:opacity-80`
                                  : isSubActive
                                    ? `${theme.colors.accent} ${theme.colors.textPrimary}`
                                    : `${theme.colors.textMuted} ${theme.colors.hover}`
                              }`}
                              onClick={() => setActiveICSMenu(subItem.id)}
                            >
                              <SubIcon className="h-4 w-4 mr-3" />
                              <span className="text-white">{subItem.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}

                    {/* Logistics Submenu */}
                    {item.hasSubmenu && item.id === 'logistics' && logisticsExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenuItems?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activeICSMenu === subItem.id;
                          
                          return (
                            <Button
                              key={subItem.id}
                              variant="ghost"
                              className={`w-full justify-start text-left text-sm ${
                                subItem.backgroundColor 
                                  ? `${subItem.backgroundColor} text-white hover:opacity-80`
                                  : isSubActive
                                    ? `${theme.colors.accent} ${theme.colors.textPrimary}`
                                    : `${theme.colors.textMuted} ${theme.colors.hover}`
                              }`}
                              onClick={() => setActiveICSMenu(subItem.id)}
                            >
                              <SubIcon className="h-4 w-4 mr-3" />
                              <span className="text-white">{subItem.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}

                    {/* Fin/Admin Submenu */}
                    {item.hasSubmenu && item.id === 'fin-admin' && finAdminExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenuItems?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activeICSMenu === subItem.id;
                          
                          return (
                            <Button
                              key={subItem.id}
                              variant="ghost"
                              className={`w-full justify-start text-left text-sm ${
                                subItem.backgroundColor 
                                  ? `${subItem.backgroundColor} text-white hover:opacity-80`
                                  : isSubActive
                                    ? `${theme.colors.accent} ${theme.colors.textPrimary}`
                                    : `${theme.colors.textMuted} ${theme.colors.hover}`
                              }`}
                              onClick={() => setActiveICSMenu(subItem.id)}
                            >
                              <SubIcon className="h-4 w-4 mr-3" />
                              <span className="text-white">{subItem.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen">
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {renderICSContent()}
          </main>

          {/* Quick Actions Bar - Fixed at bottom */}
          <div className={`${theme.colors.secondary} border-t ${theme.colors.border} p-4 flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${theme.colors.textPrimary}`}>Quick Actions</h3>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  onClick={() => {
                    console.log('Quick Tools Mapping clicked - setting activeICSMenu to mapping');
                    setActiveICSMenu('mapping');
                  }}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Mapping
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                  onClick={() => {
                    // Implement scribe functionality
                    console.log('Scribe clicked from ICS');
                  }}
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Scribe
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

// Leaflet Mapping Component
const LeafletMapping = ({ exerciseId }) => {
  console.log('LeafletMapping component rendered with exerciseId:', exerciseId);
  const { theme } = useTheme();
  const [mapObjects, setMapObjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedObject, setSelectedObject] = useState(null);
  const [showObjectForm, setShowObjectForm] = useState(false);
  const [editingObject, setEditingObject] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [drawingLayer, setDrawingLayer] = useState(null);
  
  // Form data for creating/editing map objects
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3388ff',
    image: '',
    type: 'marker' // Add object type to form data
  });

  useEffect(() => {
    if (exerciseId) {
      fetchMapObjects();
    }
    
    // Add CSS to ensure modals always stay on top
    const modalCSS = `
      .modal-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        z-index: 9999 !important;
        pointer-events: auto !important;
      }
      .modal-content {
        position: relative !important;
        z-index: 10000 !important;
        pointer-events: auto !important;
        transform: translateZ(0) !important;
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalCSS;
    document.head.appendChild(styleSheet);
  }, [exerciseId]);

  const fetchMapObjects = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/map-objects?exercise_id=${exerciseId}`);
      if (response.ok) {
        const data = await response.json();
        setMapObjects(data);
      }
    } catch (error) {
      console.error('Error fetching map objects:', error);
    }
  };

  const handleObjectCreate = async (geoJsonData, objectType) => {
    const objectData = {
      exercise_id: exerciseId,
      type: objectType,
      name: formData.name || `New ${objectType}`,
      description: formData.description,
      color: formData.color,
      geometry: geoJsonData.geometry,
      image: formData.image
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/map-objects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objectData),
      });

      if (response.ok) {
        const newObject = await response.json();
        setMapObjects(prev => [...prev, newObject]);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating map object:', error);
    }
  };

  const handleObjectUpdate = async (objectId, updates) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/map-objects/${objectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedObject = await response.json();
        setMapObjects(prev => prev.map(obj => obj.id === objectId ? updatedObject : obj));
        setEditingObject(null);
        setShowObjectForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating map object:', error);
    }
  };

  const handleObjectDelete = async (objectId) => {
    if (window.confirm('Are you sure you want to delete this map object?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/map-objects/${objectId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMapObjects(prev => prev.filter(obj => obj.id !== objectId));
        }
      } catch (error) {
        console.error('Error deleting map object:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3388ff',
      image: '',
      type: 'marker' // Reset type to default
    });
    setShowObjectForm(false);
    setEditingObject(null);
  };

  const getObjectsByCategory = (category) => {
    if (category === 'all') return mapObjects;
    return mapObjects.filter(obj => obj.type === category);
  };

  const categories = [
    { id: 'all', label: 'All Objects', count: mapObjects.length },
    { id: 'marker', label: 'Markers', count: mapObjects.filter(obj => obj.type === 'marker').length },
    { id: 'line', label: 'Lines', count: mapObjects.filter(obj => obj.type === 'line').length },
    { id: 'polygon', label: 'Polygons', count: mapObjects.filter(obj => obj.type === 'polygon').length },
    { id: 'rectangle', label: 'Rectangles', count: mapObjects.filter(obj => obj.type === 'rectangle').length }
  ];

  // Drawing state and map reference
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null);
  const [isPlacingObject, setIsPlacingObject] = useState(false);
  const [pendingObjectData, setPendingObjectData] = useState(null);

  // Debug state exposure for map click handler
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.mapDebug = {
        isPlacingObject,
        pendingObjectData,
        createObject: (geoJSON, objectData) => {
          // Create the object with the form data
          handleObjectCreate(geoJSON, objectData.type);
          
          // Create and add layer to map immediately for visual feedback
          if (mapRef.current && drawnItemsRef.current) {
            const map = mapRef.current;
            const editableLayers = drawnItemsRef.current;
            
            let layer;
            const lat = geoJSON.geometry.coordinates[1];
            const lng = geoJSON.geometry.coordinates[0];
            
            if (objectData.type === 'marker') {
              layer = L.marker([lat, lng]);
            } else if (objectData.type === 'polygon' || objectData.type === 'rectangle') {
              const coords = geoJSON.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
              layer = L.polygon(coords, { 
                color: objectData.color, 
                fillColor: objectData.color, 
                fillOpacity: 0.3 
              });
            } else if (objectData.type === 'line') {
              const coords = geoJSON.geometry.coordinates.map(coord => [coord[1], coord[0]]);
              layer = L.polyline(coords, { 
                color: objectData.color, 
                weight: 4 
              });
            }
            
            if (layer) {
              editableLayers.addLayer(layer);
              
              // Add popup with object info
              const popupContent = `
                <div>
                  <strong>${objectData.name}</strong><br>
                  <small>${objectData.description || 'No description'}</small><br>
                  <em>Type: ${objectData.type}</em>
                </div>
              `;
              layer.bindPopup(popupContent).openPopup();
            }
          }
          
          // Reset placement mode
          setIsPlacingObject(false);
          setPendingObjectData(null);
        }
      };
    }
  }, [isPlacingObject, pendingObjectData, handleObjectCreate]);

  // Fix default marker icons for Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  // Initialize native Leaflet.draw when map is ready
  useEffect(() => {
    if (mapReady && mapRef.current) {
      const map = mapRef.current;
      
      console.log('🎯 Initializing native Leaflet.draw plugin...');
      
      // Ensure map is completely ready before adding draw controls
      const initializeDrawing = () => {
        try {
          console.log('📍 Map container check:', !!map.getContainer());
          console.log('📍 Map size check:', !!map._size);
          
          if (!map.getContainer() || !map._size) {
            console.log('⏳ Map not ready, retrying in 500ms...');
            setTimeout(initializeDrawing, 500);
            return;
          }

          // Create FeatureGroup to store drawn items
          const editableLayers = new L.FeatureGroup();
          map.addLayer(editableLayers);
          drawnItemsRef.current = editableLayers;
          
          console.log('✅ FeatureGroup added for drawn items');

          // Create Leaflet.Draw control
          const drawPluginOptions = {
            position: 'topleft',
            draw: {
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: '#e1e100',
                  message: '<strong>Drawing error:</strong> Shape edges cannot cross!'
                },
                shapeOptions: {
                  color: formData.color || '#3388ff'
                }
              },
              polyline: {
                shapeOptions: {
                  color: formData.color || '#3388ff',
                  weight: 4
                }
              },
              rectangle: {
                shapeOptions: {
                  color: formData.color || '#3388ff'
                }
              },
              circle: false, // Disable circle
              circlemarker: false, // Disable circle marker
              marker: true
            },
            edit: {
              featureGroup: editableLayers,
              remove: true
            }
          };

          const drawControl = new L.Control.Draw(drawPluginOptions);
          
          // Add the control to the map
          map.addControl(drawControl);
          console.log('🎉 Leaflet.Draw control successfully added!');

          // Force immediate styling
          setTimeout(() => {
            const drawContainer = document.querySelector('.leaflet-draw');
            if (drawContainer) {
              console.log('🎨 Applying enhanced styling to draw toolbar...');
              
              // Apply comprehensive styling
              const styles = `
                .leaflet-draw {
                  z-index: 1000 !important;
                  margin-top: 10px !important;
                }
                .leaflet-draw-toolbar {
                  display: flex !important;
                  flex-direction: column !important;
                  background: rgba(255,255,255,0.9) !important;
                  border-radius: 6px !important;
                  padding: 4px !important;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
                }
                .leaflet-draw-toolbar a {
                  display: block !important;
                  width: 36px !important;
                  height: 36px !important;
                  margin: 2px !important;
                  background-color: white !important;
                  border: 2px solid #3388ff !important;
                  border-radius: 4px !important;
                  text-decoration: none !important;
                  line-height: 32px !important;
                  text-align: center !important;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
                  transition: all 0.2s ease !important;
                }
                .leaflet-draw-toolbar a:hover {
                  background-color: #3388ff !important;
                  transform: scale(1.05) !important;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.4) !important;
                }
                .leaflet-draw-toolbar a.leaflet-draw-draw-polygon {
                  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><polygon points="2,2 18,2 18,18 2,18" fill="none" stroke="%23333" stroke-width="2"/></svg>') !important;
                  background-repeat: no-repeat !important;
                  background-position: center !important;
                }
              `;
              
              // Inject styles
              const existingStyle = document.getElementById('leaflet-draw-custom-styles');
              if (existingStyle) {
                existingStyle.remove();
              }
              
              const styleElement = document.createElement('style');
              styleElement.id = 'leaflet-draw-custom-styles';
              styleElement.textContent = styles;
              document.head.appendChild(styleElement);
              
              console.log('✨ Enhanced styling applied successfully!');
            } else {
              console.log('❌ Draw container not found for styling');
            }
          }, 100);

          // Map click handler for placing objects (using higher-level event)
          map.on('click', function(e) {
            console.log('🖱️ Map clicked at:', e.latlng);
            console.log('🔍 Debug - isPlacingObject:', window.mapDebug?.isPlacingObject);
            console.log('🔍 Debug - pendingObjectData:', window.mapDebug?.pendingObjectData);
            
            if (window.mapDebug?.isPlacingObject && window.mapDebug?.pendingObjectData) {
              console.log('🎯 Placing object:', window.mapDebug.pendingObjectData);
              
              const { lat, lng } = e.latlng;
              
              // Create GeoJSON based on object type
              let geoJSON;
              if (window.mapDebug.pendingObjectData.type === 'marker') {
                geoJSON = {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                  }
                };
              } else if (window.mapDebug.pendingObjectData.type === 'polygon') {
                // Create a small square polygon around the clicked point
                const offset = 0.01; // Small offset for polygon
                geoJSON = {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [lng - offset, lat - offset],
                      [lng + offset, lat - offset], 
                      [lng + offset, lat + offset],
                      [lng - offset, lat + offset],
                      [lng - offset, lat - offset]
                    ]]
                  }
                };
              } else if (window.mapDebug.pendingObjectData.type === 'line') {
                // Create a small line from the clicked point
                const offset = 0.005;
                geoJSON = {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [lng - offset, lat],
                      [lng + offset, lat]
                    ]
                  }
                };
              } else if (window.mapDebug.pendingObjectData.type === 'rectangle') {
                // Create a rectangle around the clicked point
                const offset = 0.008;
                geoJSON = {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [lng - offset, lat - offset],
                      [lng + offset, lat - offset],
                      [lng + offset, lat + offset], 
                      [lng - offset, lat + offset],
                      [lng - offset, lat - offset]
                    ]]
                  }
                };
              }
              
              // Trigger object creation
              window.mapDebug.createObject(geoJSON, window.mapDebug.pendingObjectData);
              
              console.log('✅ Object placed successfully!');
            }
          }, this);

          // Set up Leaflet.draw event handlers
          map.on(L.Draw.Event.CREATED, function (e) {
            const type = e.layerType;
            const layer = e.layer;
            
            console.log('🎯 New shape created via drawing tool:', type);
            
            // Add layer to the FeatureGroup
            editableLayers.addLayer(layer);
            
            // Convert to GeoJSON and save to backend
            const geoJSON = layer.toGeoJSON();
            const objectType = type === 'polyline' ? 'line' : type;
            
            console.log('💾 Saving drawn object to backend:', objectType);
            handleObjectCreate(geoJSON, objectType);
            
            // Add popup to layer
            const popupContent = `
              <div>
                <strong>${formData.name || `New ${objectType}`}</strong><br>
                <small>${formData.description || 'No description'}</small>
              </div>
            `;
            layer.bindPopup(popupContent);
          });

          map.on(L.Draw.Event.EDITED, function (e) {
            const layers = e.layers;
            console.log('📝 Shapes edited:', layers.getLayers().length);
            
            layers.eachLayer(function (layer) {
              const geoJSON = layer.toGeoJSON();
              console.log('Updated layer:', geoJSON);
            });
          });

          map.on(L.Draw.Event.DELETED, function (e) {
            const layers = e.layers;
            console.log('🗑️ Shapes deleted:', layers.getLayers().length);
            
            layers.eachLayer(function (layer) {
              console.log('Deleted layer:', layer);
            });
          });

          console.log('🎊 All draw event handlers registered successfully!');

        } catch (error) {
          console.error('💥 Error setting up Leaflet.draw:', error);
        }
      };

      // Start initialization after a short delay
      setTimeout(initializeDrawing, 200);
    }
  }, [mapReady, formData.color]);

  // Add global functions for popup buttons
  useEffect(() => {
    window.editObject = (objectId) => {
      const obj = mapObjects.find(o => o.id === objectId);
      if (obj) {
        setEditingObject(obj);
        setFormData({
          name: obj.name,
          description: obj.description,
          color: obj.color,
          image: obj.image || ''
        });
        setShowObjectForm(true);
      }
    };

    window.deleteObject = (objectId) => {
      handleObjectDelete(objectId);
    };

    return () => {
      delete window.editObject;
      delete window.deleteObject;
    };
  }, [mapObjects]);

  const MapContainerComponent = () => {
    return (
      <div className="h-full w-full">
        <LeafletMapContainer
          center={[39.8283, -98.5795]} // Center of USA
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          whenReady={(mapInstance) => {
            console.log('Map ready event fired');
            if (mapInstance && mapInstance.target && !mapReady) {
              mapRef.current = mapInstance.target;
              setMapReady(true);
              console.log('✅ Map initialized successfully');
            }
          }}
        >
          <LayersControl position="topright">
            {/* Base layers */}
            <LayersControl.BaseLayer name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            
            <LayersControl.BaseLayer name="Streets">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer checked name="Satellite">
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Topographic">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Grayscale">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
        </LeafletMapContainer>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for object management */}
      <div className={`w-80 ${theme.colors.secondary} border-r ${theme.colors.border} flex flex-col h-full`}>
        {/* Add button at top for visibility */}
        <div className="p-4 border-b border-gray-700 bg-blue-900">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🎯 Add Map Object button clicked - showObjectForm:', showObjectForm);
              resetForm();
              setShowObjectForm(true);
              console.log('🎯 setShowObjectForm(true) called');
            }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 flex items-center justify-center font-semibold shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Map Object
          </button>
          
          {/* Debug state */}
          <div className="mt-2 text-xs text-blue-200 text-center">
            Modal: {showObjectForm ? 'VISIBLE' : 'HIDDEN'}
          </div>
        </div>

        <div className="p-4 border-b border-gray-700">
          <h2 className={`text-lg font-semibold ${theme.colors.textPrimary} mb-4`}>Map Objects</h2>
          
          {/* Category filters */}
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  console.log('Category clicked:', category.id);
                  setSelectedCategory(category.id);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : `${theme.colors.textMuted} hover:bg-gray-700`
                }`}
              >
                <span>{category.label}</span>
                <span className="float-right bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Objects list */}
        <div className="flex-1 overflow-y-auto p-4">
          {getObjectsByCategory(selectedCategory).length === 0 ? (
            <div className="text-center py-8">
              <p className={`${theme.colors.textMuted} text-sm`}>
                No {selectedCategory === 'all' ? 'objects' : selectedCategory} found
              </p>
              <p className={`${theme.colors.textMuted} text-xs mt-2`}>
                Click "Add Map Object" above to create one
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {getObjectsByCategory(selectedCategory).map(obj => (
                <div
                  key={obj.id}
                  className={`p-3 rounded border ${theme.colors.border} cursor-pointer hover:bg-gray-700`}
                  onClick={() => setSelectedObject(obj)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded mr-2"
                        style={{ backgroundColor: obj.color }}
                      ></div>
                      <div>
                        <p className={`font-medium ${theme.colors.textPrimary} text-sm`}>{obj.name}</p>
                        <p className={`text-xs ${theme.colors.textMuted} capitalize`}>{obj.type}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingObject(obj);
                          setFormData({
                            name: obj.name,
                            description: obj.description,
                            color: obj.color,
                            image: obj.image || ''
                          });
                          setShowObjectForm(true);
                        }}
                        className="p-1 text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleObjectDelete(obj.id);
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  {obj.description && (
                    <p className={`text-xs ${theme.colors.textMuted} mt-1 line-clamp-2`}>
                      {obj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main map area */}
      <div className="flex-1 relative">
        <MapContainerComponent />
        
        {/* Drawing Tools Status */}
        <div className="absolute top-4 right-4 bg-white rounded shadow-lg p-3 border border-blue-300">
          <div className="text-center">
            {isPlacingObject ? (
              <>
                <p className="text-sm font-bold text-orange-600">📍 Click Map to Place Object</p>
                <p className="text-xs text-gray-600 mt-1">
                  Placing: {pendingObjectData?.name}<br/>
                  Type: {pendingObjectData?.type}
                </p>
                <button 
                  onClick={() => {
                    setIsPlacingObject(false);
                    setPendingObjectData(null);
                    setShowObjectForm(true);
                  }}
                  className="text-xs text-red-600 mt-1 underline"
                >
                  Cancel Placement
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-blue-700">🎯 Leaflet Draw Active</p>
                <p className="text-xs text-gray-600 mt-1">Drawing toolbar loading...<br/>Should appear below zoom (+/-)</p>
                {mapReady && (
                  <p className="text-xs text-green-600 mt-1">✅ Map Ready</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Object form modal - Always rendered for debugging */}
      {showObjectForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center modal-overlay"
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={(e) => {
            console.log('🎯 Modal overlay clicked');
            if (e.target === e.currentTarget) {
              console.log('🎯 Closing modal via overlay click');
              resetForm();
            }
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4 shadow-2xl border-2 border-blue-500 modal-content"
            style={{ 
              zIndex: 10000,
              position: 'relative',
              backgroundColor: 'white',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => {
              console.log('🎯 Modal content clicked');
              e.stopPropagation();
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingObject ? 'Edit Map Object' : 'Add Map Object'}
              </h3>
              <button
                onClick={resetForm}
                className="text-3xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 rounded border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter object name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Object Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 rounded border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="marker">📍 Marker (Point)</option>
                  <option value="line">📏 Line</option>
                  <option value="polygon">🔶 Polygon</option>
                  <option value="rectangle">⬜ Rectangle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 rounded border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-12 rounded border-2 border-gray-300 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image (Base64)</label>
                <textarea
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full p-3 rounded border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                  placeholder="Paste base64 image data (optional)"
                />
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      if (editingObject) {
                        console.log('Updating existing object:', editingObject.id);
                        handleObjectUpdate(editingObject.id, formData);
                      } else {
                        // Enable map clicking mode for placing new object
                        console.log('🎯 Enabling map click mode for object placement');
                        setPendingObjectData({
                          name: formData.name || 'New Object',
                          description: formData.description,
                          color: formData.color,
                          image: formData.image,
                          type: formData.type // Use the form data type directly
                        });
                        setIsPlacingObject(true);
                        setShowObjectForm(false); // Close modal
                        
                        // Show instruction
                        alert('Click on the map where you want to place the object!');
                      }
                    } catch (error) {
                      console.error('Error saving object:', error);
                      alert('Error saving object. Please check console for details.');
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {editingObject ? 'Update Object' : `Save & Click Map to Place ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}`}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resetForm();
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ICS Dashboard Overview Component
const ICSDashboardOverview = ({ exerciseId }) => {
  const { theme } = useTheme();
  const [scenarios, setScenarios] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [safetyOfficer, setSafetyOfficer] = useState(null);
  const [incidentStatus, setIncidentStatus] = useState({
    status: 'Active',
    priority: 'High',
    lastUpdate: new Date().toLocaleString(),
    activeIncidents: 0
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    scenarios: '',
    objectives: '',
    safety: '',
    incidentStatus: ''
  });

  useEffect(() => {
    if (exerciseId) {
      fetchAllData();
    }
  }, [exerciseId]);

  const fetchAllData = async () => {
    setLoading(true);
    setErrors({
      scenarios: '',
      objectives: '',
      safety: '',
      incidentStatus: ''
    });

    // Fetch scenarios
    try {
      const scenarioResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/scenarios?exercise_id=${exerciseId}`);
      if (scenarioResponse.ok) {
        const scenarioData = await scenarioResponse.json();
        setScenarios(scenarioData);
      } else {
        setErrors(prev => ({ ...prev, scenarios: 'Failed to load scenarios' }));
      }
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      setErrors(prev => ({ ...prev, scenarios: 'Error connecting to server' }));
    }

    // Fetch objectives
    try {
      const objectiveResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/exercise-objectives/${exerciseId}`);
      if (objectiveResponse.ok) {
        const objectiveData = await objectiveResponse.json();
        setObjectives(objectiveData);
      } else {
        setErrors(prev => ({ ...prev, objectives: 'Failed to load objectives' }));
      }
    } catch (error) {
      console.error('Error fetching objectives:', error);
      setErrors(prev => ({ ...prev, objectives: 'Error connecting to server' }));
    }

    // Fetch safety officer
    try {
      const safetyResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/safety-officer`);
      if (safetyResponse.ok) {
        const safetyData = await safetyResponse.json();
        setSafetyOfficer(safetyData);
      } else {
        setErrors(prev => ({ ...prev, safety: 'No safety officer assigned' }));
      }
    } catch (error) {
      console.error('Error fetching safety officer:', error);
      setErrors(prev => ({ ...prev, safety: 'Error connecting to server' }));
    }

    setLoading(false);
  };

  const getMostRecentScenario = () => {
    if (!scenarios || scenarios.length === 0) return null;
    
    return scenarios.reduce((latest, current) => {
      const latestDate = new Date(latest.created_at);
      const currentDate = new Date(current.created_at);
      return currentDate > latestDate ? current : latest;
    });
  };

  const getRecentObjectives = () => {
    if (!objectives || objectives.length === 0) return [];
    
    return objectives
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3); // Show top 3 recent objectives
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme.colors.primary} mx-auto mb-4`}></div>
          <p className={`${theme.colors.textMuted}`}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const recentScenario = getMostRecentScenario();
  const recentObjectives = getRecentObjectives();

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-6`}>ICS Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario Container */}
        <div className={`${theme.colors.secondary} rounded-lg p-6 border ${theme.colors.border}`}>
          <div className="flex items-center mb-4">
            <FileText className={`h-5 w-5 ${theme.colors.textPrimary} mr-2`} />
            <h3 className={`text-lg font-semibold ${theme.colors.textPrimary}`}>Scenario</h3>
          </div>
          
          {errors.scenarios ? (
            <div className="text-center py-4">
              <AlertCircle className={`h-8 w-8 ${theme.colors.textMuted} mx-auto mb-2`} />
              <p className={`text-sm ${theme.colors.textMuted}`}>{errors.scenarios}</p>
            </div>
          ) : recentScenario ? (
            <div className="space-y-3">
              <div>
                <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Name</p>
                <p className={`font-medium ${theme.colors.textPrimary}`}>{recentScenario.scenario_name}</p>
              </div>
              <div>
                <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Description</p>
                <p className={`text-sm ${theme.colors.textSecondary} line-clamp-2`}>
                  {recentScenario.description || 'No description available'}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Location</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>{recentScenario.location}</p>
              </div>
              <div>
                <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  recentScenario.status === 'Active' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {recentScenario.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <FileText className={`h-8 w-8 ${theme.colors.textMuted} mx-auto mb-2`} />
              <p className={`text-sm ${theme.colors.textMuted}`}>No scenarios available for this exercise</p>
            </div>
          )}
        </div>

        {/* Objectives Container */}
        <div className={`${theme.colors.secondary} rounded-lg p-6 border ${theme.colors.border}`}>
          <div className="flex items-center mb-4">
            <Target className={`h-5 w-5 ${theme.colors.textPrimary} mr-2`} />
            <h3 className={`text-lg font-semibold ${theme.colors.textPrimary}`}>Objectives</h3>
          </div>
          
          {errors.objectives ? (
            <div className="text-center py-4">
              <AlertCircle className={`h-8 w-8 ${theme.colors.textMuted} mx-auto mb-2`} />
              <p className={`text-sm ${theme.colors.textMuted}`}>{errors.objectives}</p>
            </div>
          ) : recentObjectives.length > 0 ? (
            <div className="space-y-3">
              {recentObjectives.map((objective, index) => (
                <div key={objective.id || index} className={`${theme.colors.tertiary} rounded p-3`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`font-medium ${theme.colors.textPrimary} text-sm`}>{objective.name}</p>
                      <p className={`text-xs ${theme.colors.textMuted} mt-1 line-clamp-1`}>
                        {objective.description}
                      </p>
                    </div>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      objective.achieved === 'Yes' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : objective.achieved === 'Partial'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {objective.achieved}
                    </span>
                  </div>
                </div>
              ))}
              {objectives.length > 3 && (
                <p className={`text-xs ${theme.colors.textMuted} text-center mt-2`}>
                  +{objectives.length - 3} more objectives
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Target className={`h-8 w-8 ${theme.colors.textMuted} mx-auto mb-2`} />
              <p className={`text-sm ${theme.colors.textMuted}`}>No objectives defined for this exercise</p>
            </div>
          )}
        </div>

        {/* Incident Status Container */}
        <div className={`${theme.colors.secondary} rounded-lg p-6 border ${theme.colors.border}`}>
          <div className="flex items-center mb-4">
            <AlertCircle className={`h-5 w-5 ${theme.colors.textPrimary} mr-2`} />
            <h3 className={`text-lg font-semibold ${theme.colors.textPrimary}`}>Incident Status</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Current Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                incidentStatus.status === 'Active' 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
                {incidentStatus.status}
              </span>
            </div>
            <div>
              <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Priority Level</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                incidentStatus.priority === 'High' 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : incidentStatus.priority === 'Medium'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {incidentStatus.priority}
              </span>
            </div>
            <div>
              <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Last Update</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>{incidentStatus.lastUpdate}</p>
            </div>
            <div>
              <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Active Incidents</p>
              <p className={`text-lg font-bold ${theme.colors.textPrimary}`}>
                {scenarios?.length || incidentStatus.activeIncidents}
              </p>
            </div>
          </div>
        </div>

        {/* Safety Container */}
        <div className={`${theme.colors.secondary} rounded-lg p-6 border ${theme.colors.border}`}>
          <div className="flex items-center mb-4">
            <Shield className={`h-5 w-5 ${theme.colors.textPrimary} mr-2`} />
            <h3 className={`text-lg font-semibold ${theme.colors.textPrimary}`}>Safety</h3>
          </div>
          
          {errors.safety ? (
            <div className="text-center py-4">
              <AlertCircle className={`h-8 w-8 ${theme.colors.textMuted} mx-auto mb-2`} />
              <p className={`text-sm ${theme.colors.textMuted}`}>{errors.safety}</p>
            </div>
          ) : safetyOfficer ? (
            <div className="space-y-3">
              <div>
                <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Safety Officer</p>
                <p className={`font-medium ${theme.colors.textPrimary}`}>
                  {safetyOfficer.firstName} {safetyOfficer.lastName}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Position</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>
                  {safetyOfficer.position || 'Safety Officer'}
                </p>
              </div>
              {safetyOfficer.phones && safetyOfficer.phones.length > 0 && (
                <div>
                  <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Contact</p>
                  <p className={`text-sm ${theme.colors.textSecondary}`}>
                    {safetyOfficer.phones[0]}
                  </p>
                </div>
              )}
              <div>
                <p className={`text-sm ${theme.colors.textMuted} mb-1`}>Status</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                  On Duty
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Shield className={`h-8 w-8 ${theme.colors.textMuted} mx-auto mb-2`} />
              <p className={`text-sm ${theme.colors.textMuted}`}>No safety officer assigned</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className={`text-xs ${theme.colors.textMuted}`}>
          Dashboard automatically refreshes data. Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// Scenario Management Component
const ScenarioManagement = ({ exerciseId }) => {
  const { theme } = useTheme();
  const [scenarios, setScenarios] = useState([]);
  const [editingScenario, setEditingScenario] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, [exerciseId]);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/scenarios?exercise_id=${exerciseId}`);
      if (response.ok) {
        const data = await response.json();
        setScenarios(data);
      }
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scenarioId) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/scenarios/${scenarioId}`, {
          method: 'DELETE'
        });
        fetchScenarios();
      } catch (error) {
        console.error('Error deleting scenario:', error);
      }
    }
  };

  const handlePrint = (scenario) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Scenario Report - ${scenario.scenario_name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #f97316; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #374151; }
            .value { margin-bottom: 10px; }
            .image { max-width: 100%; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>Emergency Scenario Report</h1>
          <div class="section">
            <div class="label">Scenario Name:</div>
            <div class="value">${scenario.scenario_name}</div>
          </div>
          <div class="section">
            <div class="label">Type:</div>
            <div class="value">${scenario.scenario_type}</div>
          </div>
          <div class="section">
            <div class="label">Severity Level:</div>
            <div class="value">${scenario.severity_level}</div>
          </div>
          <div class="section">
            <div class="label">Location:</div>
            <div class="value">${scenario.location}</div>
          </div>
          <div class="section">
            <div class="label">Description:</div>
            <div class="value">${scenario.description}</div>
          </div>
          <div class="section">
            <div class="label">Affected Population:</div>
            <div class="value">${scenario.affected_population || 'Not specified'}</div>
          </div>
          <div class="section">
            <div class="label">Resources Required:</div>
            <div class="value">${scenario.resources_required || 'Not specified'}</div>
          </div>
          <div class="section">
            <div class="label">Timeline:</div>
            <div class="value">${scenario.timeline || 'Not specified'}</div>
          </div>
          ${scenario.scenario_image ? `<div class="section">
            <div class="label">Scenario Image:</div>
            <img class="image" src="${scenario.scenario_image}" alt="Scenario Image" />
          </div>` : ''}
          <div class="section">
            <div class="label">Status:</div>
            <div class="value">${scenario.status}</div>
          </div>
          <div class="section">
            <div class="label">Created:</div>
            <div class="value">${new Date(scenario.created_at).toLocaleString()}</div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (showForm) {
    return (
      <ScenarioForm
        exerciseId={exerciseId}
        editingScenario={editingScenario}
        onBack={() => {
          setShowForm(false);
          setEditingScenario(null);
        }}
        onSave={() => {
          fetchScenarios();
          setShowForm(false);
          setEditingScenario(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme.colors.textPrimary}`}>Scenario Management</h1>
          <p className={`${theme.colors.textMuted} mt-1`}>
            Manage emergency exercise scenarios and situational parameters
          </p>
        </div>
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-black"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Scenario
        </Button>
      </div>

      {loading ? (
        <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
          <CardContent className="p-12 text-center">
            <div className={theme.colors.textMuted}>Loading scenarios...</div>
          </CardContent>
        </Card>
      ) : scenarios.length === 0 ? (
        <Card className={`${theme.colors.tertiary} ${theme.colors.border} border-dashed`}>
          <CardContent className="p-12 text-center">
            <AlertCircle className={`h-12 w-12 ${theme.colors.textMuted} mx-auto mb-4`} />
            <h3 className={`text-lg font-semibold ${theme.colors.textSecondary} mb-2`}>No Scenarios Yet</h3>
            <p className={`${theme.colors.textMuted} mb-4`}>Add emergency scenarios to define exercise parameters and conditions.</p>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Scenario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className={`${theme.colors.tertiary} ${theme.colors.border}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className={`${theme.colors.textPrimary} text-lg`}>
                      {scenario.scenario_name}
                    </CardTitle>
                    <CardDescription className={theme.colors.textMuted}>
                      {scenario.scenario_type} • 
                      <span 
                        className="ml-2 px-2 py-1 text-xs font-semibold rounded text-white"
                        style={{
                          backgroundColor: scenario.severity_level === 'Low' ? '#16a34a' :
                                         scenario.severity_level === 'Medium' ? '#eab308' :
                                         scenario.severity_level === 'High' ? '#ea580c' :
                                         scenario.severity_level === 'Critical' ? '#dc2626' : '#6b7280'
                        }}
                      >
                        {scenario.severity_level}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePrint(scenario)}
                      className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingScenario(scenario);
                        setShowForm(true);
                      }}
                      className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(scenario.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <p className={`text-sm ${theme.colors.textSecondary} leading-relaxed`}>
                      {scenario.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {scenario.scenario_image ? (
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
                        <img 
                          src={scenario.scenario_image} 
                          alt={`Scenario: ${scenario.scenario_name}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ) : (
                      <div className={`w-32 h-32 rounded-lg border-2 border-dashed ${theme.colors.border} flex items-center justify-center`}>
                        <div className="text-center">
                          <Camera className={`h-6 w-6 ${theme.colors.textMuted} mx-auto mb-1`} />
                          <p className={`text-xs ${theme.colors.textMuted}`}>No image</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={theme.colors.textMuted}>Location:</span>
                    <div className={`${theme.colors.textPrimary} font-medium`}>
                      {scenario.location}
                    </div>
                  </div>
                  <div>
                    <span className={theme.colors.textMuted}>Status:</span>
                    <div className={`${theme.colors.textPrimary} font-medium`}>
                      {scenario.status}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Scenario Form Component
const ScenarioForm = ({ exerciseId, editingScenario, onBack, onSave }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    scenario_name: '',
    scenario_type: '',
    severity_level: '',
    location: '',
    description: '',
    affected_population: '',
    resources_required: '',
    timeline: '',
    status: 'Active',
    scenario_image: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingScenario) {
      setFormData({
        scenario_name: editingScenario.scenario_name || '',
        scenario_type: editingScenario.scenario_type || '',
        severity_level: editingScenario.severity_level || '',
        location: editingScenario.location || '',
        description: editingScenario.description || '',
        affected_population: editingScenario.affected_population || '',
        resources_required: editingScenario.resources_required || '',
        timeline: editingScenario.timeline || '',
        status: editingScenario.status || 'Active',
        scenario_image: editingScenario.scenario_image || null
      });
      setImagePreview(editingScenario.scenario_image);
    }
  }, [editingScenario]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, scenario_image: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, scenario_image: imageData }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.scenario_name) newErrors.scenario_name = 'Scenario name is required';
    if (!formData.scenario_type) newErrors.scenario_type = 'Scenario type is required';
    if (!formData.severity_level) newErrors.severity_level = 'Severity level is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const scenarioData = {
        ...formData,
        exercise_id: exerciseId
      };

      const url = editingScenario 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/scenarios/${editingScenario.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/scenarios`;
      
      const method = editingScenario ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scenarioData)
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving scenario:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">
            {editingScenario ? 'Edit Scenario' : 'Create New Scenario'}
          </h1>
          <p className={theme.colors.textMuted}>
            Define emergency exercise scenario parameters and conditions
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scenarios
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className={`${theme.colors.secondary} ${theme.colors.border}`}>
          <CardHeader>
            <CardTitle className="text-orange-500">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scenario_name" className={theme.colors.textPrimary}>
                  Scenario Name *
                </Label>
                <Input
                  id="scenario_name"
                  type="text"
                  value={formData.scenario_name}
                  onChange={(e) => handleInputChange('scenario_name', e.target.value)}
                  placeholder="Multi-building fire emergency"
                  className={theme.colors.input}
                />
                {errors.scenario_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.scenario_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="scenario_type" className={theme.colors.textPrimary}>
                  Disaster Type *
                </Label>
                <select
                  id="scenario_type"
                  value={formData.scenario_type}
                  onChange={(e) => handleInputChange('scenario_type', e.target.value)}
                  className={`${theme.colors.input} w-full`}
                >
                  <option value="">Select disaster type</option>
                  <optgroup label="MANMADE DISASTERS" className="font-semibold text-orange-400">
                    <option value="Terrorism">Terrorism</option>
                    <option value="Cyber Attack">Cyber Attack</option>
                    <option value="Industrial Accident">Industrial Accident</option>
                    <option value="Chemical Spill">Chemical Spill</option>
                    <option value="Nuclear Accident">Nuclear Accident</option>
                    <option value="Transportation Accident">Transportation Accident</option>
                    <option value="Building Collapse">Building Collapse</option>
                    <option value="Fire (Structural)">Fire (Structural)</option>
                    <option value="Explosion">Explosion</option>
                    <option value="Hazardous Material Release">Hazardous Material Release</option>
                    <option value="Infrastructure Failure">Infrastructure Failure</option>
                    <option value="Mass Shooting">Mass Shooting</option>
                    <option value="Civil Unrest">Civil Unrest</option>
                    <option value="Supply Chain Disruption">Supply Chain Disruption</option>
                    <option value="Economic Crisis">Economic Crisis</option>
                    <option value="Pandemic (Human-caused)">Pandemic (Human-caused)</option>
                  </optgroup>
                  <optgroup label="NATURAL DISASTERS" className="font-semibold text-green-400">
                    <option value="Earthquake">Earthquake</option>
                    <option value="Flood">Flood</option>
                    <option value="Hurricane/Typhoon">Hurricane/Typhoon</option>
                    <option value="Tornado">Tornado</option>
                    <option value="Wildfire">Wildfire</option>
                    <option value="Drought">Drought</option>
                    <option value="Blizzard/Ice Storm">Blizzard/Ice Storm</option>
                    <option value="Heatwave">Heatwave</option>
                    <option value="Thunderstorm/Hail">Thunderstorm/Hail</option>
                    <option value="Landslide">Landslide</option>
                    <option value="Tsunami">Tsunami</option>
                    <option value="Volcanic Eruption">Volcanic Eruption</option>
                    <option value="Pandemic (Natural)">Pandemic (Natural)</option>
                    <option value="Disease Outbreak">Disease Outbreak</option>
                    <option value="Insect Infestation">Insect Infestation</option>
                    <option value="Extreme Cold">Extreme Cold</option>
                    <option value="Coastal Erosion">Coastal Erosion</option>
                    <option value="Sinkhole">Sinkhole</option>
                  </optgroup>
                </select>
                {errors.scenario_type && (
                  <p className="text-red-400 text-sm mt-1">{errors.scenario_type}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="severity_level" className={theme.colors.textPrimary}>
                  Severity Level *
                </Label>
                <select
                  id="severity_level"
                  value={formData.severity_level}
                  onChange={(e) => handleInputChange('severity_level', e.target.value)}
                  className={`${theme.colors.input} w-full`}
                  style={{
                    backgroundColor: formData.severity_level === 'Low' ? '#16a34a' :
                                   formData.severity_level === 'Medium' ? '#eab308' :
                                   formData.severity_level === 'High' ? '#ea580c' :
                                   formData.severity_level === 'Critical' ? '#dc2626' : '',
                    color: formData.severity_level ? 'white' : ''
                  }}
                >
                  <option value="">Select severity level</option>
                  <option value="Low" style={{ backgroundColor: '#16a34a', color: 'white' }}>Low</option>
                  <option value="Medium" style={{ backgroundColor: '#eab308', color: 'white' }}>Medium</option>
                  <option value="High" style={{ backgroundColor: '#ea580c', color: 'white' }}>High</option>
                  <option value="Critical" style={{ backgroundColor: '#dc2626', color: 'white' }}>Critical</option>
                </select>
                {errors.severity_level && (
                  <p className="text-red-400 text-sm mt-1">{errors.severity_level}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className={theme.colors.textPrimary}>
                  Location *
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Building A, 3rd Floor"
                  className={theme.colors.input}
                />
                {errors.location && (
                  <p className="text-red-400 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className={theme.colors.textPrimary}>
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the emergency scenario..."
                rows={4}
                className={theme.colors.input}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card className={`${theme.colors.secondary} ${theme.colors.border}`}>
          <CardHeader>
            <CardTitle className="text-orange-500">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="affected_population" className={theme.colors.textPrimary}>
                  Affected Population
                </Label>
                <Input
                  id="affected_population"
                  type="text"
                  value={formData.affected_population}
                  onChange={(e) => handleInputChange('affected_population', e.target.value)}
                  placeholder="Estimated number of people affected"
                  className={theme.colors.input}
                />
              </div>

              <div>
                <Label htmlFor="timeline" className={theme.colors.textPrimary}>
                  Timeline
                </Label>
                <Input
                  id="timeline"
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder="Expected duration or timeline"
                  className={theme.colors.input}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="resources_required" className={theme.colors.textPrimary}>
                Resources Required
              </Label>
              <Textarea
                id="resources_required"
                value={formData.resources_required}
                onChange={(e) => handleInputChange('resources_required', e.target.value)}
                placeholder="List of resources, personnel, and equipment needed..."
                rows={3}
                className={theme.colors.input}
              />
            </div>

            <div>
              <Label htmlFor="status" className={theme.colors.textPrimary}>
                Status
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`${theme.colors.input} w-full`}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Image */}
        <Card className={`${theme.colors.secondary} ${theme.colors.border}`}>
          <CardHeader>
            <CardTitle className="text-orange-500">Scenario Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className={`w-32 h-32 rounded-lg ${theme.colors.quaternary} border-2 border-dashed ${theme.colors.border} flex items-center justify-center overflow-hidden`}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Scenario" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Camera className={`h-8 w-8 ${theme.colors.textMuted} mx-auto mb-2`} />
                    <span className={`text-sm ${theme.colors.textMuted}`}>No image</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="scenario-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('scenario-image-upload').click()}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 mr-3"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <p className={`text-sm ${theme.colors.textMuted}`}>Upload from file or capture with camera</p>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, scenario_image: null }));
                    }}
                    className="text-red-400 hover:text-red-300 block"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className={`${theme.colors.textSecondary} border-gray-500`}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-black"
          >
            {editingScenario ? 'Update Scenario' : 'Create Scenario'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Navigation = ({ currentExercise = null, activeMenu = 'dashboard' }) => {
  const { theme } = useTheme();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showLocationManager, setShowLocationManager] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showFinancialCategories, setShowFinancialCategories] = useState(false);
  const [showAcronyms, setShowAcronyms] = useState(false);
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [showQuicklinks, setShowQuicklinks] = useState(false);
  const [showPositionManager, setShowPositionManager] = useState(false);
  const [showPoliciesProcedures, setShowPoliciesProcedures] = useState(false);

  return (
    <nav className={`${theme.colors.primary} border-b ${theme.colors.borderAccent} px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center group">
            {/* EXRSIM Logo Image */}
            <div className="flex items-center group-hover:scale-105 transition-transform">
              <img 
                src="https://customer-assets.emergentagent.com/job_crisis-trainer/artifacts/v9rilei7_EXRSIM_Small.jpg"
                alt="EXRSIM Emergency Training"
                className="h-12 w-auto object-contain"
              />
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            {currentExercise ? (
              <button
                className={`text-orange-500 hover:text-orange-400 transition-colors ${activeMenu === 'manage' ? 'font-bold' : 'font-medium'}`}
                onClick={() => window.location.href = `#manage?exercise=${currentExercise.id}`}
              >
                Exercise
              </button>
            ) : (
              <Link 
                to="/builder" 
                className={`text-orange-500 hover:text-orange-400 transition-colors ${activeMenu === 'builder' ? 'font-bold' : 'font-medium'}`}
              >
                Exercise
              </Link>
            )}
            {currentExercise && (
              <>
                {/* Arrow between buttons pointing to non-active button */}
                <div className="flex items-center">
                  {activeMenu === 'builder' ? (
                    <ChevronRight className="h-4 w-4 text-white" />
                  ) : activeMenu === 'ics' || activeMenu === 'manage' ? (
                    <ChevronLeft className="h-4 w-4 text-white" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-white" />
                  )}
                </div>
                <button
                  className={`text-orange-500 hover:text-orange-400 transition-colors cursor-pointer ${activeMenu === 'ics' ? 'font-bold' : 'font-medium'}`}
                  onClick={() => window.location.href = `#ics?exercise=${currentExercise.id}`}
                  title={currentExercise.exercise_name}
                >
                  ICS
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Settings dropdown menu */}
        <div className="relative">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
          
          {/* Dropdown Menu */}
          {showSettingsDropdown && (
            <div className={`absolute right-0 mt-2 w-60 ${theme.colors.tertiary} border ${theme.colors.border} rounded-md shadow-lg z-50`}>
              <div className="py-1">
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-400 transition-colors`}
                  onClick={() => {
                    setShowLocationManager(true);
                    setShowSettingsDropdown(false);
                  }}
                >
                  <MapPin className="h-4 w-4 mr-3" />
                  Manage Locations
                </button>
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-400 transition-colors`}
                  onClick={() => {
                    setShowFinancialCategories(true);
                    setShowSettingsDropdown(false);
                  }}
                >
                  <DollarSign className="h-4 w-4 mr-3" />
                  Financial Categories
                </button>
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-400 transition-colors`}
                  onClick={() => {
                    setShowAcronyms(true);
                    setShowSettingsDropdown(false);
                  }}
                >
                  <BookText className="h-4 w-4 mr-3" />
                  Acronyms
                </button>
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-400 transition-colors`}
                  onClick={() => {
                    setShowDefinitions(true);
                    setShowSettingsDropdown(false);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  Definitions
                </button>
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-400 transition-colors`}
                  onClick={() => {
                    setShowQuicklinks(true);
                    setShowSettingsDropdown(false);
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-3" />
                  Quicklinks
                </button>
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-400 transition-colors`}
                  onClick={() => {
                    setShowPositionManager(true);
                    setShowSettingsDropdown(false);
                  }}
                >
                  <UserCog className="h-4 w-4 mr-3" />
                  Position Manager
                </button>
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-400 transition-colors`}
                  onClick={() => {
                    setShowPoliciesProcedures(true);
                    setShowSettingsDropdown(false);
                  }}
                >
                  <FileCheck className="h-4 w-4 mr-3" />
                  Policies and Procedures
                </button>
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-400 transition-colors`}
                  onClick={() => {
                    setShowThemeSettings(true);
                    setShowSettingsDropdown(false);
                  }}
                >
                  <Palette className="h-4 w-4 mr-3" />
                  Theme Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Manager Modal */}
      {showLocationManager && (
        <LocationManager onClose={() => setShowLocationManager(false)} />
      )}

      {/* Financial Categories Modal */}
      {showFinancialCategories && (
        <FinancialCategoriesManager onClose={() => setShowFinancialCategories(false)} />
      )}

      {/* Acronyms Modal */}
      {showAcronyms && (
        <AcronymsManager onClose={() => setShowAcronyms(false)} />
      )}

      {/* Definitions Modal */}
      {showDefinitions && (
        <DefinitionsManager onClose={() => setShowDefinitions(false)} />
      )}

      {/* Quicklinks Modal */}
      {showQuicklinks && (
        <QuicklinksManager onClose={() => setShowQuicklinks(false)} />
      )}

      {/* Position Manager Modal */}
      {showPositionManager && (
        <PositionManager onClose={() => setShowPositionManager(false)} />
      )}

      {/* Policies and Procedures Modal */}
      {showPoliciesProcedures && (
        <PoliciesProceduresManager onClose={() => setShowPoliciesProcedures(false)} />
      )}

      {/* Theme Settings Modal */}
      {showThemeSettings && (
        <ThemeSettings onClose={() => setShowThemeSettings(false)} />
      )}
    </nav>
  );
};

// Location Manager Component
const LocationManager = ({ onClose }) => {
  const { theme } = useTheme();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    contact_person: '',
    contact_phone: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // If endpoint doesn't exist, start with empty array
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Location name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (formData.latitude && !validateLatitude(formData.latitude)) {
      errors.latitude = 'Please enter a valid latitude (-90.0000 to 90.0000)';
    }
    
    if (formData.longitude && !validateLongitude(formData.longitude)) {
      errors.longitude = 'Please enter a valid longitude (-180.0000 to 180.0000)';
    }
    
    if (formData.contact_phone && !validatePhone(formData.contact_phone)) {
      errors.contact_phone = 'Please enter phone in format 123-456-7890';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const locationData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (editingLocation) {
        const response = await axios.put(`${API}/locations/${editingLocation.id}`, locationData);
        setLocations(prev => prev.map(loc => loc.id === editingLocation.id ? response.data : loc));
      } else {
        const response = await axios.post(`${API}/locations`, locationData);
        setLocations(prev => [...prev, response.data]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error saving location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name || '',
      description: location.description || '',
      address: location.address || '',
      latitude: location.latitude?.toString() || '',
      longitude: location.longitude?.toString() || '',
      contact_person: location.contact_person || '',
      contact_phone: location.contact_phone || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await axios.delete(`${API}/locations/${locationId}`);
        setLocations(prev => prev.filter(loc => loc.id !== locationId));
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('Error deleting location. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      latitude: '',
      longitude: '',
      contact_person: '',
      contact_phone: ''
    });
    setEditingLocation(null);
    setShowAddForm(false);
    setValidationErrors({});
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, contact_phone: formatted }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.colors.modal} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center`}>
          <h2 className="text-2xl font-bold text-orange-500">Location Manager</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showAddForm ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400">Manage exercise locations like Command Post, Hospital, etc.</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-600 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : locations.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No Locations Yet</h3>
                  <p className="text-gray-500 mb-4">Add your first exercise location to get started.</p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Location
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {locations.map((location) => (
                    <Card key={location.id} className={`${theme.colors.tertiary} ${theme.colors.border}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${theme.colors.textPrimary} mb-2`}>{location.name}</h3>
                            <p className={`${theme.colors.textSecondary} mb-3`}>{location.description}</p>
                            
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${theme.colors.textMuted}`}>
                              {location.address && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-orange-500" />
                                  <span>{location.address}</span>
                                </div>
                              )}
                              
                              {location.contact_person && (
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-orange-500" />
                                  <span>{location.contact_person}</span>
                                </div>
                              )}
                              
                              {location.contact_phone && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-orange-500" />
                                  <span>{location.contact_phone}</span>
                                </div>
                              )}
                              
                              {location.latitude && location.longitude && (
                                <div className="flex items-center space-x-2">
                                  <Map className="h-4 w-4 text-orange-500" />
                                  <span>{location.latitude}, {location.longitude}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(location)}
                              className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(location.id)}
                              className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${theme.colors.textPrimary}`}>
                  {editingLocation ? 'Edit Location' : 'Add New Location'}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className={`${theme.colors.textMuted} hover:${theme.colors.textPrimary}`}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className={theme.colors.textSecondary}>Location Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={theme.colors.input}
                    placeholder="Command Post"
                    required
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contact_person" className={theme.colors.textSecondary}>Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                    className={theme.colors.input}
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className={theme.colors.textSecondary}>Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={theme.colors.input}
                  placeholder="Primary command and control center for emergency operations"
                  rows={3}
                  required
                />
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="text-gray-300">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="123 Emergency Way, City, Province"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="latitude" className="text-gray-300">Latitude</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="45.1234"
                  />
                  {validationErrors.latitude && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.latitude}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="longitude" className="text-gray-300">Longitude</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="-97.0000"
                  />
                  {validationErrors.longitude && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.longitude}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contact_phone" className="text-gray-300">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={handlePhoneChange}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="123-456-7890"
                  />
                  {validationErrors.contact_phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.contact_phone}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                >
                  {loading ? 'Saving...' : (editingLocation ? 'Update Location' : 'Add Location')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ onMenuSelect, activeMenu }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'exercises', label: 'Exercises', icon: Target },
    { id: 'msel', label: 'MSEL', icon: ClipboardList },
    { id: 'hira', label: 'HIRA', icon: AlertTriangle },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'resources', label: 'Resources', icon: Package },
    { id: 'builder', label: 'Exercise Builder', icon: BookOpen }
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-orange-500/20 h-screen">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h3 className="text-orange-500 font-semibold mb-4 text-sm uppercase tracking-wider">
            Emergency Management
          </h3>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuSelect(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeMenu === item.id
                    ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                    : 'text-gray-300 hover:text-orange-500 hover:bg-gray-800'
                }`}
                data-testid={`sidebar-${item.id}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Dashboard Component
// Time validation and formatting functions
const validateTimeFormat = (timeStr) => {
  if (!timeStr || timeStr.trim() === '') return true; // Allow empty for optional fields
  
  // Check format: H:MM AM/PM or HH:MM AM/PM
  const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
  return timeRegex.test(timeStr.trim());
};

const formatTimeInput = (timeStr) => {
  if (!timeStr || timeStr.trim() === '') return '';
  
  // Clean the input
  let cleaned = timeStr.trim().toUpperCase();
  
  // If no AM/PM specified and it looks like a time, try to add AM/PM
  if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
    const [hour, minute] = cleaned.split(':');
    const hourNum = parseInt(hour);
    
    // If hour is 0-11, assume AM. If 12-23, convert to PM. If just 12, assume PM
    if (hourNum === 0) {
      return `12:${minute} AM`;
    } else if (hourNum === 12) {
      return `12:${minute} PM`;
    } else if (hourNum < 12) {
      return `${hourNum}:${minute} AM`;
    } else if (hourNum < 24) {
      const hour12 = hourNum - 12;
      return `${hour12}:${minute} PM`;
    }
  }
  
  // If it already has AM/PM, validate and normalize format
  if (validateTimeFormat(cleaned)) {
    return cleaned;
  }
  
  return timeStr; // Return original if can't format
};

const timeStringToDisplay = (timeStr) => {
  if (!timeStr || timeStr === '') return '';
  return timeStr;
};

const displayTimeToApiFormat = (timeStr) => {
  if (!timeStr || timeStr.trim() === '') return '';
  return formatTimeInput(timeStr);
};
const Dashboard = () => {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${API}/exercise-builder`);
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Handle both time formats
    if (timeString && timeString.includes(':')) {
      return timeString;
    }
    return timeString || 'Not set';
  };

  const printDashboard = () => {
    const currentDateTime = new Date().toLocaleString();
    const printContent = `
      <html>
        <head>
          <title>Exercise Dashboard Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { border-bottom: 3px solid #f97316; margin-bottom: 30px; padding-bottom: 15px; }
            .section { margin-bottom: 25px; }
            .exercise-card { 
              border: 1px solid #ddd; 
              padding: 15px; 
              margin-bottom: 15px; 
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .exercise-title { font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #333; }
            .exercise-type { 
              background: #f97316; 
              color: white; 
              padding: 2px 8px; 
              border-radius: 4px; 
              font-size: 12px; 
              display: inline-block; 
              margin-bottom: 8px;
            }
            .exercise-description { color: #666; margin-bottom: 8px; }
            .exercise-details { font-size: 14px; color: #555; }
            .footer { 
              position: fixed; 
              bottom: 20px; 
              left: 20px; 
              right: 20px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              border-top: 1px solid #ddd; 
              padding-top: 10px; 
            }
            .summary-stats {
              display: flex;
              gap: 20px;
              margin-bottom: 20px;
              flex-wrap: wrap;
            }
            .stat-item {
              background: #f5f5f5;
              padding: 10px 15px;
              border-radius: 5px;
              text-align: center;
              min-width: 120px;
            }
            .stat-number { font-size: 24px; font-weight: bold; color: #f97316; }
            .stat-label { font-size: 12px; color: #666; }
            @media print { 
              @page { 
                margin: 20px 20px 80px 20px; 
                size: A4;
              }
              body { 
                margin: 0; 
                padding: 20px 20px 60px 20px; 
                font-size: 12px;
                line-height: 1.4;
              } 
              .no-print { display: none; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px;
                height: 40px;
                z-index: 999;
              }
              .report-item { 
                page-break-inside: avoid; 
                page-break-after: auto;
                margin-bottom: 20px;
              }
              .section-title { 
                page-break-after: avoid;
              }
              .assessment-grid { 
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Exercise Dashboard Summary</h1>
            <p>Complete overview of emergency training exercises</p>
          </div>

          <div class="section">
            <div class="summary-stats">
              <div class="stat-item">
                <div class="stat-number">${exercises.length}</div>
                <div class="stat-label">Total Exercises</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${exercises.filter(ex => ex.exercise_type === 'Full Scale Exercise').length}</div>
                <div class="stat-label">Full Scale</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${exercises.filter(ex => ex.exercise_type === 'Table Top').length}</div>
                <div class="stat-label">Table Top</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${exercises.filter(ex => ex.exercise_type === 'Functional').length}</div>
                <div class="stat-label">Functional</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Exercise Details</h2>
            ${exercises.length > 0 ? 
              exercises.map(exercise => `
                <div class="exercise-card">
                  <div class="exercise-title">${exercise.exercise_name || 'Untitled Exercise'}</div>
                  <div class="exercise-type">${exercise.exercise_type || 'N/A'}</div>
                  <div class="exercise-description">${exercise.exercise_description || 'No description available'}</div>
                  <div class="exercise-details">
                    <strong>Start Date:</strong> ${exercise.start_date || 'Not set'} | 
                    <strong>End Date:</strong> ${exercise.end_date || 'Not set'} | 
                    <strong>Location:</strong> ${exercise.location || 'Not specified'}
                  </div>
                  <div class="exercise-details">
                    <strong>Goals:</strong> ${exercise.goals?.length || 0} | 
                    <strong>Objectives:</strong> ${exercise.objectives?.length || 0} | 
                    <strong>Events:</strong> ${exercise.events?.length || 0} | 
                    <strong>Organizations:</strong> ${exercise.organizations?.length || 0}
                  </div>
                </div>
              `).join('') 
              : '<div class="exercise-card">No exercises created yet.</div>'
            }
          </div>

          <div class="footer">
            <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme.colors.textPrimary} mb-2`}>Exercise Dashboard</h1>
          <p className={theme.colors.textMuted}>Manage your emergency training exercises</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className={`${theme.colors.border} ${theme.colors.textSecondary} ${theme.colors.hover} hover:text-orange-500`}
            onClick={() => printDashboard()}
            title="Print Exercises Summary"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Summary
          </Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            onClick={() => window.location.href = '#builder'}
            data-testid="new-exercise-btn"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Exercise
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className={`${theme.colors.tertiary} ${theme.colors.border}`}>
              <CardHeader>
                <div className={`h-4 ${theme.colors.quaternary} rounded animate-pulse mb-2`}></div>
                <div className={`h-3 ${theme.colors.quaternary} rounded animate-pulse w-2/3`}></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`h-3 ${theme.colors.quaternary} rounded animate-pulse`}></div>
                  <div className={`h-3 ${theme.colors.quaternary} rounded animate-pulse w-3/4`}></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : exercises.length === 0 ? (
          <div className="col-span-full">
            <Card className={`${theme.colors.tertiary} ${theme.colors.border} border-dashed`}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className={`h-12 w-12 ${theme.colors.textMuted} mb-4`} />
                <h3 className={`text-lg font-semibold ${theme.colors.textSecondary} mb-2`}>No Exercises Yet</h3>
                <p className={`${theme.colors.textMuted} text-center mb-4`}>
                  Create your first emergency training exercise using the Exercise Builder.
                </p>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                  onClick={() => window.location.href = '#builder'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start Exercise Builder
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          exercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className={`${theme.colors.tertiary} ${theme.colors.border} hover:border-orange-500/50 transition-colors cursor-pointer`}
              data-testid={`exercise-card-${exercise.id}`}
              onClick={() => window.location.href = `#manage?exercise=${exercise.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className={`${theme.colors.textPrimary} text-lg mb-1`}>{exercise.exercise_name}</CardTitle>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {exercise.exercise_type}
                    </Badge>
                  </div>
                  {exercise.exercise_image && (
                    <div className={`w-12 h-12 rounded ${theme.colors.quaternary} overflow-hidden ml-3`}>
                      <img src={exercise.exercise_image} alt={exercise.exercise_name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <CardDescription className={`${theme.colors.textMuted} mt-2`}>
                  {exercise.exercise_description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`space-y-2 text-sm ${theme.colors.textMuted}`}>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{exercise.location || 'Location not set'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Start: {formatDate(exercise.start_date)} at {formatTime(exercise.start_time)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>End: {formatDate(exercise.end_date)} at {formatTime(exercise.end_time)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Participant Management Components
const ParticipantForm = ({ onBack, onSave, editingParticipant = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    assignedTo: '',
    address: '',
    city: '',
    provinceState: '',
    country: 'Canada',
    homePhone: '',
    cellPhone: '',
    email: '',
    latitude: '',
    longitude: '',
    involvedInExercise: false,
    profileImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  
  // Validation error states
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    homePhone: '',
    cellPhone: '',
    latitude: '',
    longitude: ''
  });

  const positions = [
    'Exercise Evaluator',
    'Exercise Director',
    'Exercise Observer',
    'Team Coordinator',
    'Team Planner',
    'Team Facilitator',
    'Team Evaluator',
    'Team Task',
    'Participant',
    'Staff Member',
    'Fire Chief',
    'Police Chief',
    'Fire Fighter',
    'Medical',
    'Supervisor',
    'Security',
    'Safety Officer',
    'Facilitator',
    'Umpire',
    'Scribe',
    'Assistant',
    'Exercise Controller',
    'Agency Representative',
    'Owner',
    'Actor',
    'VIP',
    'Media',
    'Visitor'
  ];

  // Default fallback locations if none are managed
  const defaultLocations = [
    'Command Post',
    'Hospital',
    'Fire Station',
    'Police Station',
    'Operations Center EOC',
    'Staging Area'
  ];

  // Dynamic assigned to options using managed locations + fallbacks
  const assignedToOptions = locations.length > 0 
    ? locations.map(location => location.name)
    : defaultLocations;

  const countries = [
    'Canada',
    'USA',
    'United Kingdom',
    '---',
    'Afghanistan',
    'Albania',
    'Algeria',
    'Argentina',
    'Australia',
    'Austria',
    'Bangladesh',
    'Belgium',
    'Brazil',
    'Bulgaria',
    'Chile',
    'China',
    'Colombia',
    'Czech Republic',
    'Denmark',
    'Egypt',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Japan',
    'Jordan',
    'Kenya',
    'South Korea',
    'Mexico',
    'Netherlands',
    'New Zealand',
    'Norway',
    'Pakistan',
    'Philippines',
    'Poland',
    'Portugal',
    'Romania',
    'Russia',
    'Saudi Arabia',
    'South Africa',
    'Spain',
    'Sweden',
    'Switzerland',
    'Thailand',
    'Turkey',
    'Ukraine',
    'Vietnam'
  ];

  // Validation helper functions
  const validateEmailField = (email) => {
    if (!email.trim()) return ''; // Field is not required
    if (!validateEmail(email)) {
      return 'Please enter a valid email address (e.g., stevenharrison@email.com)';
    }
    return '';
  };

  const validatePhoneField = (phone) => {
    if (!phone.trim()) return ''; // Field is not required
    if (!validatePhone(phone)) {
      return 'Please enter phone number in format 123-456-7890';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    
    // Real-time validation
    const error = validateEmailField(email);
    setValidationErrors(prev => ({ ...prev, email: error }));
  };

  const handleHomePhoneChange = (e) => {
    const phone = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, homePhone: phone }));
    
    // Real-time validation
    const error = validatePhoneField(phone);
    setValidationErrors(prev => ({ ...prev, homePhone: error }));
  };

  const handleCellPhoneChange = (e) => {
    const phone = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, cellPhone: phone }));
    
    // Real-time validation
    const error = validatePhoneField(phone);
    setValidationErrors(prev => ({ ...prev, cellPhone: error }));
  };

  // Validation helper functions for participant coordinates
  const validateParticipantLatitudeField = (lat) => {
    if (lat === '' || lat === null || lat === undefined) return ''; // Field is not required
    if (!validateLatitude(lat)) {
      return 'Please enter latitude in format 45.1234 (range: -90.0000 to 90.0000)';
    }
    return '';
  };

  const validateParticipantLongitudeField = (lng) => {
    if (lng === '' || lng === null || lng === undefined) return ''; // Field is not required
    if (!validateLongitude(lng)) {
      return 'Please enter longitude in format 97.0000 (range: -180.0000 to 180.0000)';
    }
    return '';
  };

  const handleParticipantLatitudeChange = (e) => {
    const lat = e.target.value;
    setFormData(prev => ({ ...prev, latitude: lat }));
    
    // Real-time validation
    const error = validateParticipantLatitudeField(lat);
    setValidationErrors(prev => ({ ...prev, latitude: error }));
  };

  const handleParticipantLongitudeChange = (e) => {
    const lng = e.target.value;
    setFormData(prev => ({ ...prev, longitude: lng }));
    
    // Real-time validation
    const error = validateParticipantLongitudeField(lng);
    setValidationErrors(prev => ({ ...prev, longitude: error }));
  };

  useEffect(() => {
    if (editingParticipant) {
      setFormData({
        firstName: editingParticipant.firstName || '',
        lastName: editingParticipant.lastName || '',
        position: editingParticipant.position || '',
        assignedTo: editingParticipant.assignedTo || '',
        address: editingParticipant.address || '',
        city: editingParticipant.city || '',
        provinceState: editingParticipant.provinceState || '',
        country: editingParticipant.country || 'Canada',
        homePhone: editingParticipant.homePhone || '',
        cellPhone: editingParticipant.cellPhone || '',
        email: editingParticipant.email || '',
        latitude: editingParticipant.latitude || '',
        longitude: editingParticipant.longitude || '',
        involvedInExercise: editingParticipant.involvedInExercise || false,
        profileImage: editingParticipant.profileImage || null
      });
      if (editingParticipant.profileImage) {
        setImagePreview(editingParticipant.profileImage);
      }
    }
  }, [editingParticipant]);

  // Fetch managed locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API}/locations`);
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        // If endpoint doesn't exist, start with empty array
        setLocations([]);
      }
    };
    
    fetchLocations();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, profileImage: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, profileImage: imageData }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const participantData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.cellPhone || formData.homePhone,
        address: formData.address, // Include the individual address field
        fullAddress: `${formData.address}, ${formData.city}, ${formData.provinceState}`, // Keep full address for compatibility
        organization: '', // Will be handled later
        role: formData.position.toLowerCase().replace(/\s+/g, '_'),
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        assignedTo: formData.assignedTo,
        city: formData.city,
        provinceState: formData.provinceState,
        country: formData.country,
        homePhone: formData.homePhone,
        cellPhone: formData.cellPhone,
        involvedInExercise: formData.involvedInExercise,
        profileImage: formData.profileImage
      };

      if (editingParticipant) {
        const response = await axios.put(`${API}/participants/${editingParticipant.id}`, participantData);
        onSave(response.data);
      } else {
        const response = await axios.post(`${API}/participants`, participantData);
        onSave(response.data);
      }
    } catch (error) {
      console.error('Error saving participant:', error);
      alert('Error saving participant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveStepDraft = async () => {
    setLoading(true);
    try {
      // Save current form data as draft
      const draftData = {
        ...formData,
        isDraft: true
      };
      
      // You could save this to localStorage or send to backend
      localStorage.setItem('participantDraft', JSON.stringify(draftData));
      console.log('Participant step saved as draft:', draftData);
      
      // Show success message
      alert('Step saved successfully!');
    } catch (error) {
      console.error('Error saving step:', error);
      alert('Error saving step. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-orange-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Participants
        </Button>
        <h1 className="text-3xl font-bold text-orange-500 mb-2">
          {editingParticipant ? 'Edit Participant' : 'Add New Participant'}
        </h1>
        <p className="text-gray-400">Enter participant information for emergency exercise training</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Profile Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload').click()}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 mr-3"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <p className="text-sm text-gray-400">Upload from file or capture with camera</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position" className="text-gray-300">Position *</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {positions.map((position) => (
                      <SelectItem key={position} value={position} className="text-white focus:bg-gray-600">
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assignedTo" className="text-gray-300">Assigned to</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select assignment" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {assignedToOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-white focus:bg-gray-600">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="stevenharrison@email.com"
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homePhone" className="text-gray-300">Home Phone</Label>
                <Input
                  id="homePhone"
                  type="tel"
                  value={formData.homePhone}
                  onChange={handleHomePhoneChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="123-456-7890"
                />
                {validationErrors.homePhone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.homePhone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cellPhone" className="text-gray-300">Cell Phone</Label>
                <Input
                  id="cellPhone"
                  type="tel"
                  value={formData.cellPhone}
                  onChange={handleCellPhoneChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="123-456-7890"
                />
                {validationErrors.cellPhone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.cellPhone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-gray-300">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-gray-300">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="provinceState" className="text-gray-300">Province/State</Label>
                <Input
                  id="provinceState"
                  value={formData.provinceState}
                  onChange={(e) => setFormData(prev => ({ ...prev, provinceState: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="AB, ON, CA, TX"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country" className="text-gray-300">Country</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                  {countries.map((country) => (
                    <SelectItem 
                      key={country} 
                      value={country} 
                      className="text-white focus:bg-gray-600"
                      disabled={country === '---'}
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-gray-300">Latitude</Label>
                <Input
                  id="latitude"
                  type="text"
                  value={formData.latitude}
                  onChange={handleParticipantLatitudeChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="45.1234"
                />
                {validationErrors.latitude && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.latitude}</p>
                )}
              </div>
              <div>
                <Label htmlFor="longitude" className="text-gray-300">Longitude</Label>
                <Input
                  id="longitude"
                  type="text"
                  value={formData.longitude}
                  onChange={handleParticipantLongitudeChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="97.0000"
                />
                {validationErrors.longitude && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.longitude}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="involvedInExercise"
                checked={formData.involvedInExercise}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, involvedInExercise: checked }))}
              />
              <Label htmlFor="involvedInExercise" className="text-gray-300">
                Participant is involved in the current exercise
              </Label>
            </div>
          </CardContent>
        </Card>
        
        {/* Save Step Button */}
        <div className="flex justify-end">
          <Button 
            onClick={saveStepDraft}
            disabled={loading}
            variant="outline"
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Step'}
          </Button>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingParticipant ? 'Update Participant' : 'Add Participant')}
          </Button>
        </div>
      </form>
    </div>
  );
};

const ParticipantsList = ({ onAddNew, onEdit }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'participating'

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${API}/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(participant => {
    if (filter === 'participating') {
      return participant.involvedInExercise === true;
    }
    return true; // 'all' - show all participants
  });

  // Print function for Participants
  const printParticipants = () => {
    const currentDateTime = new Date().toLocaleString();
    const printContent = `
      <html>
        <head>
          <title>Exercise Participants Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
            .participant-item { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
            .participant-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .participant-position { font-size: 14px; color: #666; margin-bottom: 8px; }
            .participant-contact { margin-bottom: 10px; color: #555; }
            .participant-organization { margin-bottom: 10px; color: #555; }
            .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
            .status-participating { background-color: #d4edda; color: #155724; }
            .status-not-participating { background-color: #f8f9fa; color: #6c757d; }
            .contact-info { display: flex; gap: 20px; margin-top: 10px; font-size: 14px; }
            .contact-box { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            .footer { 
              position: fixed; 
              bottom: 20px; 
              left: 20px; 
              right: 20px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              border-top: 1px solid #ddd; 
              padding-top: 10px; 
            }
            @media print { 
              @page { 
                margin: 20px 20px 80px 20px; 
                size: A4;
              }
              body { 
                margin: 0; 
                padding: 20px 20px 60px 20px; 
                font-size: 12px;
                line-height: 1.4;
              } 
              .no-print { display: none; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px;
                height: 40px;
                z-index: 999;
              }
              .report-item { 
                page-break-inside: avoid; 
                page-break-after: auto;
                margin-bottom: 20px;
              }
              .section-title { 
                page-break-after: avoid;
              }
              .assessment-grid { 
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Exercise Participants Summary</h1>
            <p>Filter: ${filter === 'all' ? 'All Participants' : 'Active Exercise Participants'}</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="participants-content">
            ${filteredParticipants.length > 0 ? 
              filteredParticipants.map((participant, index) => {
                return `
                  <div class="participant-item">
                    <div class="participant-name">${participant.name || 'Unnamed Participant'}</div>
                    <div class="participant-position">${participant.position || 'Position not specified'}</div>
                    <div class="participant-organization"><strong>Organization:</strong> ${participant.organization || 'N/A'}</div>
                    <div class="status-badge ${participant.involvedInExercise ? 'status-participating' : 'status-not-participating'}">
                      ${participant.involvedInExercise ? 'Active in Exercise' : 'Not Participating'}
                    </div>
                    <div class="contact-info">
                      <div class="contact-box">
                        <strong>Email:</strong> ${participant.email || 'N/A'}
                      </div>
                      <div class="contact-box">
                        <strong>Phone:</strong> ${participant.phone || 'N/A'}
                      </div>
                    </div>
                  </div>
                `;
              }).join('') 
              : '<p>No participants match the current filter criteria.</p>'
            }
          </div>
          <div class="footer">
            <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const deleteParticipant = async (participantId) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      try {
        await axios.delete(`${API}/participants/${participantId}`);
        setParticipants(prev => prev.filter(p => p.id !== participantId));
      } catch (error) {
        console.error('Error deleting participant:', error);
        alert('Error deleting participant. Please try again.');
      }
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Exercise Participants</h1>
          <p className="text-gray-400">Manage emergency exercise team members</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="participant-filter" className="text-gray-300 text-sm">
              Filter:
            </Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger 
                id="participant-filter"
                className="w-40 bg-gray-700 border-gray-600 text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white focus:bg-gray-600">
                  Show All ({participants.length})
                </SelectItem>
                <SelectItem value="participating" className="text-white focus:bg-gray-600">
                  Show Participating ({participants.filter(p => p.involvedInExercise).length})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            onClick={printParticipants}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Participants
          </Button>
          <Button 
            onClick={onAddNew}
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            data-testid="add-participant-btn"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        </div>
      </div>

      {/* Filter Status Indicator */}
      {!loading && participants.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>
              Showing {filteredParticipants.length} of {participants.length} participants
            </span>
            {filter === 'participating' && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Active Exercise Filter
              </Badge>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/4"></div>
                    <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredParticipants.length === 0 && filter === 'participating' ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Active Participants</h3>
            <p className="text-gray-500 text-center mb-4">
              No participants are currently marked as involved in the exercise.
            </p>
            <Button 
              onClick={() => setFilter('all')}
              variant="outline"
              className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
            >
              Show All Participants
            </Button>
          </CardContent>
        </Card>
      ) : filteredParticipants.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Participants Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Add emergency team members to start building your exercise roster.
            </p>
            <Button 
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Participant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredParticipants.map((participant) => (
            <Card 
              key={participant.id} 
              className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={participant.profileImage} alt={participant.name} />
                    <AvatarFallback className="bg-orange-500 text-black text-lg font-semibold">
                      {getInitials(participant.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {participant.name}
                      </h3>
                      {participant.involvedInExercise && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Active Exercise
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Target className="h-4 w-4 text-orange-500" />
                        <span>{participant.position || participant.role || 'No position'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Building className="h-4 w-4 text-orange-500" />
                        <span>{participant.assignedTo || 'Not assigned'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Mail className="h-4 w-4 text-orange-500" />
                        <span className="truncate">{participant.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Phone className="h-4 w-4 text-orange-500" />
                        <span>{participant.cellPhone || participant.phone || 'No phone'}</span>
                      </div>
                    </div>
                    
                    {/* Additional row for address */}
                    <div className="mt-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="truncate">
                          {participant.address || participant.city && participant.country ? 
                            `${participant.address || ''} ${participant.city}, ${participant.country}`.trim() : 
                            'No address'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(participant)}
                      className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteParticipant(participant.id)}
                      className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ParticipantsView = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingParticipant, setEditingParticipant] = useState(null);

  const handleAddNew = () => {
    setEditingParticipant(null);
    setView('add');
  };

  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingParticipant(null);
  };

  const handleSave = () => {
    setView('list');
    setEditingParticipant(null);
    // The list will automatically refresh via useEffect
  };

  if (view === 'add' || view === 'edit') {
    return (
      <ParticipantForm
        onBack={handleBack}
        onSave={handleSave}
        editingParticipant={editingParticipant}
      />
    );
  }

  return (
    <ParticipantsList
      onAddNew={handleAddNew}
      onEdit={handleEdit}
    />
  );
};

// Resources Management
const ResourcesView = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingResource, setEditingResource] = useState(null);

  const handleAddNew = () => {
    setEditingResource(null);
    setView('add');
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingResource(null);
  };

  const handleSave = () => {
    setView('list');
    setEditingResource(null);
    // The list will automatically refresh via useEffect
  };

  if (view === 'add' || view === 'edit') {
    return (
      <ResourceForm
        onBack={handleBack}
        onSave={handleSave}
        editingResource={editingResource}
      />
    );
  }

  return (
    <ResourcesList
      onAddNew={handleAddNew}
      onEdit={handleEdit}
    />
  );
};

// Resource Form Component
const ResourceForm = ({ onBack, onSave, editingResource }) => {
  const [formData, setFormData] = useState({
    resource_type: '',
    identification: '',
    description: '',
    quantity_available: 0,
    quantity_needed: 0,
    location: '',
    contact_person: '',
    contact_phone: '',
    resource_image: null,
    involved_in_exercise: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);

  // Resource type options
  const resourceTypes = [
    'Equipment - Vehicles',
    'Equipment - Generators',
    'Equipment - Communication',
    'Equipment - Medical',
    'Equipment - Search & Rescue',
    'Supplies - Food',
    'Supplies - Water',
    'Supplies - First Aid',
    'Supplies - Shelter',
    'Supplies - Fuel'
  ];

  // Assigned location options (same as Participants "Assigned to")
  // Default fallback locations if none are managed
  const defaultLocations = [
    'Command Post',
    'Hospital',
    'Fire Station',
    'Police Station',
    'Operations Center EOC',
    'Staging Area'
  ];

  // Dynamic assigned to options using managed locations + fallbacks
  const assignedToOptions = locations.length > 0 
    ? locations.map(location => location.name)
    : defaultLocations;

  useEffect(() => {
    if (editingResource) {
      setFormData({
        resource_type: editingResource.resource_type || '',
        identification: editingResource.identification || '',
        description: editingResource.description || '',
        quantity_available: editingResource.quantity_available || 0,
        quantity_needed: editingResource.quantity_needed || 0,
        location: editingResource.location || '',
        contact_person: editingResource.contact_person || '',
        contact_phone: editingResource.contact_phone || '',
        resource_image: editingResource.resource_image || null,
        involved_in_exercise: editingResource.involved_in_exercise || false
      });
      if (editingResource.resource_image) {
        setImagePreview(editingResource.resource_image);
      }
    }
  }, [editingResource]);

  // Fetch managed locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API}/locations`);
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        // If endpoint doesn't exist, start with empty array
        setLocations([]);
      }
    };
    
    fetchLocations();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.resource_type.trim()) {
      newErrors.resource_type = 'Resource type is required';
    }

    if (!formData.identification.trim()) {
      newErrors.identification = 'Resource identification is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.quantity_available < 0) {
      newErrors.quantity_available = 'Quantity available cannot be negative';
    }

    if (formData.quantity_needed < 0) {
      newErrors.quantity_needed = 'Quantity needed cannot be negative';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.contact_person.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }

    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Contact phone is required';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.contact_phone)) {
      newErrors.contact_phone = 'Phone must be in format: 123-456-7890';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, resource_image: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, resource_image: imageData }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const resourceData = {
        resource_type: formData.resource_type,
        identification: formData.identification,
        description: formData.description,
        quantity_available: parseInt(formData.quantity_available),
        quantity_needed: parseInt(formData.quantity_needed),
        location: formData.location,
        contact_person: formData.contact_person,
        contact_phone: formData.contact_phone,
        resource_image: formData.resource_image,
        involved_in_exercise: formData.involved_in_exercise
      };

      if (editingResource) {
        const response = await axios.put(`${API}/resources/${editingResource.id}`, resourceData);
      } else {
        const response = await axios.post(`${API}/resources`, resourceData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Phone number formatting
  const handlePhoneChange = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XXX-XXX-XXXX
    let formatted = digits;
    if (digits.length >= 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    
    handleInputChange('contact_phone', formatted);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h1>
          <p className="text-gray-400">
            {editingResource ? 'Update resource information' : 'Enter details for the new resource'}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resource Image Upload */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Resource Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Resource" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-center">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="resource-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('resource-image-upload').click()}
                        className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 mr-3"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCameraCapture}
                        className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Use Camera
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400">
                      Add a photo of the resource for easier identification
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resource Type & Identification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resource_type" className="text-white">
                  Resource Type *
                </Label>
                <Select
                  value={formData.resource_type}
                  onValueChange={(value) => handleInputChange('resource_type', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {resourceTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.resource_type && (
                  <p className="text-red-400 text-sm mt-1">{errors.resource_type}</p>
                )}
              </div>

              <div>
                <Label htmlFor="identification" className="text-white">
                  Resource ID/Name *
                </Label>
                <Input
                  id="identification"
                  type="text"
                  value={formData.identification}
                  onChange={(e) => handleInputChange('identification', e.target.value)}
                  placeholder="e.g., AMB-001, TRUCK-ALPHA, MEDKIT-123"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                {errors.identification && (
                  <p className="text-red-400 text-sm mt-1">{errors.identification}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-white">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the resource, its purpose, and unique features..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Quantities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity_available" className="text-white">
                  Quantity Available *
                </Label>
                <Input
                  id="quantity_available"
                  type="number"
                  min="0"
                  value={formData.quantity_available}
                  onChange={(e) => handleInputChange('quantity_available', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.quantity_available && (
                  <p className="text-red-400 text-sm mt-1">{errors.quantity_available}</p>
                )}
              </div>

              <div>
                <Label htmlFor="quantity_needed" className="text-white">
                  Quantity Needed for Exercise *
                </Label>
                <Input
                  id="quantity_needed"
                  type="number"
                  min="0"
                  value={formData.quantity_needed}
                  onChange={(e) => handleInputChange('quantity_needed', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.quantity_needed && (
                  <p className="text-red-400 text-sm mt-1">{errors.quantity_needed}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-white">
                Current/Assigned Location *
              </Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => handleInputChange('location', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {assignedToOptions.map((location) => (
                    <SelectItem key={location} value={location} className="text-white hover:bg-gray-700">
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-red-400 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person" className="text-white">
                  Contact Person *
                </Label>
                <Input
                  id="contact_person"
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  placeholder="Primary contact person name"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                {errors.contact_person && (
                  <p className="text-red-400 text-sm mt-1">{errors.contact_person}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_phone" className="text-white">
                  Contact Phone *
                </Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="123-456-7890"
                  maxLength="12"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                {errors.contact_phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.contact_phone}</p>
                )}
              </div>
            </div>

            {/* Exercise Involvement */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="involved_in_exercise"
                checked={formData.involved_in_exercise}
                onCheckedChange={(checked) => handleInputChange('involved_in_exercise', checked)}
                className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <Label htmlFor="involved_in_exercise" className="text-white text-sm">
                This resource is involved in the current exercise
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="text-gray-400 border-gray-600 hover:bg-gray-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
              >
                {loading ? 'Saving...' : (editingResource ? 'Update Resource' : 'Add Resource')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Resources List Component
const ResourcesList = ({ onAddNew, onEdit }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${API}/resources`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`${API}/resources/${resourceId}`);
        setResources(prev => prev.filter(r => r.id !== resourceId));
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const filteredResources = resources.filter(resource => {
    if (filter === 'equipment') return resource.resource_type.startsWith('Equipment');
    if (filter === 'supplies') return resource.resource_type.startsWith('Supplies');
    if (filter === 'insufficient') return resource.quantity_available < resource.quantity_needed;
    if (filter === 'involved') return resource.involved_in_exercise;
    return true; // 'all'
  });

  // Print function for Resources
  const printResources = () => {
    const currentDateTime = new Date().toLocaleString();
    const printContent = `
      <html>
        <head>
          <title>Resource Management Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
            .resource-item { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
            .resource-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .resource-type { font-size: 14px; color: #666; margin-bottom: 8px; }
            .resource-description { margin-bottom: 10px; color: #555; }
            .resource-quantities { display: flex; gap: 20px; margin-bottom: 10px; }
            .quantity-box { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            .location-contact { margin-top: 10px; font-size: 14px; color: #666; }
            .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
            .status-sufficient { background-color: #d4edda; color: #155724; }
            .status-insufficient { background-color: #fff3cd; color: #856404; }
            .status-unavailable { background-color: #f8d7da; color: #721c24; }
            .exercise-involved { background-color: #d1ecf1; color: #0c5460; margin-left: 10px; }
            .footer { 
              position: fixed; 
              bottom: 20px; 
              left: 20px; 
              right: 20px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              border-top: 1px solid #ddd; 
              padding-top: 10px; 
            }
            @media print { 
              @page { 
                margin: 20px 20px 80px 20px; 
                size: A4;
              }
              body { 
                margin: 0; 
                padding: 20px 20px 60px 20px; 
                font-size: 12px;
                line-height: 1.4;
              } 
              .no-print { display: none; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px;
                height: 40px;
                z-index: 999;
              }
              .report-item { 
                page-break-inside: avoid; 
                page-break-after: auto;
                margin-bottom: 20px;
              }
              .section-title { 
                page-break-after: avoid;
              }
              .assessment-grid { 
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Resource Management Summary</h1>
            <p>Filter: ${filter === 'all' ? 'All Resources' : filter.charAt(0).toUpperCase() + filter.slice(1)}</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="resources-content">
            ${filteredResources.length > 0 ? 
              filteredResources.map((resource, index) => {
                const status = resource.quantity_available >= resource.quantity_needed ? 'sufficient' :
                              resource.quantity_available === 0 ? 'unavailable' : 'insufficient';
                const statusText = status === 'sufficient' ? 'Sufficient' :
                                  status === 'unavailable' ? 'Unavailable' : 'Insufficient';
                
                return `
                  <div class="resource-item">
                    <div class="resource-title">${resource.identification}</div>
                    <div class="resource-type">${resource.resource_type}</div>
                    <div class="resource-description">${resource.description}</div>
                    <div class="status-badge status-${status}">
                      Status: ${statusText}
                    </div>
                    ${resource.involved_in_exercise ? '<span class="status-badge exercise-involved">Exercise Resource</span>' : ''}
                    <div class="resource-quantities">
                      <div class="quantity-box">
                        <strong>Available:</strong> ${resource.quantity_available}
                      </div>
                      <div class="quantity-box">
                        <strong>Needed:</strong> ${resource.quantity_needed}
                      </div>
                    </div>
                    <div class="location-contact">
                      <div><strong>Location:</strong> ${resource.location}</div>
                      <div><strong>Contact:</strong> ${resource.contact_person} (${resource.contact_phone})</div>
                    </div>
                  </div>
                `;
              }).join('') 
              : '<p>No resources match the current filter criteria.</p>'
            }
          </div>
          <div class="footer">
            <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getStatusBadge = (resource) => {
    if (resource.quantity_available >= resource.quantity_needed) {
      return <Badge variant="default" className="bg-green-600 text-white">Sufficient</Badge>;
    } else if (resource.quantity_available === 0) {
      return <Badge variant="destructive" className="bg-red-600 text-white">Unavailable</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-600 text-black">Insufficient</Badge>;
    }
  };

  const getResourceTypeCategory = (type) => {
    if (type.startsWith('Equipment')) return { icon: Settings, color: 'text-green-400' };
    if (type.startsWith('Supplies')) return { icon: Package, color: 'text-orange-400' };
    return { icon: Package, color: 'text-gray-400' };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Resource Management</h1>
          <p className="text-gray-400">Manage equipment and supplies for emergency exercises</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="resource-filter" className="text-gray-300 text-sm">
              Filter:
            </Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger 
                id="resource-filter"
                className="w-44 bg-gray-700 border-gray-600 text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white focus:bg-gray-600">
                  Show All ({resources.length})
                </SelectItem>
                <SelectItem value="equipment" className="text-white focus:bg-gray-600">
                  Equipment ({resources.filter(r => r.resource_type.startsWith('Equipment')).length})
                </SelectItem>
                <SelectItem value="supplies" className="text-white focus:bg-gray-600">
                  Supplies ({resources.filter(r => r.resource_type.startsWith('Supplies')).length})
                </SelectItem>
                <SelectItem value="insufficient" className="text-white focus:bg-gray-600">
                  Insufficient ({resources.filter(r => r.quantity_available < r.quantity_needed).length})
                </SelectItem>
                <SelectItem value="involved" className="text-white focus:bg-gray-600">
                  Involved ({resources.filter(r => r.involved_in_exercise).length})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            onClick={printResources}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Resources
          </Button>
          <Button 
            onClick={onAddNew}
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Filter Status Indicator */}
      {!loading && resources.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>
              Showing {filteredResources.length} of {resources.length} resources
            </span>
            {filter === 'involved' && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Exercise Resources Only
              </Badge>
            )}
            {filter === 'insufficient' && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                Insufficient Resources
              </Badge>
            )}
            {filter === 'equipment' && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Equipment Only
              </Badge>
            )}
            {filter === 'supplies' && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Supplies Only
              </Badge>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400">Loading resources...</div>
          </CardContent>
        </Card>
      ) : filteredResources.length === 0 && filter !== 'all' ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Resources Found</h3>
            <p className="text-gray-400 mb-6">
              No resources match the current filter criteria.
            </p>
            <Button 
              variant="outline"
              onClick={() => setFilter('all')}
              className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-black"
            >
              Show All Resources
            </Button>
          </CardContent>
        </Card>
      ) : filteredResources.length === 0 ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Resources Yet</h3>
            <p className="text-gray-400 mb-6">
              Get started by adding your first resource for emergency exercises.
            </p>
            <Button 
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Resource
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const { icon: TypeIcon, color } = getResourceTypeCategory(resource.resource_type);
              
              return (
                <Card key={resource.id} className="bg-gray-900 border-gray-700 hover:border-orange-500/50 transition-colors">
                  <CardContent className="p-6">
                    {/* Resource Image */}
                    {resource.resource_image && (
                      <div className="mb-4">
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-800">
                          <img 
                            src={resource.resource_image} 
                            alt={resource.identification}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className={`h-5 w-5 ${color}`} />
                        <Badge variant="outline" className="text-xs">
                          {resource.resource_type}
                        </Badge>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {getStatusBadge(resource)}
                        {resource.involved_in_exercise && (
                          <Badge variant="default" className="text-xs bg-green-600 text-white">
                            Exercise
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {resource.identification}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Available:</span>
                        <span className="text-white font-semibold">{resource.quantity_available}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Needed:</span>
                        <span className="text-white font-semibold">{resource.quantity_needed}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-gray-400 truncate">{resource.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-gray-400">{resource.contact_person}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(resource)}
                        className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-black"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Exercise List View (separate from Dashboard)
const ExerciseListView = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${API}/exercise-builder`);
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExercise = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await axios.delete(`${API}/exercise-builder/${exerciseId}`);
        setExercises(prev => prev.filter(e => e.id !== exerciseId));
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Error deleting exercise. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (timeString && timeString.includes(':')) {
      return timeString;
    }
    return timeString || 'Not set';
  };

  const getExerciseTypeColor = (type) => {
    const colors = {
      'Table Top': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Drill': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Functional': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Full Scale Exercise': 'bg-red-500/20 text-red-300 border-red-500/30',
      'No-Notice Exercise': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Real World Event': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  if (selectedExercise) {
    return (
      <ExerciseDetailView 
        exercise={selectedExercise} 
        onBack={() => setSelectedExercise(null)} 
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Exercise Management</h1>
          <p className="text-gray-400">Manage completed emergency training exercises</p>
        </div>
        <Button 
          onClick={() => window.location.href = '#builder'}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          data-testid="new-exercise-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Exercise
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3"></div>
                    <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Exercises Created Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Use the Exercise Builder to create your first emergency training exercise.
            </p>
            <Button 
              onClick={() => window.location.href = '#builder'}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Start Exercise Builder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              Showing {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
          {exercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors cursor-pointer"
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Exercise Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-600 overflow-hidden flex items-center justify-center">
                      {exercise.exercise_image ? (
                        <img 
                          src={exercise.exercise_image} 
                          alt={exercise.exercise_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Target className="h-8 w-8 text-orange-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {exercise.exercise_name}
                      </h3>
                      <Badge className={getExerciseTypeColor(exercise.exercise_type)}>
                        {exercise.exercise_type}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-400 mb-3 line-clamp-2">{exercise.exercise_description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="truncate">{exercise.location || 'Location not set'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <CalendarDays className="h-4 w-4 text-orange-500" />
                        <span>Start: {formatDate(exercise.start_date)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <CalendarDays className="h-4 w-4 text-orange-500" />
                        <span>End: {formatDate(exercise.end_date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>Created: {new Date(exercise.created_at).toLocaleDateString()}</span>
                      <span>Times: {formatTime(exercise.start_time)} - {formatTime(exercise.end_time)}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExercise(exercise);
                      }}
                      className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                    >
                      <Target className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteExercise(exercise.id);
                      }}
                      className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Exercise Detail View
const ExerciseDetailView = ({ exercise, onBack }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-orange-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exercise List
        </Button>
        <div className="flex items-start space-x-6">
          {exercise.exercise_image && (
            <div className="w-32 h-32 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
              <img 
                src={exercise.exercise_image} 
                alt={exercise.exercise_name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-orange-500 mb-2">{exercise.exercise_name}</h1>
            <div className="flex items-center space-x-3 mb-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-base px-3 py-1">
                {exercise.exercise_type}
              </Badge>
            </div>
            <p className="text-gray-300 text-lg">{exercise.exercise_description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-gray-400 text-sm">Location</Label>
              <p className="text-white">{exercise.location || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Start</Label>
              <p className="text-white">
                {new Date(exercise.start_date).toLocaleDateString()} at {exercise.start_time || 'TBD'}
              </p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">End</Label>
              <p className="text-white">
                {new Date(exercise.end_date).toLocaleDateString()} at {exercise.end_time || 'TBD'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scope */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Exercise Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-gray-400 text-sm">Hazards</Label>
              <p className="text-white text-sm">{exercise.scope_hazards || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Geographic Area</Label>
              <p className="text-white text-sm">{exercise.scope_geographic_area || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-gray-400 text-sm">Functions</Label>
              <p className="text-white text-sm">{exercise.scope_functions || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Purpose */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Exercise Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">{exercise.purpose_description || 'Not specified'}</p>
          </CardContent>
        </Card>

        {/* Scenario */}
        {(exercise.scenario_name || exercise.scenario_description) && (
          <Card className="bg-gray-800 border-gray-700 col-span-full">
            <CardHeader>
              <CardTitle className="text-orange-500">Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                {exercise.scenario_image && (
                  <div className="w-24 h-24 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                    <img 
                      src={exercise.scenario_image} 
                      alt={exercise.scenario_name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{exercise.scenario_name}</h3>
                  <p className="text-gray-300">{exercise.scenario_description}</p>
                  {(exercise.scenario_latitude || exercise.scenario_longitude) && (
                    <p className="text-gray-400 text-sm mt-2">
                      Coordinates: {exercise.scenario_latitude}, {exercise.scenario_longitude}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Button
          variant="outline"
          className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          onClick={() => window.location.href = `#builder?exercise=${exercise.id}`}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Exercise
        </Button>
        <Button
          variant="outline"
          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          View MSEL
        </Button>
      </div>
    </div>
  );
};

const ExerciseView = () => {
  return <ExerciseListView />;
};

// MSEL Management Components
const MSELForm = ({ onBack, onSave, editingEvent = null }) => {
  const [formData, setFormData] = useState({
    exercise_id: '',
    event_number: 1,
    scenario_time: '',
    event_type: '',
    inject_mode: '',
    from_entity: '',
    to_entity: '',
    message: '',
    expected_response: '',
    objective_capability_task: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const eventTypes = [
    'Player Inject',
    'Media Inject',
    'Discussion Question',
    'Information Update',
    'Decision Point',
    'Time Advance',
    'Scenario Development',
    'Resource Request',
    'Communication Test',
    'Evaluation Checkpoint'
  ];

  const injectModes = [
    'Phone Call',
    'Radio Communication',
    'Email/Message',
    'Face-to-Face',
    'Written Document',
    'Media Broadcast',
    'Social Media',
    'Emergency Alert System',
    'Controller Briefing',
    'Automated System'
  ];

  const controllerRoles = [
    'Exercise Controller',
    'Lead Controller',
    'Safety Officer',
    'Evaluator',
    'SIMCELL Controller',
    'Communications Controller',
    'Media Controller',
    'Logistics Controller',
    'Technical Controller',
    'Observer Controller'
  ];

  const playerRoles = [
    'Incident Commander',
    'Operations Section',
    'Planning Section',
    'Logistics Section',
    'Finance/Administration Section',
    'Safety Officer',
    'Public Information Officer',
    'Liaison Officer',
    'All Players',
    'Emergency Operations Center',
    'Field Teams',
    'Media Representatives'
  ];

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        exercise_id: editingEvent.exercise_id || '',
        event_number: editingEvent.event_number || 1,
        scenario_time: editingEvent.scenario_time || '',
        event_type: editingEvent.event_type || '',
        inject_mode: editingEvent.inject_mode || '',
        from_entity: editingEvent.from_entity || '',
        to_entity: editingEvent.to_entity || '',
        message: editingEvent.message || '',
        expected_response: editingEvent.expected_response || '',
        objective_capability_task: editingEvent.objective_capability_task || '',
        notes: editingEvent.notes || ''
      });
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingEvent) {
        await axios.put(`${API}/msel/event/${editingEvent.id}`, formData);
      } else {
        await axios.post(`${API}/msel`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving MSEL event:', error);
      alert('Error saving MSEL event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-orange-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MSEL List
        </Button>
        <h1 className="text-3xl font-bold text-orange-500 mb-2">
          {editingEvent ? 'Edit MSEL Event' : 'Add New MSEL Event'}
        </h1>
        <p className="text-gray-400">Master Sequence Event List - Exercise event planning and tracking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Identification */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Event Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_number" className="text-gray-300">Event Number *</Label>
                <Input
                  id="event_number"
                  type="number"
                  min="1"
                  value={formData.event_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_number: parseInt(e.target.value) || 1 }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="scenario_time" className="text-gray-300">Designated Scenario Time *</Label>
                <Input
                  id="scenario_time"
                  value={formData.scenario_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, scenario_time: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., 09:30, T+15 minutes, Day 1 - 14:00"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="exercise_id" className="text-gray-300">Exercise ID (Optional)</Label>
              <Input
                id="exercise_id"
                value={formData.exercise_id}
                onChange={(e) => setFormData(prev => ({ ...prev, exercise_id: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Link to specific exercise"
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Classification */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Event Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event_type" className="text-gray-300">Event Type *</Label>
              <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white focus:bg-gray-600">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="inject_mode" className="text-gray-300">Inject Mode *</Label>
              <Select value={formData.inject_mode} onValueChange={(value) => setFormData(prev => ({ ...prev, inject_mode: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select inject mode" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {injectModes.map((mode) => (
                    <SelectItem key={mode} value={mode} className="text-white focus:bg-gray-600">
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Communication Details */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Communication Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="from_entity" className="text-gray-300">From (Controller/Entity) *</Label>
              <Select value={formData.from_entity} onValueChange={(value) => setFormData(prev => ({ ...prev, from_entity: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select controller role or type custom" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {controllerRoles.map((role) => (
                    <SelectItem key={role} value={role} className="text-white focus:bg-gray-600">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={formData.from_entity}
                onChange={(e) => setFormData(prev => ({ ...prev, from_entity: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white mt-2"
                placeholder="Or type custom controller/entity name"
              />
            </div>

            <div>
              <Label htmlFor="to_entity" className="text-gray-300">To (Player/Group) *</Label>
              <Select value={formData.to_entity} onValueChange={(value) => setFormData(prev => ({ ...prev, to_entity: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select player role or type custom" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {playerRoles.map((role) => (
                    <SelectItem key={role} value={role} className="text-white focus:bg-gray-600">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={formData.to_entity}
                onChange={(e) => setFormData(prev => ({ ...prev, to_entity: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white mt-2"
                placeholder="Or type custom player/group name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Content */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Event Content & Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-gray-300">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={4}
                placeholder="The core content of the inject - information, request, or call to action"
                required
              />
            </div>

            <div>
              <Label htmlFor="expected_response" className="text-gray-300">Expected Participant Response *</Label>
              <Textarea
                id="expected_response"
                value={formData.expected_response}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_response: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="The anticipated action or reaction from the player"
                required
              />
            </div>

            <div>
              <Label htmlFor="objective_capability_task" className="text-gray-300">Objective, Capability, and/or Critical Task *</Label>
              <Textarea
                id="objective_capability_task"
                value={formData.objective_capability_task}
                onChange={(e) => setFormData(prev => ({ ...prev, objective_capability_task: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="The specific exercise objective or critical task this event tests"
                required
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-300">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={2}
                placeholder="Additional controller information or details"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            disabled={loading}
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingEvent ? 'Update Event' : 'Save Event'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const MSELList = ({ onAddNew, onEdit }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/msel`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching MSEL events:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this MSEL event?')) {
      try {
        await axios.delete(`${API}/msel/event/${eventId}`);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } catch (error) {
        console.error('Error deleting MSEL event:', error);
        alert('Error deleting MSEL event. Please try again.');
      }
    }
  };

  const toggleCompletion = async (event) => {
    try {
      const updatedEvent = {
        ...event,
        completed: !event.completed,
        actual_time: !event.completed ? new Date().toLocaleTimeString() : null
      };
      await axios.put(`${API}/msel/event/${event.id}`, updatedEvent);
      setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
    } catch (error) {
      console.error('Error updating event completion:', error);
    }
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      'Player Inject': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Media Inject': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Discussion Question': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Information Update': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Decision Point': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[eventType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  // Sort events by event number
  const sortedEvents = [...events].sort((a, b) => a.event_number - b.event_number);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">MSEL - Master Sequence Event List</h1>
          <p className="text-gray-400">Manage exercise event timeline and inject sequences</p>
        </div>
        <Button 
          onClick={onAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          data-testid="add-msel-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add MSEL Event
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-1/4"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No MSEL Events Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Start planning your exercise by creating sequence events and inject timelines.
            </p>
            <Button 
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First MSEL Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              Showing {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''} (sorted by event number)
            </p>
          </div>
          {sortedEvents.map((event) => (
            <Card key={event.id} className={`bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors ${event.completed ? 'opacity-75' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Event Number Badge */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      event.completed ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'
                    }`}>
                      #{event.event_number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">Event #{event.event_number}</h3>
                      <Badge className={getEventTypeColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                      <Badge className="bg-gray-600/20 text-gray-300 border-gray-600/30">
                        {event.inject_mode}
                      </Badge>
                      {event.completed && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Completed
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-orange-400 font-medium text-sm">Scenario Time:</span>
                        <span className="text-gray-300 ml-2">{event.scenario_time}</span>
                      </div>
                      <div>
                        <span className="text-blue-400 font-medium text-sm">From → To:</span>
                        <span className="text-gray-300 ml-2">{event.from_entity} → {event.to_entity}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-green-400 font-medium text-sm">Message:</span>
                      <p className="text-gray-300 text-sm mt-1">{event.message}</p>
                    </div>

                    <div className="mb-3">
                      <span className="text-purple-400 font-medium text-sm">Expected Response:</span>
                      <p className="text-gray-300 text-sm mt-1">{event.expected_response}</p>
                    </div>

                    <div className="mb-3">
                      <span className="text-yellow-400 font-medium text-sm">Objective/Task:</span>
                      <p className="text-gray-300 text-sm mt-1">{event.objective_capability_task}</p>
                    </div>

                    {event.notes && (
                      <div className="mb-3 p-3 bg-gray-700/50 rounded">
                        <span className="text-cyan-400 font-medium text-sm">Controller Notes:</span>
                        <p className="text-gray-300 text-sm mt-1">{event.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {new Date(event.created_at).toLocaleString()}</span>
                      {event.completed && event.actual_time && (
                        <span>Completed at: {event.actual_time}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCompletion(event)}
                      className={event.completed 
                        ? "border-green-600 text-green-300 hover:text-green-200 hover:border-green-500/50"
                        : "border-orange-600 text-orange-300 hover:text-orange-200 hover:border-orange-500/50"
                      }
                    >
                      {event.completed ? 'Mark Pending' : 'Mark Complete'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(event)}
                      className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEvent(event.id)}
                      className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const MSELView = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddNew = () => {
    setEditingEvent(null);
    setView('add');
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingEvent(null);
  };

  const handleSave = () => {
    setView('list');
    setEditingEvent(null);
    // The list will automatically refresh via useEffect
  };

  if (view === 'add' || view === 'edit') {
    return (
      <MSELForm
        onBack={handleBack}
        onSave={handleSave}
        editingEvent={editingEvent}
      />
    );
  }

  return (
    <MSELList
      onAddNew={handleAddNew}
      onEdit={handleEdit}
    />
  );
};

// HIRA Management Components
const HIRAForm = ({ onBack, onSave, editingEntry = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    notes: '',
    disaster_type: '',
    latitude: 0,
    longitude: 0,
    frequency: 1,
    fatalities: 0,
    injuries: 0,
    evacuation: 0,
    property_damage: 0,
    critical_infrastructure: 0,
    environmental_damage: 0,
    business_financial_impact: 0,
    psychosocial_impact: 0,
    change_in_frequency: [false, false, false, false],
    change_in_vulnerability: [false, false, false],
    hazard_image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Validation error states
  const [validationErrors, setValidationErrors] = useState({
    latitude: '',
    longitude: ''
  });

  const disasterTypes = [
    // Manmade disasters
    'Terrorism', 'Cyber Attack', 'Industrial Accident', 'Chemical Spill', 'Nuclear Accident',
    'Transportation Accident', 'Building Collapse', 'Fire (Structural)', 'Explosion',
    'Hazardous Material Release', 'Infrastructure Failure', 'Mass Shooting', 'Civil Unrest',
    'Supply Chain Disruption', 'Economic Crisis', 'Pandemic (Human-caused)',
    // Natural disasters  
    'Earthquake', 'Flood', 'Hurricane/Typhoon', 'Tornado', 'Wildfire', 'Drought',
    'Blizzard/Ice Storm', 'Heatwave', 'Thunderstorm/Hail', 'Landslide', 'Tsunami',
    'Volcanic Eruption', 'Pandemic (Natural)', 'Disease Outbreak', 'Insect Infestation',
    'Extreme Cold', 'Coastal Erosion', 'Sinkhole'
  ];

  const frequencyLevels = [
    { level: 1, label: 'Rare', description: 'Less than a 1% chance of occurrence in any year. Hazards with return periods >100 years.' },
    { level: 2, label: 'Very Unlikely', description: 'Between a 1 - 2% chance of occurrence in any year. Occurs every 50 – 100 years and includes hazards that have not occurred but are reported to be more likely to occur in the near future.' },
    { level: 3, label: 'Unlikely', description: 'Between a 2 – 10% chance of occurrence in any year. Occurs every 20 – 50 years.' },
    { level: 4, label: 'Probable', description: 'Between a 10 – 50% chance of occurrence in any year. Occurs every 5 – 20 years.' },
    { level: 5, label: 'Likely', description: 'Between a 50 – 100% chance of occurrence in any year. Occurs > 5 years.' },
    { level: 6, label: 'Almost Certain', description: '100% chance of occurrence in any year. The hazard occurs annually.' }
  ];

  const fatalityLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in fatalities within the community.' },
    { level: 1, label: 'Minor', description: 'Could result in fewer than five fatalities within the community.' },
    { level: 2, label: 'Moderate', description: 'Could result in 5 – 10 fatalities within the community.' },
    { level: 3, label: 'Severe', description: 'Could result in 10 – 50 fatalities within the community.' },
    { level: 4, label: 'Catastrophic', description: 'Could result in +50 fatalities within the community.' }
  ];

  const injuryLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in injuries within the community.' },
    { level: 1, label: 'Minor', description: 'Could injure fewer than 25 people within the community.' },
    { level: 2, label: 'Moderate', description: 'Could injure 25 – 100 people within the community.' },
    { level: 3, label: 'Severe', description: 'Could injure +100 people within the community.' }
  ];

  const evacuationLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in an evacuation shelter-in-place orders, or people stranded.' },
    { level: 1, label: 'Minor', description: 'Could result in fewer than 100 people being evacuated, sheltered-in-place or stranded.' },
    { level: 2, label: 'Moderate', description: 'Could result in 100 - 500 people being evacuated, sheltered-in-place or stranded.' },
    { level: 3, label: 'Severe', description: 'Could result in more than 500 people being evacuated, sheltered-in-place or stranded.' }
  ];

  const propertyLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in property damage within the community.' },
    { level: 1, label: 'Minor', description: 'Could cause minor and mostly cosmetic damage.' },
    { level: 2, label: 'Moderate', description: 'Localized severe damage (a few buildings destroyed).' },
    { level: 3, label: 'Severe', description: 'Widespread severe damage (many buildings destroyed).' }
  ];

  const infrastructureLevels = [
    { level: 0, label: 'None', description: 'Not likely to disrupt critical infrastructure services.' },
    { level: 1, label: 'Minor', description: 'Could disrupt 1 critical infrastructure service.' },
    { level: 2, label: 'Moderate', description: 'Could disrupt 2 – 3 critical infrastructure services.' },
    { level: 3, label: 'Severe', description: 'Could disrupt more than 3 critical infrastructure services.' }
  ];

  const environmentalLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in environmental damage.' },
    { level: 1, label: 'Minor', description: 'Could cause localized and reversible damage. Quick clean up possible.' },
    { level: 2, label: 'Moderate', description: 'Could cause major but reversible damage. Full clean up difficult.' },
    { level: 3, label: 'Severe', description: 'Could cause severe and irreversible environmental damage. Full clean up not possible.' }
  ];

  const businessLevels = [
    { level: 0, label: 'None', description: 'Not likely to disrupt business / financial activities.' },
    { level: 1, label: 'Moderate', description: 'Could result in losses for an industry.' },
    { level: 2, label: 'Severe', description: 'Could cause severe and irreversible environmental damage. Full clean up not possible.' }
  ];

  const psychosocialLevels = [
    { level: 0, label: 'None', description: 'Not likely to result in significant psychosocial impacts.' },
    { level: 1, label: 'Moderate', description: 'Significant psychosocial impacts including limited panic, hoarding, self-evacuation and long-term psychosocial impacts.' },
    { level: 2, label: 'Severe', description: 'Widespread psychosocial impacts, e.g. mass panic, widespread hoarding and self-evacuation and long-term psychological impacts.' }
  ];

  const frequencyChangeQuestions = [
    'Are the number of non-emergency occurrences of the hazard increasing?',
    'Is human activity (e.g. population growth, change of drainage patterns) likely to lead to more interaction with the hazard or an increase in frequency?',
    'Are there an environmental reason (e.g. climate change) why the frequency of this hazard may increase?',
    'Are human factors such as business, financial, international practices more likely to increase the risk?'
  ];

  const vulnerabilityChangeQuestions = [
    'Is a large number of the population vulnerable or are the number of people vulnerable to this hazard increasing?',
    'Does critical infrastructure reliance or a "just-on-time" delivery system (e.g. stores not keeping a supply of food and relying on frequent shipments) make the population more vulnerable?',
    'Are response agencies not aware of, practiced and prepared to response to this hazard?'
  ];

  // Validation helper functions
  const validateLatitudeField = (lat) => {
    if (lat === '' || lat === 0) return ''; // Field is not required
    if (!validateLatitude(lat)) {
      return 'Please enter latitude in format 45.1234 (range: -90.0000 to 90.0000)';
    }
    return '';
  };

  const validateLongitudeField = (lng) => {
    if (lng === '' || lng === 0) return ''; // Field is not required
    if (!validateLongitude(lng)) {
      return 'Please enter longitude in format 97.0000 (range: -180.0000 to 180.0000)';
    }
    return '';
  };

  const handleLatitudeChange = (e) => {
    const lat = e.target.value;
    setFormData(prev => ({ ...prev, latitude: lat }));
    
    // Real-time validation
    const error = validateLatitudeField(lat);
    setValidationErrors(prev => ({ ...prev, latitude: error }));
  };

  const handleLongitudeChange = (e) => {
    const lng = e.target.value;
    setFormData(prev => ({ ...prev, longitude: lng }));
    
    // Real-time validation
    const error = validateLongitudeField(lng);
    setValidationErrors(prev => ({ ...prev, longitude: error }));
  };

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        name: editingEntry.name || '',
        description: editingEntry.description || '',
        notes: editingEntry.notes || '',
        disaster_type: editingEntry.disaster_type || '',
        latitude: editingEntry.latitude || 0,
        longitude: editingEntry.longitude || 0,
        frequency: editingEntry.frequency || 1,
        fatalities: editingEntry.fatalities || 0,
        injuries: editingEntry.injuries || 0,
        evacuation: editingEntry.evacuation || 0,
        property_damage: editingEntry.property_damage || 0,
        critical_infrastructure: editingEntry.critical_infrastructure || 0,
        environmental_damage: editingEntry.environmental_damage || 0,
        business_financial_impact: editingEntry.business_financial_impact || 0,
        psychosocial_impact: editingEntry.psychosocial_impact || 0,
        change_in_frequency: editingEntry.change_in_frequency || [false, false, false, false],
        change_in_vulnerability: editingEntry.change_in_vulnerability || [false, false, false],
        hazard_image: editingEntry.hazard_image || null
      });
      if (editingEntry.hazard_image) {
        setImagePreview(editingEntry.hazard_image);
      }
    }
  }, [editingEntry]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, hazard_image: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        setFormData(prev => ({ ...prev, hazard_image: imageData }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingEntry) {
        await axios.put(`${API}/hira/${editingEntry.id}`, formData);
      } else {
        await axios.post(`${API}/hira`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving HIRA entry:', error);
      alert('Error saving HIRA entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateChangeFrequency = (index, checked) => {
    const newArray = [...formData.change_in_frequency];
    newArray[index] = checked;
    setFormData(prev => ({ ...prev, change_in_frequency: newArray }));
  };

  const updateChangeVulnerability = (index, checked) => {
    const newArray = [...formData.change_in_vulnerability];
    newArray[index] = checked;
    setFormData(prev => ({ ...prev, change_in_vulnerability: newArray }));
  };

  const RadioSection = ({ title, levels, value, onChange, required = true }) => (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-orange-500 flex items-center">
          {title}
          {required && <span className="text-red-400 ml-1">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value.toString()} onValueChange={(val) => onChange(parseInt(val))}>
          {levels.map((level) => (
            <div key={level.level} className="flex items-start space-x-3 py-2">
              <RadioGroupItem value={level.level.toString()} id={`${title}-${level.level}`} />
              <div className="flex-1">
                <Label htmlFor={`${title}-${level.level}`} className="text-white font-medium cursor-pointer">
                  Level {level.level} - {level.label}
                </Label>
                <p className="text-sm text-gray-400 mt-1">{level.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-400 hover:text-orange-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to HIRA List
        </Button>
        <h1 className="text-3xl font-bold text-orange-500 mb-2">
          {editingEntry ? 'Edit HIRA Entry' : 'Add New HIRA Entry'}
        </h1>
        <p className="text-gray-400">Hazard Identification Risk Assessment for emergency planning</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hazard Image Upload */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Hazard Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Hazard" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="hazard-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hazard-image-upload').click()}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 mr-3"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <p className="text-sm text-gray-400">Upload image of hazard area or related documentation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-300">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="disaster_type" className="text-gray-300">Disaster Type *</Label>
              <Select value={formData.disaster_type} onValueChange={(value) => setFormData(prev => ({ ...prev, disaster_type: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select disaster type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                  <SelectItem value="manmade-separator" disabled className="font-semibold text-orange-400">
                    --- MANMADE DISASTERS ---
                  </SelectItem>
                  {disasterTypes.slice(0, 16).map((type) => (
                    <SelectItem key={type} value={type} className="text-white focus:bg-gray-600">
                      {type}
                    </SelectItem>
                  ))}
                  <SelectItem value="natural-separator" disabled className="font-semibold text-green-400">
                    --- NATURAL DISASTERS ---
                  </SelectItem>
                  {disasterTypes.slice(16).map((type) => (
                    <SelectItem key={type} value={type} className="text-white focus:bg-gray-600">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-gray-300">Latitude</Label>
                <Input
                  id="latitude"
                  type="text"
                  value={formData.latitude}
                  onChange={handleLatitudeChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="45.1234"
                />
                {validationErrors.latitude && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.latitude}</p>
                )}
              </div>
              <div>
                <Label htmlFor="longitude" className="text-gray-300">Longitude</Label>
                <Input
                  id="longitude"
                  type="text"
                  value={formData.longitude}
                  onChange={handleLongitudeChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="97.0000"
                />
                {validationErrors.longitude && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.longitude}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-orange-500">Risk Assessment Categories</h2>
          
          <RadioSection
            title="Frequency"
            levels={frequencyLevels}
            value={formData.frequency}
            onChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
          />

          <RadioSection
            title="Fatalities"
            levels={fatalityLevels}
            value={formData.fatalities}
            onChange={(value) => setFormData(prev => ({ ...prev, fatalities: value }))}
          />

          <RadioSection
            title="Injuries"
            levels={injuryLevels}
            value={formData.injuries}
            onChange={(value) => setFormData(prev => ({ ...prev, injuries: value }))}
          />

          <RadioSection
            title="Evacuation"
            levels={evacuationLevels}
            value={formData.evacuation}
            onChange={(value) => setFormData(prev => ({ ...prev, evacuation: value }))}
          />

          <RadioSection
            title="Property Damage"
            levels={propertyLevels}
            value={formData.property_damage}
            onChange={(value) => setFormData(prev => ({ ...prev, property_damage: value }))}
          />

          <RadioSection
            title="Critical Infrastructure Service Impact (CI)"
            levels={infrastructureLevels}
            value={formData.critical_infrastructure}
            onChange={(value) => setFormData(prev => ({ ...prev, critical_infrastructure: value }))}
          />

          <RadioSection
            title="Environmental Damage"
            levels={environmentalLevels}
            value={formData.environmental_damage}
            onChange={(value) => setFormData(prev => ({ ...prev, environmental_damage: value }))}
          />

          <RadioSection
            title="Business Financial Impact"
            levels={businessLevels}
            value={formData.business_financial_impact}
            onChange={(value) => setFormData(prev => ({ ...prev, business_financial_impact: value }))}
          />

          <RadioSection
            title="Psychosocial Impact"
            levels={psychosocialLevels}
            value={formData.psychosocial_impact}
            onChange={(value) => setFormData(prev => ({ ...prev, psychosocial_impact: value }))}
          />

          {/* Change in Frequency */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-orange-500 flex items-center">
                Change in Frequency <span className="text-red-400 ml-1">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {frequencyChangeQuestions.map((question, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`freq-${index}`}
                    checked={formData.change_in_frequency[index]}
                    onCheckedChange={(checked) => updateChangeFrequency(index, checked)}
                  />
                  <Label htmlFor={`freq-${index}`} className="text-gray-300 cursor-pointer">
                    {question}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Change in Vulnerability */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-orange-500 flex items-center">
                Change in Vulnerability <span className="text-red-400 ml-1">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vulnerabilityChangeQuestions.map((question, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`vuln-${index}`}
                    checked={formData.change_in_vulnerability[index]}
                    onCheckedChange={(checked) => updateChangeVulnerability(index, checked)}
                  />
                  <Label htmlFor={`vuln-${index}`} className="text-gray-300 cursor-pointer">
                    {question}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            disabled={loading}
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingEntry ? 'Update HIRA Entry' : 'Save HIRA Entry'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const HIRAList = ({ onAddNew, onEdit }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API}/hira`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching HIRA entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this HIRA entry?')) {
      try {
        await axios.delete(`${API}/hira/${entryId}`);
        setEntries(prev => prev.filter(e => e.id !== entryId));
      } catch (error) {
        console.error('Error deleting HIRA entry:', error);
        alert('Error deleting HIRA entry. Please try again.');
      }
    }
  };

  const getRiskLevel = (frequency, impact) => {
    const riskScore = frequency * impact;
    if (riskScore >= 15) return { level: 'Critical', color: 'bg-red-500/20 text-red-300 border-red-500/30', score: riskScore };
    if (riskScore >= 10) return { level: 'High', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', score: riskScore };
    if (riskScore >= 5) return { level: 'Medium', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', score: riskScore };
    return { level: 'Low', color: 'bg-green-500/20 text-green-300 border-green-500/30', score: riskScore };
  };

  // Sort entries by risk score (highest risk first)
  const sortedEntries = [...entries].sort((a, b) => {
    const maxImpactA = Math.max(a.fatalities, a.injuries, a.evacuation, a.property_damage);
    const maxImpactB = Math.max(b.fatalities, b.injuries, b.evacuation, b.property_damage);
    const riskScoreA = a.frequency * maxImpactA;
    const riskScoreB = b.frequency * maxImpactB;
    return riskScoreB - riskScoreA; // Descending order (highest risk first)
  });

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">HIRA - Hazard Identification Risk Assessment</h1>
          <p className="text-gray-400">Identify and assess emergency risks for your community</p>
        </div>
        <Button 
          onClick={onAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          data-testid="add-hira-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add HIRA Entry
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No HIRA Entries Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Start identifying and assessing hazards in your community to improve emergency preparedness.
            </p>
            <Button 
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First HIRA Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              Showing {sortedEntries.length} hazard{sortedEntries.length !== 1 ? 's' : ''} (sorted by risk level)
            </p>
          </div>
          {sortedEntries.map((entry) => {
            const maxImpact = Math.max(entry.fatalities, entry.injuries, entry.evacuation, entry.property_damage);
            const riskLevel = getRiskLevel(entry.frequency, maxImpact);
            
            return (
              <Card key={entry.id} className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Hazard Image */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={entry.hazard_image} alt={entry.name} />
                        <AvatarFallback className="bg-gray-600 text-orange-500 text-lg font-semibold">
                          <AlertTriangle className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{entry.name}</h3>
                        <Badge className={riskLevel.color}>
                          {riskLevel.level} Risk
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {entry.disaster_type}
                        </Badge>
                        <span className="text-xs text-gray-500">Risk Score: {riskLevel.score}</span>
                      </div>
                      
                      <p className="text-gray-400 mb-4">{entry.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-orange-400 font-medium">Frequency:</span>
                          <span className="text-gray-300 ml-2">Level {entry.frequency}</span>
                        </div>
                        <div>
                          <span className="text-red-400 font-medium">Max Impact:</span>
                          <span className="text-gray-300 ml-2">Level {maxImpact}</span>
                        </div>
                        {entry.latitude && entry.longitude && (
                          <div>
                            <span className="text-green-400 font-medium">Location:</span>
                            <span className="text-gray-300 ml-2">{entry.latitude.toFixed(2)}, {entry.longitude.toFixed(2)}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-purple-400 font-medium">Created:</span>
                          <span className="text-gray-300 ml-2">{new Date(entry.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {entry.notes && (
                        <div className="mt-3 p-3 bg-gray-700/50 rounded">
                          <span className="text-blue-400 font-medium text-sm">Notes: </span>
                          <span className="text-gray-300 text-sm">{entry.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(entry)}
                        className="border-gray-600 text-gray-300 hover:text-orange-500 hover:border-orange-500/50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                        className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const HIRAView = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [editingEntry, setEditingEntry] = useState(null);

  const handleAddNew = () => {
    setEditingEntry(null);
    setView('add');
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingEntry(null);
  };

  const handleSave = () => {
    setView('list');
    setEditingEntry(null);
    // The list will automatically refresh via useEffect
  };

  if (view === 'add' || view === 'edit') {
    return (
      <HIRAForm
        onBack={handleBack}
        onSave={handleSave}
        editingEntry={editingEntry}
      />
    );
  }

  return (
    <HIRAList
      onAddNew={handleAddNew}
      onEdit={handleEdit}
    />
  );
};

// Exercise Builder Step-by-Step Wizard
const ExerciseBuilderWizard = ({ onBack, editingExercise = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [exerciseData, setExerciseData] = useState({
    // Step 1: Exercise
    exercise_image: null,
    exercise_name: '',
    exercise_type: '',
    exercise_description: '',
    location: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    // Step 2: Scope
    scope_description: '',
    scope_hazards: '',
    scope_geographic_area: '',
    scope_functions: '',
    scope_organizations: '',
    scope_personnel: '',
    scope_exercise_type: '',
    // Step 3: Purpose
    purpose_description: '',
    // Step 4: Scenario
    scenario_image: null,
    scenario_name: '',
    scenario_description: '',
    scenario_latitude: 0,
    scenario_longitude: 0
  });
  const [imagePreview, setImagePreview] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Validation error states
  const [scenarioValidationErrors, setScenarioValidationErrors] = useState({
    latitude: '',
    longitude: ''
  });
  const [eventValidationErrors, setEventValidationErrors] = useState({
    latitude: '',
    longitude: ''
  });
  const [organizationValidationErrors, setOrganizationValidationErrors] = useState({
    latitude: '',
    longitude: ''
  });

  // Dynamic lists for add functionality
  const [goals, setGoals] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [events, setEvents] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [codeWords, setCodeWords] = useState([]);
  const [callsigns, setCallsigns] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [assumptions, setAssumptions] = useState([]);
  const [artificialities, setArtificialities] = useState([]);
  const [safetyConcerns, setSafetyConcerns] = useState([]);

  // Current form states for adding items
  const [currentGoal, setCurrentGoal] = useState({ name: '', description: '', achieved: 'No' });
  const [currentObjective, setCurrentObjective] = useState({ name: '', description: '', achieved: 'No' });
  const [currentEvent, setCurrentEvent] = useState({ 
    name: '', description: '', actions: '', latitude: 0, longitude: 0, 
    start_date: '', start_time: '', end_date: '', end_time: '', 
    tier_scale: '', escalation_value: 'none' 
  });
  const [currentFunction, setCurrentFunction] = useState({ name: '', description: '', achieved: 'No' });
  const [currentOrganization, setCurrentOrganization] = useState({ 
    name: '', description: '', home_base: '', contact_first_name: '', 
    contact_last_name: '', contact_phone: '', contact_email: '',
    latitude: '', longitude: ''
  });
  const [currentCodeWord, setCurrentCodeWord] = useState({ word: '', meaning: '' });
  const [currentCallsign, setCurrentCallsign] = useState({ callsign: '', description: '' });
  const [currentFrequency, setCurrentFrequency] = useState({ 
    frequency: '', type: '', description: '', primary_backup: 'Primary' 
  });
  const [currentAssumption, setCurrentAssumption] = useState({ assumption: '', description: '' });
  const [currentArtificiality, setCurrentArtificiality] = useState({ artificiality: '', description: '' });
  const [currentSafetyConcern, setSafetyConcern] = useState({ 
    concern: '', safety_officer: '', phone: '', description: '' 
  });

  // Validation helper functions for scenario section
  const validateScenarioLatitudeField = (lat) => {
    if (lat === '' || lat === 0) return ''; // Field is not required
    if (!validateLatitude(lat)) {
      return 'Please enter latitude in format 45.1234 (range: -90.0000 to 90.0000)';
    }
    return '';
  };

  const validateScenarioLongitudeField = (lng) => {
    if (lng === '' || lng === 0) return ''; // Field is not required
    if (!validateLongitude(lng)) {
      return 'Please enter longitude in format 97.0000 (range: -180.0000 to 180.0000)';
    }
    return '';
  };

  const handleScenarioLatitudeChange = (e) => {
    const lat = e.target.value;
    setExerciseData(prev => ({ ...prev, scenario_latitude: lat }));
    
    // Real-time validation
    const error = validateScenarioLatitudeField(lat);
    setScenarioValidationErrors(prev => ({ ...prev, latitude: error }));
  };

  const handleScenarioLongitudeChange = (e) => {
    const lng = e.target.value;
    setExerciseData(prev => ({ ...prev, scenario_longitude: lng }));
    
    // Real-time validation
    const error = validateScenarioLongitudeField(lng);
    setScenarioValidationErrors(prev => ({ ...prev, longitude: error }));
  };

  // Validation helper functions for event section
  const validateEventLatitudeField = (lat) => {
    if (lat === '' || lat === 0) return ''; // Field is not required
    if (!validateLatitude(lat)) {
      return 'Please enter latitude in format 45.1234 (range: -90.0000 to 90.0000)';
    }
    return '';
  };

  const validateEventLongitudeField = (lng) => {
    if (lng === '' || lng === 0) return ''; // Field is not required
    if (!validateLongitude(lng)) {
      return 'Please enter longitude in format 97.0000 (range: -180.0000 to 180.0000)';
    }
    return '';
  };

  const handleEventLatitudeChange = (e) => {
    const lat = e.target.value;
    setCurrentEvent(prev => ({ ...prev, latitude: lat }));
    
    // Real-time validation
    const error = validateEventLatitudeField(lat);
    setEventValidationErrors(prev => ({ ...prev, latitude: error }));
  };

  const handleEventLongitudeChange = (e) => {
    const lng = e.target.value;
    setCurrentEvent(prev => ({ ...prev, longitude: lng }));
    
    // Real-time validation
    const error = validateEventLongitudeField(lng);
    setEventValidationErrors(prev => ({ ...prev, longitude: error }));
  };

  // Validation helper functions for organization section
  const validateOrganizationLatitudeField = (lat) => {
    if (lat === '' || lat === 0) return ''; // Field is not required
    if (!validateLatitude(lat)) {
      return 'Please enter latitude in format 45.1234 (range: -90.0000 to 90.0000)';
    }
    return '';
  };

  const validateOrganizationLongitudeField = (lng) => {
    if (lng === '' || lng === 0) return ''; // Field is not required
    if (!validateLongitude(lng)) {
      return 'Please enter longitude in format 97.0000 (range: -180.0000 to 180.0000)';
    }
    return '';
  };

  const handleOrganizationLatitudeChange = (e) => {
    const lat = e.target.value;
    setCurrentOrganization(prev => ({ ...prev, latitude: lat }));
    
    // Real-time validation
    const error = validateOrganizationLatitudeField(lat);
    setOrganizationValidationErrors(prev => ({ ...prev, latitude: error }));
  };

  const handleOrganizationLongitudeChange = (e) => {
    const lng = e.target.value;
    setCurrentOrganization(prev => ({ ...prev, longitude: lng }));
    
    // Real-time validation
    const error = validateOrganizationLongitudeField(lng);
    setOrganizationValidationErrors(prev => ({ ...prev, longitude: error }));
  };

  // Load existing exercise data when editing
  useEffect(() => {
    if (editingExercise) {
      setIsEditing(true);
      
      // Convert ISO date strings back to date format for form inputs
      const startDate = editingExercise.start_date ? new Date(editingExercise.start_date) : null;
      const endDate = editingExercise.end_date ? new Date(editingExercise.end_date) : null;
      
      setExerciseData({
        id: editingExercise.id,
        exercise_image: editingExercise.exercise_image || null,
        exercise_name: editingExercise.exercise_name || '',
        exercise_type: editingExercise.exercise_type || '',
        exercise_description: editingExercise.exercise_description || '',
        location: editingExercise.location || '',
        start_date: startDate ? startDate.toISOString().split('T')[0] : '',
        start_time: startDate ? startDate.toTimeString().slice(0, 5) : '',
        end_date: endDate ? endDate.toISOString().split('T')[0] : '',
        end_time: endDate ? endDate.toTimeString().slice(0, 5) : '',
        scope_description: editingExercise.scope_description || '',
        scope_hazards: editingExercise.scope_hazards || '',
        scope_geographic_area: editingExercise.scope_geographic_area || '',
        scope_functions: editingExercise.scope_functions || '',
        scope_organizations: editingExercise.scope_organizations || '',
        scope_personnel: editingExercise.scope_personnel || '',
        scope_exercise_type: editingExercise.scope_exercise_type || '',
        purpose_description: editingExercise.purpose_description || '',
        scenario_image: editingExercise.scenario_image || null,
        scenario_name: editingExercise.scenario_name || '',
        scenario_description: editingExercise.scenario_description || '',
        scenario_latitude: editingExercise.scenario_latitude || 0,
        scenario_longitude: editingExercise.scenario_longitude || 0
      });

      // Set image previews if they exist
      const previews = {};
      if (editingExercise.exercise_image) {
        previews.exercise_image = editingExercise.exercise_image;
      }
      if (editingExercise.scenario_image) {
        previews.scenario_image = editingExercise.scenario_image;
      }
      setImagePreview(previews);

      // Load dynamic collections if they exist
      console.log('Loading dynamic collections from editingExercise:', editingExercise);
      console.log('Full editingExercise object:', JSON.stringify(editingExercise, null, 2));
      console.log('Goals data:', editingExercise.goals);
      console.log('Goals type:', typeof editingExercise.goals);
      console.log('Goals is array:', Array.isArray(editingExercise.goals));
      console.log('Objectives data:', editingExercise.objectives);
      console.log('Objectives type:', typeof editingExercise.objectives);
      console.log('Objectives is array:', Array.isArray(editingExercise.objectives));
      
      // Always set the collections, even if they're empty arrays
      if (editingExercise.goals !== undefined) {
        console.log('Setting goals with data:', editingExercise.goals);
        setGoals(Array.isArray(editingExercise.goals) ? editingExercise.goals : []);
      }
      if (editingExercise.objectives !== undefined) {
        console.log('Setting objectives with data:', editingExercise.objectives);
        setObjectives(Array.isArray(editingExercise.objectives) ? editingExercise.objectives : []);
      }
      if (editingExercise.events !== undefined) {
        setEvents(Array.isArray(editingExercise.events) ? editingExercise.events : []);
      }
      if (editingExercise.functions !== undefined) {
        setFunctions(Array.isArray(editingExercise.functions) ? editingExercise.functions : []);
      }
      if (editingExercise.organizations !== undefined) {
        setOrganizations(Array.isArray(editingExercise.organizations) ? editingExercise.organizations : []);
      }
      if (editingExercise.codeWords !== undefined) {
        setCodeWords(Array.isArray(editingExercise.codeWords) ? editingExercise.codeWords : []);
      }
      if (editingExercise.callsigns !== undefined) {
        setCallsigns(Array.isArray(editingExercise.callsigns) ? editingExercise.callsigns : []);
      }
      if (editingExercise.frequencies !== undefined) {
        setFrequencies(Array.isArray(editingExercise.frequencies) ? editingExercise.frequencies : []);
      }
      if (editingExercise.assumptions !== undefined) {
        setAssumptions(Array.isArray(editingExercise.assumptions) ? editingExercise.assumptions : []);
      }
      if (editingExercise.artificialities !== undefined) {
        setArtificialities(Array.isArray(editingExercise.artificialities) ? editingExercise.artificialities : []);
      }
      if (editingExercise.safetyConcerns !== undefined) {
        setSafetyConcerns(Array.isArray(editingExercise.safetyConcerns) ? editingExercise.safetyConcerns : []);
      }
    }
  }, [editingExercise]);

  const exerciseTypes = [
    'Table Top',
    'Drill', 
    'Functional',
    'Full Scale Exercise',
    'No-Notice Exercise',
    'Real World Event'
  ];

  const steps = [
    { number: 1, title: 'Exercise', description: 'Basic exercise information' },
    { number: 2, title: 'Scope', description: 'Define exercise scope and boundaries' },
    { number: 3, title: 'Purpose', description: 'Exercise purpose and intent' },
    { number: 4, title: 'Scenario', description: 'Exercise scenario details' },
    { number: 5, title: 'Goals', description: 'Exercise goals and outcomes' },
    { number: 6, title: 'Objectives', description: 'Specific objectives to test' },
    { number: 7, title: 'Events', description: 'Exercise events and timeline' },
    { number: 8, title: 'Functions', description: 'Functions to be exercised' },
    { number: 9, title: 'Injections', description: 'MSEL integration' },
    { number: 10, title: 'Organizations', description: 'Participating organizations' },
    { number: 11, title: 'Team Coordinators', description: 'Exercise coordination team' },
    { number: 12, title: 'Code Words', description: 'Exercise code words' },
    { number: 13, title: 'Callsigns', description: 'Communication callsigns' },
    { number: 14, title: 'Comm Frequencies', description: 'Radio frequencies' },
    { number: 15, title: 'Assumptions', description: 'Exercise assumptions' },
    { number: 16, title: 'Artificialities', description: 'Artificial constraints' },
    { number: 17, title: 'Safety', description: 'Safety considerations' }
  ];

  const handleImageUpload = (event, imageType) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(prev => ({ ...prev, [imageType]: imageData }));
        setExerciseData(prev => ({ ...prev, [imageType]: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async (imageType) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(prev => ({ ...prev, [imageType]: imageData }));
        setExerciseData(prev => ({ ...prev, [imageType]: imageData }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add handlers for dynamic items
  const addGoal = () => {
    if (currentGoal.name.trim()) {
      setGoals(prev => [...prev, { ...currentGoal, id: Date.now() }]);
      setCurrentGoal({ name: '', description: '', achieved: 'No' });
    }
  };

  const addObjective = () => {
    if (currentObjective.name.trim()) {
      setObjectives(prev => [...prev, { ...currentObjective, id: Date.now() }]);
      setCurrentObjective({ name: '', description: '', achieved: 'No' });
    }
  };

  const addEvent = () => {
    if (currentEvent.name.trim()) {
      setEvents(prev => [...prev, { ...currentEvent, id: Date.now() }]);
      setCurrentEvent({ 
        name: '', description: '', actions: '', latitude: 0, longitude: 0, 
        start_date: '', start_time: '', end_date: '', end_time: '', 
        tier_scale: '', escalation_value: 'none' 
      });
    }
  };

  const addFunction = () => {
    if (currentFunction.name.trim()) {
      setFunctions(prev => [...prev, { ...currentFunction, id: Date.now() }]);
      setCurrentFunction({ name: '', description: '', achieved: 'No' });
    }
  };

  const addOrganization = () => {
    if (currentOrganization.name.trim()) {
      setOrganizations(prev => [...prev, { ...currentOrganization, id: Date.now() }]);
      setCurrentOrganization({ 
        name: '', description: '', home_base: '', contact_first_name: '', 
        contact_last_name: '', contact_phone: '', contact_email: '' 
      });
    }
  };

  const addCodeWord = () => {
    if (currentCodeWord.word.trim()) {
      setCodeWords(prev => [...prev, { ...currentCodeWord, id: Date.now() }]);
      setCurrentCodeWord({ word: '', meaning: '' });
    }
  };

  const addCallsign = () => {
    if (currentCallsign.callsign.trim()) {
      setCallsigns(prev => [...prev, { ...currentCallsign, id: Date.now() }]);
      setCurrentCallsign({ callsign: '', description: '' });
    }
  };

  const addFrequency = () => {
    if (currentFrequency.frequency.trim()) {
      setFrequencies(prev => [...prev, { ...currentFrequency, id: Date.now() }]);
      setCurrentFrequency({ 
        frequency: '', type: '', description: '', primary_backup: 'Primary' 
      });
    }
  };

  const addAssumption = () => {
    if (currentAssumption.assumption.trim()) {
      setAssumptions(prev => [...prev, { ...currentAssumption, id: Date.now() }]);
      setCurrentAssumption({ assumption: '', description: '' });
    }
  };

  const addArtificiality = () => {
    if (currentArtificiality.artificiality.trim()) {
      setArtificialities(prev => [...prev, { ...currentArtificiality, id: Date.now() }]);
      setCurrentArtificiality({ artificiality: '', description: '' });
    }
  };

  const addSafetyConcern = () => {
    if (currentSafetyConcern.concern.trim()) {
      setSafetyConcerns(prev => [...prev, { ...currentSafetyConcern, id: Date.now() }]);
      setSafetyConcern({ 
        concern: '', safety_officer: '', phone: '', description: '' 
      });
    }
  };

  // Remove handlers
  const removeGoal = (id) => setGoals(prev => prev.filter(item => item.id !== id));
  const removeObjective = (id) => setObjectives(prev => prev.filter(item => item.id !== id));
  const removeEvent = (id) => setEvents(prev => prev.filter(item => item.id !== id));
  const removeFunction = (id) => setFunctions(prev => prev.filter(item => item.id !== id));
  const removeOrganization = (id) => setOrganizations(prev => prev.filter(item => item.id !== id));
  const removeCodeWord = (id) => setCodeWords(prev => prev.filter(item => item.id !== id));
  const removeCallsign = (id) => setCallsigns(prev => prev.filter(item => item.id !== id));
  const removeFrequency = (id) => setFrequencies(prev => prev.filter(item => item.id !== id));
  const removeAssumption = (id) => setAssumptions(prev => prev.filter(item => item.id !== id));
  const removeArtificiality = (id) => setArtificialities(prev => prev.filter(item => item.id !== id));
  const removeSafetyConcern = (id) => setSafetyConcerns(prev => prev.filter(item => item.id !== id));

  // Load coordinators from participants
  const loadCoordinators = async () => {
    try {
      setLoading(true);
      
      // Fetch all participants
      const response = await axios.get(`${API}/participants`);
      const participants = response.data;
      
      // Filter participants who:
      // 1. Have position "Team Coordinator"
      // 2. Are participating in current exercise (involvedInExercise = true)
      const eligibleCoordinators = participants.filter(participant => 
        participant.position === 'Team Coordinator' && 
        participant.involvedInExercise === true
      );
      
      // Transform participants to coordinator format
      const coordinators = eligibleCoordinators.map(participant => ({
        id: participant.id || Date.now() + Math.random(),
        name: participant.name || `${participant.firstName} ${participant.lastName}` || 'Unknown',
        role: participant.position || 'Team Coordinator',
        email: participant.email || '',
        phone: participant.cellPhone || participant.homePhone || participant.phone || '',
        organization: participant.organization || '',
        assignedTo: participant.assignedTo || ''
      }));
      
      // Update the exercise data with loaded coordinators
      if (editingExercise) {
        setEditingExercise(prev => ({
          ...prev,
          coordinators: coordinators
        }));
      } else {
        // For new exercise, update exerciseData
        setExerciseData(prev => ({
          ...prev,
          coordinators: coordinators
        }));
      }
      
      console.log(`Loaded ${coordinators.length} coordinators:`, coordinators);
      
    } catch (error) {
      console.error('Error loading coordinators:', error);
      alert('Failed to load coordinators. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save current step as draft
  const saveStepDraft = async () => {
    setLoading(true);
    try {
      // Combine all current data
      const allData = {
        ...exerciseData,
        goals,
        objectives,
        events,
        functions,
        organizations,
        codeWords,
        callsigns,
        frequencies,
        assumptions,
        artificialities,
        safetyConcerns
      };

      // Use the same save logic as the main save function
      let startDate, endDate;
      
      if (allData.start_date) {
        startDate = new Date(allData.start_date + 'T' + (allData.start_time || '00:00'));
        if (isNaN(startDate.getTime())) {
          throw new Error('Invalid start date');
        }
      } else {
        startDate = new Date();
      }
      
      if (allData.end_date) {
        endDate = new Date(allData.end_date + 'T' + (allData.end_time || '23:59'));
        if (isNaN(endDate.getTime())) {
          throw new Error('Invalid end date');
        }
      } else {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }
      
      const exercisePayload = {
        ...allData,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        scope_exercise_type: allData.exercise_type
      };
      
      const payloadForAPI = { ...exercisePayload };
      delete payloadForAPI.id;
      
      if (isEditing && exerciseData.id) {
        await axios.put(`${API}/exercise-builder/${exerciseData.id}`, payloadForAPI);
        alert(`Step ${currentStep} saved successfully!`);
      } else {
        const response = await axios.post(`${API}/exercise-builder`, payloadForAPI);
        // Update the exercise ID for future saves
        if (response.data.id) {
          setExerciseData(prev => ({ ...prev, id: response.data.id }));
          setIsEditing(true);
        }
        alert(`Step ${currentStep} saved as draft!`);
      }
    } catch (error) {
      console.error('Error saving step:', error);
      alert('Error saving step. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveExercise = async () => {
    setLoading(true);
    try {
      // Validate and convert date strings to proper datetime format
      let startDate, endDate;
      
      if (exerciseData.start_date) {
        startDate = new Date(exerciseData.start_date + 'T' + (exerciseData.start_time || '00:00'));
        if (isNaN(startDate.getTime())) {
          throw new Error('Invalid start date');
        }
      } else {
        // Use current date if no start date provided
        startDate = new Date();
      }
      
      if (exerciseData.end_date) {
        endDate = new Date(exerciseData.end_date + 'T' + (exerciseData.end_time || '23:59'));
        if (isNaN(endDate.getTime())) {
          throw new Error('Invalid end date');
        }
      } else {
        // Use start date + 1 day if no end date provided
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }
      
      // Log debug information about data being saved
      console.log('💾 Saving Exercise with Complete Data:');
      console.log('📝 Basic Exercise Data:', exerciseData);
      console.log('🎯 Goals:', goals);
      console.log('🔸 Objectives:', objectives);
      console.log('📅 Events:', events);
      console.log('⚙️ Functions:', functions);
      console.log('🏢 Organizations:', organizations);
      
      const exercisePayload = {
        ...exerciseData,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        scope_exercise_type: exerciseData.exercise_type,
        // Add all dynamic collections
        goals: goals,
        objectives: objectives,
        events: events,
        functions: functions,
        organizations: organizations,
        codeWords: codeWords,
        callsigns: callsigns,
        frequencies: frequencies,
        assumptions: assumptions,
        artificialities: artificialities,
        safetyConcerns: safetyConcerns
      };
      
      console.log('📦 Complete Payload Being Sent:', exercisePayload);
      
      // Remove id from payload for create operations, but keep it for updates
      const payloadForAPI = { ...exercisePayload };
      delete payloadForAPI.id;
      
      if (isEditing && exerciseData.id) {
        // Update existing exercise
        await axios.put(`${API}/exercise-builder/${exerciseData.id}`, payloadForAPI);
        alert('Exercise updated successfully!');
      } else {
        // Create new exercise
        await axios.post(`${API}/exercise-builder`, payloadForAPI);
        alert('Exercise saved successfully!');
      }
      
      // Clear URL parameters after saving and go back
      if (isEditing) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      onBack();
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error saving exercise. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadComponent = ({ imageType, title }) => (
    <div className="flex items-center space-x-6">
      <div className="w-32 h-32 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
        {imagePreview[imageType] ? (
          <img src={imagePreview[imageType]} alt={title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center">
            <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, imageType)}
            className="hidden"
            id={`${imageType}-upload`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`${imageType}-upload`).click()}
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 mr-3"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleCameraCapture(imageType)}
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
        </div>
        <p className="text-sm text-gray-400">Upload image or capture with camera</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Exercise
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="exercise_image" title="Exercise" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Exercise Name *</Label>
                  <Input
                    value={exerciseData.exercise_name}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, exercise_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Exercise Type *</Label>
                  <Select 
                    value={exerciseData.exercise_type} 
                    onValueChange={(value) => setExerciseData(prev => ({ ...prev, exercise_type: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select exercise type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {exerciseTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white focus:bg-gray-600">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Description *</Label>
                  <Textarea
                    value={exerciseData.exercise_description}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, exercise_description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Location *</Label>
                  <Input
                    value={exerciseData.location}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Start Date *</Label>
                    <Input
                      type="date"
                      value={exerciseData.start_date}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Start Time</Label>
                    <Input
                      type="time"
                      value={exerciseData.start_time}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, start_time: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">End Date *</Label>
                    <Input
                      type="date"
                      value={exerciseData.end_date}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">End Time</Label>
                    <Input
                      type="time"
                      value={exerciseData.end_time}
                      onChange={(e) => setExerciseData(prev => ({ ...prev, end_time: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 2: // Scope
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Scope Description</Label>
                  <Textarea
                    value={exerciseData.scope_description}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Hazards</Label>
                  <Textarea
                    value={exerciseData.scope_hazards}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_hazards: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Geographic Area</Label>
                  <Textarea
                    value={exerciseData.scope_geographic_area}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_geographic_area: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Functions</Label>
                  <Textarea
                    value={exerciseData.scope_functions}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_functions: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Organizations</Label>
                  <Textarea
                    value={exerciseData.scope_organizations}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_organizations: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Personnel</Label>
                  <Textarea
                    value={exerciseData.scope_personnel}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scope_personnel: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Exercise Type (Copied from Step 1)</Label>
                  <Input
                    value={exerciseData.exercise_type}
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 3: // Purpose
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-gray-300">Purpose Description</Label>
                  <Textarea
                    value={exerciseData.purpose_description}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, purpose_description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                    placeholder="Describe the overall purpose and intent of this exercise..."
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 4: // Scenario
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Scenario Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="scenario_image" title="Scenario" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Scenario Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Scenario Name</Label>
                  <Input
                    value={exerciseData.scenario_name}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scenario_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Scenario Description</Label>
                  <Textarea
                    value={exerciseData.scenario_description}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, scenario_description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Latitude</Label>
                    <Input
                      type="text"
                      value={exerciseData.scenario_latitude}
                      onChange={handleScenarioLatitudeChange}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="45.1234"
                    />
                    {scenarioValidationErrors.latitude && (
                      <p className="text-red-500 text-sm mt-1">{scenarioValidationErrors.latitude}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-300">Longitude</Label>
                    <Input
                      type="text"
                      value={exerciseData.scenario_longitude}
                      onChange={handleScenarioLongitudeChange}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="97.0000"
                    />
                    {scenarioValidationErrors.longitude && (
                      <p className="text-red-500 text-sm mt-1">{scenarioValidationErrors.longitude}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 5: // Goals
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Goals</CardTitle>
                <CardDescription className="text-gray-400">
                  Define the high-level goals for this exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Goal Name</Label>
                  <Input
                    value={currentGoal.name}
                    onChange={(e) => setCurrentGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Test emergency notification systems"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Goal Description</Label>
                  <Textarea
                    value={currentGoal.description}
                    onChange={(e) => setCurrentGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this goal in detail..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Goal Achieved</Label>
                  <RadioGroup 
                    value={currentGoal.achieved} 
                    onValueChange={(value) => setCurrentGoal(prev => ({ ...prev, achieved: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="goal-yes" />
                      <Label htmlFor="goal-yes" className="text-green-400">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Partial" id="goal-partial" />
                      <Label htmlFor="goal-partial" className="text-yellow-400">Partial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="goal-no" />
                      <Label htmlFor="goal-no" className="text-red-400">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={addGoal}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                  <Button 
                    onClick={saveStepDraft}
                    disabled={loading}
                    variant="outline"
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Step'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Display added goals */}
            {goals.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Goals ({goals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <div key={goal.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{goal.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              goal.achieved === 'Yes' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                              goal.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                              'bg-red-500/20 text-red-300 border-red-500/30'
                            }>
                              {goal.achieved}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeGoal(goal.id)}
                              className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 6: // Objectives
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Objectives</CardTitle>
                <CardDescription className="text-gray-400">
                  Define specific, measurable objectives to be tested
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Objective Name</Label>
                  <Input
                    value={currentObjective.name}
                    onChange={(e) => setCurrentObjective(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Activate EOC within 30 minutes"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Objective Description</Label>
                  <Textarea
                    value={currentObjective.description}
                    onChange={(e) => setCurrentObjective(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the specific objective to be measured..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Objective Achieved</Label>
                  <RadioGroup 
                    value={currentObjective.achieved} 
                    onValueChange={(value) => setCurrentObjective(prev => ({ ...prev, achieved: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="obj-yes" />
                      <Label htmlFor="obj-yes" className="text-green-400">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Partial" id="obj-partial" />
                      <Label htmlFor="obj-partial" className="text-yellow-400">Partial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="obj-no" />
                      <Label htmlFor="obj-no" className="text-red-400">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={addObjective}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                  <Button 
                    onClick={saveStepDraft}
                    disabled={loading}
                    variant="outline"
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Step'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Display added objectives */}
            {objectives.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Objectives ({objectives.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {objectives.map((objective) => (
                      <div key={objective.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{objective.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              objective.achieved === 'Yes' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                              objective.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                              'bg-red-500/20 text-red-300 border-red-500/30'
                            }>
                              {objective.achieved}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeObjective(objective.id)}
                              className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{objective.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 7: // Events
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Event Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="event_image" title="Event" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Events</CardTitle>
                <CardDescription className="text-gray-400">
                  Define key events within the exercise timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Event Name</Label>
                  <Input
                    value={currentEvent.name}
                    onChange={(e) => setCurrentEvent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Initial Emergency Notification"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Event Description</Label>
                  <Textarea
                    value={currentEvent.description}
                    onChange={(e) => setCurrentEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the event in detail..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Anticipated Actions</Label>
                  <Textarea
                    value={currentEvent.actions}
                    onChange={(e) => setCurrentEvent(prev => ({ ...prev, actions: e.target.value }))}
                    placeholder="What actions are expected from participants?"
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Latitude</Label>
                    <Input
                      type="text"
                      value={currentEvent.latitude}
                      onChange={handleEventLatitudeChange}
                      placeholder="45.1234"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {eventValidationErrors.latitude && (
                      <p className="text-red-500 text-sm mt-1">{eventValidationErrors.latitude}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-300">Longitude</Label>
                    <Input
                      type="text"
                      value={currentEvent.longitude}
                      onChange={handleEventLongitudeChange}
                      placeholder="97.0000"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {eventValidationErrors.longitude && (
                      <p className="text-red-500 text-sm mt-1">{eventValidationErrors.longitude}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Start Date</Label>
                    <Input
                      type="date"
                      value={currentEvent.start_date}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, start_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Start Time</Label>
                    <Input
                      type="time"
                      value={currentEvent.start_time}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, start_time: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">End Date</Label>
                    <Input
                      type="date"
                      value={currentEvent.end_date}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, end_date: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">End Time</Label>
                    <Input
                      type="time"
                      value={currentEvent.end_time}
                      onChange={(e) => setCurrentEvent(prev => ({ ...prev, end_time: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Tier Scale</Label>
                  <Select value={currentEvent.tier_scale} onValueChange={(value) => setCurrentEvent(prev => ({ ...prev, tier_scale: value }))}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select tier scale" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="tier1" className="text-white">Tier 1: Incident - Moderately disruptive event</SelectItem>
                      <SelectItem value="tier2" className="text-white">Tier 2: Emergency - Disruptive event requiring external assistance</SelectItem>
                      <SelectItem value="tier3" className="text-white">Tier 3: Disaster - Significant event with severe impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Escalation Value</Label>
                  <RadioGroup 
                    value={currentEvent.escalation_value} 
                    onValueChange={(value) => setCurrentEvent(prev => ({ ...prev, escalation_value: value }))}
                    className="grid grid-cols-5 gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="esc-none" />
                      <Label htmlFor="esc-none" className="bg-gray-500 text-white px-2 py-1 rounded text-sm">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="esc-low" />
                      <Label htmlFor="esc-low" className="bg-green-600 text-white px-2 py-1 rounded text-sm">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="confirm" id="esc-confirm" />
                      <Label htmlFor="esc-confirm" className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">Confirm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warning" id="esc-warning" />
                      <Label htmlFor="esc-warning" className="bg-orange-600 text-white px-2 py-1 rounded text-sm">Warning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="danger" id="esc-danger" />
                      <Label htmlFor="esc-danger" className="bg-red-600 text-white px-2 py-1 rounded text-sm">Danger</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={addEvent} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </CardContent>
            </Card>

            {/* Added Events Display */}
            {events.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Events ({events.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{event.name}</h3>
                            <p className="text-gray-300 text-sm">{event.description}</p>
                            <div className="mt-2 flex space-x-4 text-xs text-gray-400">
                              <span>Start: {event.start_date} {event.start_time}</span>
                              <span>End: {event.end_date} {event.end_time}</span>
                              <span>Tier: {event.tier_scale}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeEvent(event.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 8: // Functions
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Functions</CardTitle>
                <CardDescription className="text-gray-400">
                  Define the functions to be exercised and tested
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Function Name</Label>
                  <Input
                    value={currentFunction.name}
                    onChange={(e) => setCurrentFunction(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Emergency Communications"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Function Description</Label>
                  <Textarea
                    value={currentFunction.description}
                    onChange={(e) => setCurrentFunction(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the function being tested..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Function Achieved</Label>
                  <RadioGroup 
                    value={currentFunction.achieved} 
                    onValueChange={(value) => setCurrentFunction(prev => ({ ...prev, achieved: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="func-yes" />
                      <Label htmlFor="func-yes" className="text-green-400">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Partial" id="func-partial" />
                      <Label htmlFor="func-partial" className="text-yellow-400">Partial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="func-no" />
                      <Label htmlFor="func-no" className="text-red-400">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button onClick={addFunction} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Function
                </Button>
              </CardContent>
            </Card>

            {/* Added Functions Display */}
            {functions.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Functions ({functions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {functions.map((func) => (
                      <div key={func.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{func.name}</h3>
                            <p className="text-gray-300 text-sm">{func.description}</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                              func.achieved === 'Yes' ? 'bg-green-600 text-white' :
                              func.achieved === 'Partial' ? 'bg-yellow-600 text-white' :
                              'bg-red-600 text-white'
                            }`}>
                              {func.achieved}
                            </span>
                          </div>
                          <Button
                            onClick={() => removeFunction(func.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 9: // Injections (MSEL Integration)
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Injections</CardTitle>
                <CardDescription className="text-gray-400">
                  Import MSEL events for this exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <div className="flex items-center space-x-3">
                    <ClipboardList className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="text-blue-300 font-semibold">MSEL Integration</h3>
                      <p className="text-gray-400 text-sm">Import events from Master Sequence Event List</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => window.open('#msel', '_blank')}
                  >
                    Open MSEL
                  </Button>
                </div>
                <div>
                  <Label className="text-gray-300">Exercise ID for MSEL Linking</Label>
                  <Input
                    placeholder="Enter exercise ID to link MSEL events"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Import MSEL Events
                </Button>
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 10: // Organizations
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Organization Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="org_image" title="Organization" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Organizations</CardTitle>
                <CardDescription className="text-gray-400">
                  Add organizations participating in the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Organization Name</Label>
                  <Input
                    value={currentOrganization.name}
                    onChange={(e) => setCurrentOrganization(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., City Emergency Services"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={currentOrganization.description}
                    onChange={(e) => setCurrentOrganization(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the organization's role..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Home Base</Label>
                  <Input
                    value={currentOrganization.home_base}
                    onChange={(e) => setCurrentOrganization(prev => ({ ...prev, home_base: e.target.value }))}
                    placeholder="Organization headquarters or base location"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Latitude</Label>
                    <Input
                      type="text"
                      value={currentOrganization.latitude}
                      onChange={handleOrganizationLatitudeChange}
                      placeholder="45.1234"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {organizationValidationErrors.latitude && (
                      <p className="text-red-500 text-sm mt-1">{organizationValidationErrors.latitude}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-300">Longitude</Label>
                    <Input
                      type="text"
                      value={currentOrganization.longitude}
                      onChange={handleOrganizationLongitudeChange}
                      placeholder="97.0000"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {organizationValidationErrors.longitude && (
                      <p className="text-red-500 text-sm mt-1">{organizationValidationErrors.longitude}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Contact First Name</Label>
                    <Input
                      value={currentOrganization.contact_first_name}
                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, contact_first_name: e.target.value }))}
                      placeholder="First name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Contact Last Name</Label>
                    <Input
                      value={currentOrganization.contact_last_name}
                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, contact_last_name: e.target.value }))}
                      placeholder="Last name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Contact Cell Phone</Label>
                    <Input
                      value={currentOrganization.contact_phone}
                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, contact_phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Contact Email</Label>
                    <Input
                      type="email"
                      value={currentOrganization.contact_email}
                      onChange={(e) => setCurrentOrganization(prev => ({ ...prev, contact_email: e.target.value }))}
                      placeholder="contact@organization.com"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <Button onClick={addOrganization} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Organization
                </Button>
              </CardContent>
            </Card>

            {/* Added Organizations Display */}
            {organizations.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Organizations ({organizations.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizations.map((org) => (
                      <div key={org.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{org.name}</h3>
                            <p className="text-gray-300 text-sm">{org.description}</p>
                            <div className="mt-2 text-xs text-gray-400 space-y-1">
                              <div>Home Base: {org.home_base}</div>
                              <div>Contact: {org.contact_first_name} {org.contact_last_name}</div>
                              <div>Phone: {org.contact_phone} | Email: {org.contact_email}</div>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeOrganization(org.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 11: // Team Coordinators
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Team Coordinators</CardTitle>
                <CardDescription className="text-gray-400">
                  Select participants who will serve as team coordinators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="text-green-300 font-semibold">Participant Integration</h3>
                      <p className="text-gray-400 text-sm">Import eligible participants with coordinator roles</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    onClick={loadCoordinators}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load Coordinators'}
                  </Button>
                </div>
                <div className="bg-gray-700/50 p-4 rounded">
                  <p className="text-gray-400 text-sm">
                    Coordinators will be automatically selected from participants with the following roles:
                  </p>
                  <ul className="text-gray-400 text-sm mt-2 space-y-1">
                    <li>• Incident Commander</li>
                    <li>• Operations Chief</li>
                    <li>• Planning Chief</li>
                    <li>• Logistics Chief</li>
                    <li>• Finance Chief</li>
                    <li>• Participants with "Coordinator" in position title</li>
                  </ul>
                </div>
                
                {/* Display loaded coordinators */}
                {(editingExercise?.coordinators?.length > 0 || exerciseData?.coordinators?.length > 0) && (
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-green-400 text-lg">Loaded Coordinators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(editingExercise?.coordinators || exerciseData?.coordinators || []).map((coordinator, index) => (
                          <div key={coordinator.id || index} className="bg-gray-800 p-4 rounded border border-gray-600">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-white">{coordinator.name}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                                  <div><span className="text-gray-400">Role:</span> {coordinator.role}</div>
                                  <div><span className="text-gray-400">Email:</span> {coordinator.email || 'N/A'}</div>
                                  <div><span className="text-gray-400">Phone:</span> {coordinator.phone || 'N/A'}</div>
                                  <div><span className="text-gray-400">Assigned to:</span> {coordinator.assignedTo || 'N/A'}</div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                                onClick={() => {
                                  const updatedCoordinators = (editingExercise?.coordinators || exerciseData?.coordinators || []).filter((_, i) => i !== index);
                                  if (editingExercise) {
                                    setEditingExercise(prev => ({ ...prev, coordinators: updatedCoordinators }));
                                  } else {
                                    setExerciseData(prev => ({ ...prev, coordinators: updatedCoordinators }));
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-gray-400">
                        Total coordinators: {(editingExercise?.coordinators || exerciseData?.coordinators || []).length}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 12: // Code Words
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Code Word Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="code_image" title="Code Word" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Code Words</CardTitle>
                <CardDescription className="text-gray-400">
                  Define code words used during the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Code Word</Label>
                  <Input
                    value={currentCodeWord.word}
                    onChange={(e) => setCurrentCodeWord(prev => ({ ...prev, word: e.target.value }))}
                    placeholder="e.g., THUNDERBOLT"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Definition</Label>
                  <Textarea
                    value={currentCodeWord.meaning}
                    onChange={(e) => setCurrentCodeWord(prev => ({ ...prev, meaning: e.target.value }))}
                    placeholder="Define what this code word means..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <Button onClick={addCodeWord} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Code Word
                </Button>
              </CardContent>
            </Card>

            {/* Added Code Words Display */}
            {codeWords.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Code Words ({codeWords.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {codeWords.map((codeWord) => (
                      <div key={codeWord.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{codeWord.word}</h3>
                            <p className="text-gray-300 text-sm mt-1">{codeWord.meaning}</p>
                          </div>
                          <Button
                            onClick={() => removeCodeWord(codeWord.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 13: // Callsigns
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Callsign Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="callsign_image" title="Callsign" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Communication Callsigns</CardTitle>
                <CardDescription className="text-gray-400">
                  Define radio callsigns for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Callsign</Label>
                  <Input
                    value={currentCallsign.callsign}
                    onChange={(e) => setCurrentCallsign(prev => ({ ...prev, callsign: e.target.value }))}
                    placeholder="e.g., COMMAND-1"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Definition</Label>
                  <Textarea
                    value={currentCallsign.description}
                    onChange={(e) => setCurrentCallsign(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Define the role or position for this callsign..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <Button onClick={addCallsign} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Callsign
                </Button>
              </CardContent>
            </Card>

            {/* Added Callsigns Display */}
            {callsigns.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Callsigns ({callsigns.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {callsigns.map((callsign) => (
                      <div key={callsign.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{callsign.callsign}</h3>
                            <p className="text-gray-300 text-sm mt-1">{callsign.description}</p>
                          </div>
                          <Button
                            onClick={() => removeCallsign(callsign.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 14: // Communication Frequencies
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Frequency Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="freq_image" title="Communication Frequency" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Communication Frequencies</CardTitle>
                <CardDescription className="text-gray-400">
                  Define radio frequencies and settings for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Frequency Name</Label>
                    <Input
                      value={currentFrequency.frequency || ''}
                      onChange={(e) => setCurrentFrequency(prev => ({ ...prev, frequency: e.target.value }))}
                      placeholder="e.g., Command Net"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Frequency (MHz)</Label>
                    <Input
                      value={currentFrequency.type || ''}
                      onChange={(e) => setCurrentFrequency(prev => ({ ...prev, type: e.target.value }))}
                      placeholder="e.g., 155.475"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={currentFrequency.description || ''}
                    onChange={(e) => setCurrentFrequency(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the usage of this frequency..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Tone (Hz)</Label>
                    <Select 
                      value={currentFrequency.tone || ''} 
                      onValueChange={(value) => setCurrentFrequency(prev => ({ ...prev, tone: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                        {['71.9', '74.4', '77.0', '79.7', '82.5', '85.4', '88.5', '91.5', '94.8', '97.4', '100.0', '103.5', '107.2', '110.9', '114.8', '118.8', '123.0', '127.3'].map((tone) => (
                          <SelectItem key={tone} value={tone} className="text-white">{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Offset</Label>
                    <Select 
                      value={currentFrequency.offset || ''} 
                      onValueChange={(value) => setCurrentFrequency(prev => ({ ...prev, offset: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select offset" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="negative" className="text-white">Negative</SelectItem>
                        <SelectItem value="positive" className="text-white">Positive</SelectItem>
                        <SelectItem value="simplex" className="text-white">Simplex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Channel</Label>
                    <Input
                      value={currentFrequency.channel || ''}
                      onChange={(e) => setCurrentFrequency(prev => ({ ...prev, channel: e.target.value }))}
                      placeholder="e.g., 1"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Radio Type</Label>
                    <Select 
                      value={currentFrequency.radio_type || ''} 
                      onValueChange={(value) => setCurrentFrequency(prev => ({ ...prev, radio_type: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select radio type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="handheld" className="text-white">Handheld</SelectItem>
                        <SelectItem value="mobile" className="text-white">Mobile</SelectItem>
                        <SelectItem value="base_station" className="text-white">Base Station</SelectItem>
                        <SelectItem value="repeater" className="text-white">Repeater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Primary/Backup</Label>
                  <Select 
                    value={currentFrequency.primary_backup || 'Primary'} 
                    onValueChange={(value) => setCurrentFrequency(prev => ({ ...prev, primary_backup: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="Primary" className="text-white">Primary</SelectItem>
                      <SelectItem value="Backup" className="text-white">Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addFrequency} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Frequency
                </Button>
              </CardContent>
            </Card>

            {/* Added Frequencies Display */}
            {frequencies.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Frequencies ({frequencies.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {frequencies.map((freq) => (
                      <div key={freq.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{freq.frequency}</h3>
                            <p className="text-gray-300 text-sm mt-1">{freq.description}</p>
                            <div className="mt-2 text-xs text-gray-400 grid grid-cols-2 gap-2">
                              <span>Frequency: {freq.type}</span>
                              <span>Type: {freq.primary_backup}</span>
                              <span>Tone: {freq.tone || 'Not set'}</span>
                              <span>Radio: {freq.radio_type || 'Not set'}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeFrequency(freq.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 15: // Assumptions
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Assumption Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="assumption_image" title="Assumption" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Assumptions</CardTitle>
                <CardDescription className="text-gray-400">
                  Define assumptions made for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Assumption Name</Label>
                  <Input
                    value={currentAssumption.assumption || ''}
                    onChange={(e) => setCurrentAssumption(prev => ({ ...prev, assumption: e.target.value }))}
                    placeholder="e.g., Weather Conditions"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Assumption Description</Label>
                  <Textarea
                    value={currentAssumption.description || ''}
                    onChange={(e) => setCurrentAssumption(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the assumption being made..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <Button onClick={addAssumption} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assumption
                </Button>
              </CardContent>
            </Card>

            {/* Added Assumptions Display */}
            {assumptions.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Assumptions ({assumptions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assumptions.map((assumption) => (
                      <div key={assumption.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{assumption.assumption}</h3>
                            <p className="text-gray-300 text-sm mt-1">{assumption.description}</p>
                          </div>
                          <Button
                            onClick={() => removeAssumption(assumption.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 16: // Artificialities
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Artificiality Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="artificiality_image" title="Artificiality" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Exercise Artificialities</CardTitle>
                <CardDescription className="text-gray-400">
                  Define artificial constraints or limitations for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Artificiality Name</Label>
                  <Input
                    value={currentArtificiality.artificiality || ''}
                    onChange={(e) => setCurrentArtificiality(prev => ({ ...prev, artificiality: e.target.value }))}
                    placeholder="e.g., Simulated Resource Limitations"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Artificiality Description</Label>
                  <Textarea
                    value={currentArtificiality.description || ''}
                    onChange={(e) => setCurrentArtificiality(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the artificial constraint or limitation..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <Button onClick={addArtificiality} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Artificiality
                </Button>
              </CardContent>
            </Card>

            {/* Added Artificialities Display */}
            {artificialities.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Added Artificialities ({artificialities.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {artificialities.map((artificiality) => (
                      <div key={artificiality.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{artificiality.artificiality}</h3>
                            <p className="text-gray-300 text-sm mt-1">{artificiality.description}</p>
                          </div>
                          <Button
                            onClick={() => removeArtificiality(artificiality.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );

      case 17: // Safety
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Safety Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadComponent imageType="safety_image" title="Safety" />
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Safety Officer Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Safety officer details are automatically populated from participants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="h-6 w-6 text-green-400" />
                    <h3 className="text-green-300 font-semibold">Current Safety Officer</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-300">First Name</Label>
                      <Input 
                        placeholder="Auto-populated"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Last Name</Label>
                      <Input 
                        placeholder="Auto-populated"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Cell Phone</Label>
                      <Input 
                        placeholder="Auto-populated"
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10 mt-3"
                  >
                    Load Safety Officer Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-500">Safety Concerns</CardTitle>
                <CardDescription className="text-gray-400">
                  Document safety concerns and considerations for the exercise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Safety Concern Name</Label>
                  <Input
                    value={currentSafetyConcern.concern || ''}
                    onChange={(e) => setSafetyConcern(prev => ({ ...prev, concern: e.target.value }))}
                    placeholder="e.g., Vehicle Operations"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Safety Concern Description</Label>
                  <Textarea
                    value={currentSafetyConcern.description || ''}
                    onChange={(e) => setSafetyConcern(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the safety concern and mitigation measures..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Safety Officer Name</Label>
                    <Input
                      value={currentSafetyConcern.safety_officer || ''}
                      onChange={(e) => setSafetyConcern(prev => ({ ...prev, safety_officer: e.target.value }))}
                      placeholder="Responsible safety officer"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Officer Phone</Label>
                    <Input
                      value={currentSafetyConcern.phone || ''}
                      onChange={(e) => setSafetyConcern(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button onClick={addSafetyConcern} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Safety Concern
                </Button>
              </CardContent>
            </Card>

            {/* Added Safety Concerns Display */}
            {safetyConcerns.length > 0 && (
              <Card className="bg-gray-800 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-500">Added Safety Concerns ({safetyConcerns.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safetyConcerns.map((concern) => (
                      <div key={concern.id} className="p-4 bg-gray-700 rounded-lg border-l-4 border-red-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <ShieldAlert className="h-5 w-5 text-red-400" />
                              <h3 className="font-semibold text-white text-lg">{concern.concern}</h3>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{concern.description}</p>
                            <div className="text-xs text-gray-400">
                              <span>Safety Officer: {concern.safety_officer || 'Not assigned'}</span>
                              {concern.phone && <span> | Phone: {concern.phone}</span>}
                            </div>
                          </div>
                          <Button
                            onClick={() => removeSafetyConcern(concern.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Save Step Button */}
            <div className="flex justify-end">
              <Button 
                onClick={saveStepDraft}
                disabled={loading}
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Step'}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Sidebar Progress */}
        <div className="w-80 bg-gray-900 border-r border-orange-500/20 h-screen sticky top-0">
          <div className="p-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-400 hover:text-orange-500 mb-6 w-full justify-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h2 className="text-orange-500 font-bold text-lg mb-6">
              {isEditing ? 'Edit Exercise' : 'Exercise Builder'}
            </h2>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === step.number
                        ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                        : currentStep > step.number
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                    }`}
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep === step.number
                          ? 'bg-orange-500 text-black'
                          : currentStep > step.number
                          ? 'bg-green-500 text-black'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {currentStep > step.number ? '✓' : step.number}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{step.title}</div>
                        <div className="text-xs opacity-75">{step.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-orange-500 mb-2">
                Step {currentStep}: {steps[currentStep - 1]?.title}
              </h1>
              <p className="text-gray-400">{steps[currentStep - 1]?.description}</p>
            </div>

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-gray-600 text-gray-300"
              >
                Previous
              </Button>

              <div className="text-center">
                <span className="text-gray-400 text-sm">
                  Step {currentStep} of {steps.length}
                </span>
              </div>

              <div className="space-x-3">
                {currentStep === steps.length ? (
                  <Button
                    onClick={saveExercise}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? 'Saving...' : 'Complete Exercise'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={saveExercise}
                      disabled={loading}
                      className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-orange-500 hover:bg-orange-600 text-black"
                    >
                      Next
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExerciseBuilder = () => {
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check URL parameters for exercise ID to edit
    // Handle parameters in hash format: #builder?exercise=<id>
    const hash = window.location.hash;
    const queryStart = hash.indexOf('?');
    let exerciseId = null;
    
    if (queryStart !== -1) {
      const queryString = hash.substring(queryStart + 1);
      const urlParams = new URLSearchParams(queryString);
      exerciseId = urlParams.get('exercise');
    }
    
    if (exerciseId) {
      setLoading(true);
      fetchExerciseForEdit(exerciseId);
    }
  }, []);

  const fetchExerciseForEdit = async (exerciseId) => {
    try {
      const response = await axios.get(`${API}/exercise-builder/${exerciseId}`);
      setEditingExercise(response.data);
    } catch (error) {
      console.error('Error fetching exercise for edit:', error);
      alert('Error loading exercise for editing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading exercise for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <ExerciseBuilderWizard 
      onBack={() => window.history.back()} 
      editingExercise={editingExercise}
    />
  );
};

// Scope Modal Component
const ScopeModal = ({ isOpen, onClose, onSave, initialData = null, exerciseId }) => {
  const [scopeData, setScopeData] = useState({
    scope_description: '',
    scope_hazards: '',
    scope_geographic_area: '',
    scope_functions: '',
    scope_organizations: '',
    scope_personnel: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setScopeData({
        scope_description: initialData.scope_description || '',
        scope_hazards: initialData.scope_hazards || '',
        scope_geographic_area: initialData.scope_geographic_area || '',
        scope_functions: initialData.scope_functions || '',
        scope_organizations: initialData.scope_organizations || '',
        scope_personnel: initialData.scope_personnel || ''
      });
    } else {
      setScopeData({
        scope_description: '',
        scope_hazards: '',
        scope_geographic_area: '',
        scope_functions: '',
        scope_organizations: '',
        scope_personnel: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSave = async () => {
    console.log('🚀 ScopeModal handleSave called');
    console.log('📊 Current scopeData:', scopeData);
    console.log('🆔 Exercise ID:', exerciseId);
    
    setLoading(true);
    try {
      console.log('📡 Fetching current exercise data...');
      
      // First fetch the current exercise data to get all required fields
      const currentExerciseResponse = await axios.get(`${API}/exercise-builder/${exerciseId}`);
      const currentExercise = currentExerciseResponse.data;
      
      console.log('✅ Current exercise fetched:', currentExercise);
      
      // Merge the scope data with the existing exercise data
      // Ensure required fields have valid values
      const updatePayload = {
        ...currentExercise,
        // Provide defaults for required fields if they're empty
        exercise_type: currentExercise.exercise_type || 'Table Top',
        location: currentExercise.location || 'Not specified',
        start_time: currentExercise.start_time || '09:00',
        end_time: currentExercise.end_time || '17:00',
        // Update scope fields
        scope_description: scopeData.scope_description,
        scope_hazards: scopeData.scope_hazards,
        scope_geographic_area: scopeData.scope_geographic_area,
        scope_functions: scopeData.scope_functions,
        scope_organizations: scopeData.scope_organizations,
        scope_personnel: scopeData.scope_personnel
      };
      
      console.log('📦 Update payload prepared:', updatePayload);
      console.log('🔄 Sending PUT request to:', `${API}/exercise-builder/${exerciseId}`);
      
      const response = await axios.put(`${API}/exercise-builder/${exerciseId}`, updatePayload);
      
      console.log('✅ Save successful! Response:', response.data);
      
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('❌ Error saving scope:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      // Show error message to user
      alert(`Error saving scope data: ${error.response?.data?.detail || error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-orange-500">
            {initialData ? 'Edit Exercise Scope' : 'Add Exercise Scope'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label className="text-gray-300">Scope Description</Label>
            <Textarea
              value={scopeData.scope_description}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_description: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={3}
              placeholder="Describe the overall scope of this exercise..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Hazards</Label>
            <Textarea
              value={scopeData.scope_hazards}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_hazards: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="List the hazards to be addressed in this exercise..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Geographic Area</Label>
            <Textarea
              value={scopeData.scope_geographic_area}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_geographic_area: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="Define the geographic boundaries and areas involved..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Functions</Label>
            <Textarea
              value={scopeData.scope_functions}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_functions: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="Specify the emergency response functions to be exercised..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Organizations</Label>
            <Textarea
              value={scopeData.scope_organizations}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_organizations: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="List the organizations and agencies participating..."
            />
          </div>

          <div>
            <Label className="text-gray-300">Personnel</Label>
            <Textarea
              value={scopeData.scope_personnel}
              onChange={(e) => setScopeData(prev => ({ ...prev, scope_personnel: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={2}
              placeholder="Describe the personnel and roles involved..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-black"
          >
            {loading ? 'Saving...' : initialData ? 'Update Scope' : 'Add Scope'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Exercise Management Dashboard Component
const ExerciseManagementDashboard = ({ 
  exerciseId, 
  scribeTemplates, 
  currentTemplate, 
  scribeFormData, 
  scribeFormLoading, 
  scribeTimeErrors,
  setCurrentTemplate, 
  setScribeFormData, 
  setScribeFormLoading, 
  setScribeTimeErrors,
  loadScribeTemplates 
}) => {
  const { theme } = useTheme();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  
  // Modal states
  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const [editingScope, setEditingScope] = useState(null);
  
  // Exercise Steps menu expansion state
  const [exerciseStepsExpanded, setExerciseStepsExpanded] = useState(false);
  
  // Improvement menu expansion state
  const [improvementExpanded, setImprovementExpanded] = useState(true);

  // Evaluation state
  const [evaluationReports, setEvaluationReports] = useState([]);
  const [showAddEvaluation, setShowAddEvaluation] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);

  // Lessons Learned state
  const [lessonsLearned, setLessonsLearned] = useState([]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // Locations state (shared with Participants and Resources)
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  useEffect(() => {
    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  const fetchExercise = async () => {
    try {
      const response = await axios.get(`${API}/exercise-builder/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      console.error('Error fetching exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluationReports = async () => {
    try {
      setEvaluationLoading(true);
      const response = await axios.get(`${API}/evaluation-reports/exercise/${exerciseId}`);
      setEvaluationReports(response.data);
    } catch (error) {
      console.error('Error fetching evaluation reports:', error);
    } finally {
      setEvaluationLoading(false);
    }
  };
  const fetchLessonsLearned = async () => {
    try {
      setLessonsLoading(true);
      const response = await axios.get(`${API}/lessons-learned/exercise/${exerciseId}`);
      setLessonsLearned(response.data);
    } catch (error) {
      console.error('Error fetching lessons learned:', error);
    } finally {
      setLessonsLoading(false);
    }
  };

  const fetchLocations = async () => {
    setLocationsLoading(true);
    try {
      const response = await axios.get(`${API}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    } finally {
      setLocationsLoading(false);
    }
  };

  // Load evaluation reports, lessons learned, and locations when exercise is loaded
  useEffect(() => {
    if (exerciseId) {
      fetchExercise();
      fetchEvaluationReports();
      fetchLessonsLearned();
      fetchLocations();
    }
  }, [exerciseId]);

  const topLevelMenuItems = [
    { id: 'overview', title: 'Exercise Overview', icon: Shield }
  ];

  const exerciseStepsMenuItems = [
    { id: 'scope', title: 'Scope', icon: Target },
    { id: 'purpose', title: 'Purpose', icon: Flag },
    { id: 'scenario', title: 'Scenario', icon: Map },
    { id: 'goals', title: 'Goals', icon: Trophy },
    { id: 'events', title: 'Events', icon: Calendar },
    { id: 'functions', title: 'Functions', icon: Settings },
    { id: 'injections', title: 'Injections (MSEL)', icon: ClipboardList },
    { id: 'organizations', title: 'Organizations', icon: Building },
    { id: 'coordinators', title: 'Team Coordinators', icon: Users },
    { id: 'codewords', title: 'Code Words', icon: Key },
    { id: 'callsigns', title: 'Callsigns', icon: Radio },
    { id: 'frequencies', title: 'Communications', icon: Headphones },
    { id: 'assumptions', title: 'Assumptions', icon: MessageSquare },
    { id: 'artificialities', title: 'Artificialities', icon: AlertTriangle },
    { id: 'safety', title: 'Safety Concerns', icon: ShieldAlert },
  ];

  const improvementMenuItems = [
    { id: 'evaluations', title: 'Evaluations', icon: Star },
    { id: 'lessons_learned', title: 'Lessons Learned', icon: Lightbulb },
    { id: 'corrective_actions', title: 'Corrective Actions', icon: CheckCircle },
    { id: 'final_report', title: 'After Action Report', icon: FileText }
  ];

  // Combined for compatibility with existing code
  const exerciseMenuItems = [
    ...topLevelMenuItems,
    { id: 'exercise', title: 'Exercise Details', icon: FileText },
    { id: 'objectives', title: 'Objectives', icon: CheckCircle },
    ...exerciseStepsMenuItems,
    ...improvementMenuItems
  ];

  const getExerciseStatus = () => {
    if (!exercise) return 'Unknown';
    const now = new Date();
    const startDate = new Date(exercise.start_date);
    const endDate = new Date(exercise.end_date);
    
    if (now < startDate) return 'Planning';
    if (now >= startDate && now <= endDate) return 'Active';
    if (now > endDate) return 'Completed';
    return 'Scheduled';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Scheduled': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const renderExerciseOverview = () => {
    if (!exercise) return null;
    
    const status = getExerciseStatus();
    
    return (
      <div className="space-y-6">
        {/* Exercise Header */}
        <div className={`${theme.colors.tertiary} border ${theme.colors.border} rounded-lg p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-2`}>{exercise.exercise_name}</h1>
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(status)}>
                  {status}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {exercise.exercise_type}
                </Badge>
              </div>
            </div>
            {exercise.exercise_image && (
              <div className={`w-20 h-20 rounded-lg ${theme.colors.quaternary} overflow-hidden`}>
                <img src={exercise.exercise_image} alt={exercise.exercise_name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          
          <p className={`${theme.colors.textSecondary} mb-4`}>{exercise.exercise_description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${theme.colors.quaternary}/50 p-4 rounded-lg`}>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className={`text-sm font-medium ${theme.colors.textSecondary}`}>Location</span>
              </div>
              <p className={theme.colors.textPrimary}>{exercise.location || 'Not specified'}</p>
            </div>
            
            <div className={`${theme.colors.quaternary}/50 p-4 rounded-lg`}>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-orange-400" />
                <span className={`text-sm font-medium ${theme.colors.textSecondary}`}>Duration</span>
              </div>
              <p className={theme.colors.textPrimary}>
                {new Date(exercise.start_date).toLocaleDateString()} - {new Date(exercise.end_date).toLocaleDateString()}
              </p>
            </div>
            
            <div className={`${theme.colors.quaternary}/50 p-4 rounded-lg`}>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-orange-400" />
                <span className={`text-sm font-medium ${theme.colors.textSecondary}`}>Participants</span>
              </div>
              <p className={theme.colors.textPrimary}>{exercise.coordinators?.length || 0} Coordinators</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{exercise.goals?.length || 0}</div>
              <div className={`text-sm ${theme.colors.textMuted}`}>Goals</div>
            </CardContent>
          </Card>
          
          <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{exercise.objectives?.length || 0}</div>
              <div className={`text-sm ${theme.colors.textMuted}`}>Objectives</div>
            </CardContent>
          </Card>
          
          <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{exercise.events?.length || 0}</div>
              <div className={`text-sm ${theme.colors.textMuted}`}>Events</div>
            </CardContent>
          </Card>
          
          <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
            <CardContent className="p-4 text-center">
              <Building className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{exercise.organizations?.length || 0}</div>
              <div className={`text-sm ${theme.colors.textMuted}`}>Organizations</div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Preparedness Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exercise Timeline */}
          <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
            <CardHeader>
              <CardTitle className="text-orange-500 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Exercise Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <div className={`${theme.colors.textPrimary} font-medium`}>Exercise Start</div>
                    <div className={`text-sm ${theme.colors.textMuted}`}>
                      {new Date(exercise.start_date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className={`${theme.colors.textPrimary} font-medium`}>Exercise End</div>
                    <div className={`text-sm ${theme.colors.textMuted}`}>
                      {new Date(exercise.end_date).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Information */}
          <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center">
                <ShieldAlert className="h-5 w-5 mr-2" />
                Safety Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`${theme.colors.textPrimary} font-medium`}>Safety Concerns: {exercise.safetyConcerns?.length || 0}</div>
                <div className={`text-sm ${theme.colors.textMuted}`}>
                  {exercise.safetyConcerns?.length > 0 ? 
                    "Safety protocols have been documented for this exercise." : 
                    "No specific safety concerns documented."
                  }
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => setActiveSection('safety')}
                >
                  View Safety Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
          <CardHeader>
            <CardTitle className="text-orange-500">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-black"
                onClick={() => window.location.href = `#builder?exercise=${exercise.id}`}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Exercise
              </Button>
              <Button 
                variant="outline" 
                className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                onClick={() => setActiveSection('scribe')}
              >
                <PenTool className="h-4 w-4 mr-2" />
                Scribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSectionContent = () => {
    if (activeSection === 'overview') {
      return renderExerciseOverview();
    }
    
    // Render specific management interfaces for each section
    switch (activeSection) {
      case 'scope':
        return renderScopeManagement();
      case 'goals':
        return renderGoalsManagement();
      case 'objectives':
        return renderObjectivesManagement();
      case 'events':
        return renderEventsManagement();
      case 'safety':
        return renderSafetyManagement();
      case 'evaluations':
        return renderEvaluationsManagement();
      case 'lessons_learned':
        return renderLessonsLearnedManagement();
      case 'corrective_actions':
        return renderCorrectiveActionsManagement();
      case 'final_report':
        return renderFinalReportManagement();
      case 'scribe':
        return renderScribeManagement();
      case 'scribe_form':
        return renderScribeFormManagement();
      default:
        return renderGenericSectionManagement();
    }
  };

  const handleScopeUpdate = (updatedExercise) => {
    setExercise(updatedExercise);
  };

  const renderScopeManagement = () => {
    const hasScope = exercise?.scope_description || exercise?.scope_hazards || 
                    exercise?.scope_geographic_area || exercise?.scope_functions || 
                    exercise?.scope_organizations || exercise?.scope_personnel;

    // Print function for Scope
    const printScope = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise Scope - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
              .scope-section { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
              .scope-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; }
              .scope-content { margin-bottom: 10px; color: #666; line-height: 1.6; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Scope</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p>Exercise Type: ${exercise.exercise_type || 'N/A'}</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="scope-content">
              ${exercise.scope_description ? `
                <div class="scope-section">
                  <div class="scope-title">Description</div>
                  <div class="scope-content">${exercise.scope_description}</div>
                </div>
              ` : ''}
              ${exercise.scope_hazards ? `
                <div class="scope-section">
                  <div class="scope-title">Hazards</div>
                  <div class="scope-content">${exercise.scope_hazards}</div>
                </div>
              ` : ''}
              ${exercise.scope_geographic_area ? `
                <div class="scope-section">
                  <div class="scope-title">Geographic Area</div>
                  <div class="scope-content">${exercise.scope_geographic_area}</div>
                </div>
              ` : ''}
              ${exercise.scope_functions ? `
                <div class="scope-section">
                  <div class="scope-title">Functions</div>
                  <div class="scope-content">${exercise.scope_functions}</div>
                </div>
              ` : ''}
              ${exercise.scope_organizations ? `
                <div class="scope-section">
                  <div class="scope-title">Organizations</div>
                  <div class="scope-content">${exercise.scope_organizations}</div>
                </div>
              ` : ''}
              ${exercise.scope_personnel ? `
                <div class="scope-section">
                  <div class="scope-title">Personnel</div>
                  <div class="scope-content">${exercise.scope_personnel}</div>
                </div>
              ` : ''}
              ${!hasScope ? '<p>No scope information has been defined for this exercise.</p>' : ''}
            </div>
            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Scope</h1>
          <div className="flex space-x-3">
            {hasScope && (
              <Button 
                variant="outline"
                className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                onClick={printScope}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Scope
              </Button>
            )}
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {
                setEditingScope(hasScope ? exercise : null);
                setScopeModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {hasScope ? 'Edit Scope' : 'Add Scope'}
            </Button>
          </div>
        </div>

        {/* Scope Display */}
        {hasScope ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-6">
                {exercise.scope_description && (
                  <div>
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">Description</h3>
                    <p className="text-gray-300">{exercise.scope_description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exercise.scope_hazards && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Hazards</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_hazards}</p>
                      </div>
                    </div>
                  )}

                  {exercise.scope_geographic_area && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Geographic Area</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_geographic_area}</p>
                      </div>
                    </div>
                  )}

                  {exercise.scope_functions && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Functions</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_functions}</p>
                      </div>
                    </div>
                  )}

                  {exercise.scope_organizations && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Organizations</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_organizations}</p>
                      </div>
                    </div>
                  )}

                  {exercise.scope_personnel && (
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Personnel</h4>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">{exercise.scope_personnel}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                  <Button 
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => {
                      setEditingScope(exercise);
                      setScopeModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Scope
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-800 border-gray-700 border-dashed">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Scope Defined</h3>
              <p className="text-gray-500 mb-4">
                Define the exercise scope including hazards, geographic area, functions, organizations, and personnel.
              </p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-black"
                onClick={() => {
                  setEditingScope(null);
                  setScopeModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Scope
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Exercise Details Context */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Exercise Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Location:</span>
                <p className="text-white">{exercise?.location || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-gray-400">Start Date:</span>
                <p className="text-white">{exercise?.start_date || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">End Date:</span>
                <p className="text-white">{exercise?.end_date || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">Exercise Type:</span>
                <p className="text-white">{exercise?.exercise_type || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGoalsManagement = () => {
    // Print function for Goals
    const printGoals = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise Goals - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
              .goal-item { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
              .goal-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .goal-description { margin-bottom: 10px; color: #666; }
              .goal-status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
              .status-yes { background-color: #d4edda; color: #155724; }
              .status-partial { background-color: #fff3cd; color: #856404; }
              .status-no { background-color: #f8d7da; color: #721c24; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Goals</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p>Exercise Type: ${exercise.exercise_type || 'N/A'}</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="goals-content">
              ${exercise.goals && exercise.goals.length > 0 ? 
                exercise.goals.map((goal, index) => `
                  <div class="goal-item">
                    <div class="goal-title">${index + 1}. ${goal.name || 'Unnamed Goal'}</div>
                    <div class="goal-description">${goal.description || 'No description provided'}</div>
                    <div class="goal-status ${
                      goal.achieved === 'Yes' ? 'status-yes' :
                      goal.achieved === 'Partial' ? 'status-partial' :
                      'status-no'
                    }">
                      Status: ${goal.achieved || 'No'}
                    </div>
                  </div>
                `).join('') 
                : '<p>No goals have been defined for this exercise.</p>'
              }
            </div>
            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Goals</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printGoals}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Goals
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {/* Add new goal logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {exercise.goals && exercise.goals.length > 0 ? (
            exercise.goals.map((goal, index) => (
              <Card key={goal.id || index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{goal.name}</h3>
                      <p className="text-gray-300 mb-3">{goal.description}</p>
                      <Badge className={
                        goal.achieved === 'Yes' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        goal.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }>
                        Status: {goal.achieved}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Goals Yet</h3>
                <p className="text-gray-500 mb-4">Add exercise goals to track progress and success criteria.</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderObjectivesManagement = () => {
    // Print function for Objectives
    const printObjectives = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise Objectives - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
              .objective-item { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
              .objective-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .objective-description { margin-bottom: 10px; color: #666; }
              .objective-status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
              .status-yes { background-color: #d4edda; color: #155724; }
              .status-partial { background-color: #fff3cd; color: #856404; }
              .status-no { background-color: #f8d7da; color: #721c24; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Objectives</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p>Exercise Type: ${exercise.exercise_type || 'N/A'}</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="objectives-content">
              ${exercise.objectives && exercise.objectives.length > 0 ? 
                exercise.objectives.map((objective, index) => `
                  <div class="objective-item">
                    <div class="objective-title">${index + 1}. ${objective.name || 'Unnamed Objective'}</div>
                    <div class="objective-description">${objective.description || 'No description provided'}</div>
                    <div class="objective-status ${
                      objective.achieved === 'Yes' ? 'status-yes' :
                      objective.achieved === 'Partial' ? 'status-partial' :
                      'status-no'
                    }">
                      Status: ${objective.achieved || 'No'}
                    </div>
                  </div>
                `).join('') 
                : '<p>No objectives have been defined for this exercise.</p>'
              }
            </div>
            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Objectives</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printObjectives}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Objectives
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {/* Add new objective logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          </div>
        </div>

        {/* Objectives List */}
        <div className="space-y-4">
          {exercise.objectives && exercise.objectives.length > 0 ? (
            exercise.objectives.map((objective, index) => (
              <Card key={objective.id || index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{objective.name}</h3>
                      <p className="text-gray-300 mb-3">{objective.description}</p>
                      <Badge className={
                        objective.achieved === 'Yes' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        objective.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }>
                        Status: {objective.achieved}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Objectives Yet</h3>
                <p className="text-gray-500 mb-4">Add specific objectives to measure exercise success.</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Objective
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderEventsManagement = () => {
    // Print function for Events
    const printEvents = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise Events - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
              .event-item { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
              .event-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .event-description { margin-bottom: 10px; color: #666; }
              .event-details { margin-bottom: 5px; font-size: 14px; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Events</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p>Exercise Type: ${exercise.exercise_type || 'N/A'}</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="events-content">
              ${exercise.events && exercise.events.length > 0 ? 
                exercise.events.map((event, index) => `
                  <div class="event-item">
                    <div class="event-title">${index + 1}. ${event.name || 'Unnamed Event'}</div>
                    <div class="event-description">${event.description || 'No description provided'}</div>
                    <div class="event-details"><strong>Time:</strong> ${event.time || 'Not specified'}</div>
                    <div class="event-details"><strong>Location:</strong> ${event.location || 'Not specified'}</div>
                    ${event.latitude && event.longitude ? `<div class="event-details"><strong>Coordinates:</strong> ${event.latitude}, ${event.longitude}</div>` : ''}
                  </div>
                `).join('') 
                : '<p>No events have been defined for this exercise.</p>'
              }
            </div>
            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Events</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printEvents}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Events
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {/* Add new event logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {exercise.events && exercise.events.length > 0 ? (
            exercise.events.map((event, index) => (
              <Card key={event.id || index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
                      <p className="text-gray-300 mb-3">{event.description}</p>
                      <div className="flex space-x-4 text-sm text-gray-400">
                        <span>Start: {event.startTime || 'Not set'}</span>
                        <span>End: {event.endTime || 'Not set'}</span>
                        <span>Tier: {event.tierScale || 'Not set'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Events Yet</h3>
                <p className="text-gray-500 mb-4">Add events to create the exercise timeline and scenarios.</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Event
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderSafetyManagement = () => {
    // Print function for Safety
    const printSafety = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise Safety - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
              .safety-item { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
              .safety-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .safety-description { margin-bottom: 10px; color: #666; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Safety Concerns</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p>Exercise Type: ${exercise.exercise_type || 'N/A'}</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="safety-content">
              ${exercise.safetyConcerns && exercise.safetyConcerns.length > 0 ? 
                exercise.safetyConcerns.map((safety, index) => `
                  <div class="safety-item">
                    <div class="safety-title">${index + 1}. ${safety.concern || 'Unnamed Safety Concern'}</div>
                    <div class="safety-description">${safety.description || 'No description provided'}</div>
                  </div>
                `).join('') 
                : '<p>No safety concerns have been defined for this exercise.</p>'
              }
            </div>
            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Safety Concerns</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printSafety}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Safety
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {/* Add new safety concern logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Safety Concern
            </Button>
          </div>
        </div>

        {/* Safety Concerns List */}
        <div className="space-y-4">
          {exercise.safetyConcerns && exercise.safetyConcerns.length > 0 ? (
            exercise.safetyConcerns.map((concern, index) => (
              <Card key={concern.id || index} className="bg-gray-800 border-red-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <ShieldAlert className="h-5 w-5 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">{concern.name}</h3>
                      </div>
                      <p className="text-gray-300 mb-3">{concern.description}</p>
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        Priority: High
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="p-12 text-center">
                <ShieldAlert className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Safety Concerns</h3>
                <p className="text-gray-500 mb-4">Document safety concerns and mitigation measures for this exercise.</p>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Safety Concern
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderGenericSectionManagement = () => {
    const sectionTitle = exerciseMenuItems.find(item => item.id === activeSection)?.title || activeSection;
    const sectionData = exercise?.[activeSection] || [];
    
    // Print function for Generic Sections
    const printGenericSection = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise ${sectionTitle} - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
              .section-item { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
              .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .section-description { margin-bottom: 10px; color: #666; }
              .section-details { margin-bottom: 5px; font-size: 14px; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise ${sectionTitle}</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p>Exercise Type: ${exercise.exercise_type || 'N/A'}</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="section-content">
              ${sectionData && sectionData.length > 0 ? 
                sectionData.map((item, index) => `
                  <div class="section-item">
                    <div class="section-title">${index + 1}. ${item.name || item.word || item.concern || 'Unnamed Item'}</div>
                    <div class="section-description">${item.description || item.meaning || 'No description provided'}</div>
                    ${item.home_base ? `<div class="section-details"><strong>Home Base:</strong> ${item.home_base}</div>` : ''}
                    ${item.frequency ? `<div class="section-details"><strong>Frequency:</strong> ${item.frequency}</div>` : ''}
                    ${item.achieved ? `<div class="section-details"><strong>Status:</strong> ${item.achieved}</div>` : ''}
                    ${item.latitude && item.longitude ? `<div class="section-details"><strong>Coordinates:</strong> ${item.latitude}, ${item.longitude}</div>` : ''}
                  </div>
                `).join('') 
                : `<p>No ${sectionTitle.toLowerCase()} have been defined for this exercise.</p>`
              }
            </div>
            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{sectionTitle}</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printGenericSection}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print {sectionTitle}
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {/* Add new item logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {sectionTitle}
            </Button>
          </div>
        </div>

        {/* Current Data Display */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Current {sectionTitle} Data</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(sectionData) && sectionData.length > 0 ? (
              <div className="space-y-4">
                {sectionData.map((item, index) => (
                  <div key={item.id || index} className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">
                          {item.name || item.word || item.callsign || `${sectionTitle} ${index + 1}`}
                        </h3>
                        {item.description && (
                          <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        )}
                        {item.definition && (
                          <p className="text-gray-400 text-sm mb-2">Definition: {item.definition}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          {Object.entries(item).filter(([key]) => !['id', 'name', 'description', 'definition'].includes(key))
                            .map(([key, value]) => `${key}: ${value}`).join(' | ')}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No {sectionTitle.toLowerCase()} data available</div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-black"
                  onClick={() => {/* Add new item logic */}}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First {sectionTitle}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CRUD Interface Note */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-400" />
              <div className="text-blue-300 text-sm">
                Full CRUD interface for {sectionTitle.toLowerCase()} management will be implemented here. 
                Users will be able to create, edit, update, and delete {sectionTitle.toLowerCase()} with proper forms and validation.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEvaluationsManagement = () => {
    const handleAddNew = () => {
      setEditingEvaluation(null);
      setShowAddEvaluation(true);
    };

    const handleEdit = (report) => {
      setEditingEvaluation(report);
      setShowAddEvaluation(true);
    };

    const handleBack = () => {
      setShowAddEvaluation(false);
      setEditingEvaluation(null);
    };

    const handleSave = () => {
      setShowAddEvaluation(false);
      setEditingEvaluation(null);
      fetchEvaluationReports(); // Refresh the list
    };

    const handleDelete = async (reportId) => {
      if (window.confirm('Are you sure you want to delete this evaluation report?')) {
        try {
          await axios.delete(`${API}/evaluation-reports/${reportId}`);
          setEvaluationReports(prev => prev.filter(report => report.id !== reportId));
        } catch (error) {
          console.error('Error deleting evaluation report:', error);
        }
      }
    };

    // Print function for Evaluations
    const printEvaluations = () => {
      if (evaluationReports.length === 0) {
        alert('No evaluation reports to print.');
        return;
      }

      let reportsToPrint = [];

      // If there's only one report, print it directly
      if (evaluationReports.length === 1) {
        reportsToPrint = evaluationReports;
      }
      // If there's a selected report, print only that one
      else if (selectedEvaluationId) {
        const selectedReport = evaluationReports.find(r => r.id === selectedEvaluationId);
        if (selectedReport) {
          reportsToPrint = [selectedReport];
        } else {
          alert('Selected evaluation report not found.');
          return;
        }
      }
      // If multiple reports and none selected, ask user which to print
      else {
        const reportOptions = evaluationReports.map((report, index) => 
          `${index + 1}. ${report.report_title} (by ${report.evaluator_name})`
        ).join('\n');
        
        const userChoice = prompt(
          `Multiple evaluation reports found. Which would you like to print?\n\n${reportOptions}\n\nEnter the number (1-${evaluationReports.length}) or 'all' to print all reports:`
        );

        if (!userChoice || userChoice.toLowerCase() === 'cancel') {
          return; // User cancelled
        }

        if (userChoice.toLowerCase() === 'all') {
          reportsToPrint = evaluationReports;
        } else {
          const choiceNum = parseInt(userChoice);
          if (choiceNum >= 1 && choiceNum <= evaluationReports.length) {
            reportsToPrint = [evaluationReports[choiceNum - 1]];
          } else {
            alert('Invalid selection. Please try again.');
            return;
          }
        }
      }

      const currentDateTime = new Date().toLocaleString();
      
      // Collect all unique images from reports to print
      const allImages = reportsToPrint.reduce((images, report) => {
        if (report.evaluation_images && report.evaluation_images.length > 0) {
          return images.concat(report.evaluation_images);
        }
        return images;
      }, []);
      
      const printContent = `
        <html>
          <head>
            <title>Exercise Evaluation Reports - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { border-bottom: 3px solid #333; margin-bottom: 30px; padding-bottom: 15px; }
              .header-images { margin: 15px 0; }
              .header-images img { width: 120px; height: 120px; object-fit: cover; margin-right: 15px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; aspect-ratio: 1/1; }
              .report-item { border: 1px solid #ddd; margin-bottom: 25px; padding: 20px; border-radius: 8px; page-break-inside: avoid; }
              .report-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #333; }
              .section-title { font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; color: #555; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              .content { margin-bottom: 15px; color: #666; }
              .assessment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0; }
              .assessment-item { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
              .rating { font-weight: bold; color: #333; }
              .rating.excellent { color: #3b82f6; }
              .rating.above { color: #0ea5e9; }
              .rating.average { color: #22c55e; }
              .rating.below { color: #f59e0b; }
              .rating.unacceptable { color: #ef4444; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Evaluation Reports</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p><strong>Exercise Type:</strong> ${exercise.exercise_type || 'N/A'}</p>
              <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
              
              ${allImages.length > 0 ? `
                <div class="header-images">
                  <h3>Supporting Images:</h3>
                  ${allImages.slice(0, 6).map(image => `<img src="${image}" alt="Evaluation Image" />`).join('')}
                </div>
              ` : ''}
            </div>
            <div class="reports-content">
              ${reportsToPrint.length > 0 ? 
                reportsToPrint.map((report, index) => `
                  <div class="report-item">
                    <div class="report-title">${report.report_title}</div>
                    <div class="content">
                      <strong>Evaluator:</strong> ${report.evaluator_name} ${report.evaluator_organization ? '(' + report.evaluator_organization + ')' : ''}<br>
                      <strong>Evaluation Date:</strong> ${report.evaluation_date}
                    </div>
                    
                    ${report.exercise_overview ? `
                      <div class="section-title">Exercise Overview</div>
                      <div class="content">${report.exercise_overview}</div>
                    ` : ''}
                    
                    ${report.summary_of_findings ? `
                      <div class="section-title">Summary of Findings</div>
                      <div class="content">${report.summary_of_findings}</div>
                    ` : ''}
                    
                    ${report.strengths ? `
                      <div class="section-title">Strengths</div>
                      <div class="content">${report.strengths}</div>
                    ` : ''}
                    
                    ${report.areas_for_improvement ? `
                      <div class="section-title">Areas for Improvement</div>
                      <div class="content">${report.areas_for_improvement}</div>
                    ` : ''}
                    
                    <div class="section-title">Overall Rating</div>
                    <div class="content">
                      <strong style="padding: 8px 16px; border: 2px solid #ddd; border-radius: 8px; background-color: ${
                        calculateOverallRatingHelper(report) === 'Excellent' ? '#3b82f6' :
                        calculateOverallRatingHelper(report) === 'Above Average' ? '#0ea5e9' :
                        calculateOverallRatingHelper(report) === 'Average' ? '#22c55e' :
                        calculateOverallRatingHelper(report) === 'Below Average' ? '#f59e0b' : '#ef4444'
                      }; color: white;">Overall Rating: ${calculateOverallRatingHelper(report)}</strong>
                      <br><small style="color: #666; font-style: italic;">Calculated automatically based on the average of all assessment area ratings</small>
                    </div>
                    
                    <div class="section-title">Key Areas Assessment</div>
                    <div class="assessment-grid">
                      <div class="assessment-item">
                        <strong>Command and Control</strong><br>
                        <span class="rating ${(report.command_and_control?.rating || '').toLowerCase().replace(' ', '')}"}>Rating: ${report.command_and_control?.rating || 'Average'}</span><br>
                        ${report.command_and_control?.comments || 'No comments'}
                      </div>
                      <div class="assessment-item">
                        <strong>Communication</strong><br>
                        <span class="rating ${(report.communication?.rating || '').toLowerCase().replace(' ', '')}"}>Rating: ${report.communication?.rating || 'Average'}</span><br>
                        ${report.communication?.comments || 'No comments'}
                      </div>
                      <div class="assessment-item">
                        <strong>Resource Management</strong><br>
                        <span class="rating ${(report.resource_management?.rating || '').toLowerCase().replace(' ', '')}"}>Rating: ${report.resource_management?.rating || 'Average'}</span><br>
                        ${report.resource_management?.comments || 'No comments'}
                      </div>
                      <div class="assessment-item">
                        <strong>Safety and Security</strong><br>
                        <span class="rating ${(report.safety_and_security?.rating || '').toLowerCase().replace(' ', '')}"}>Rating: ${report.safety_and_security?.rating || 'Average'}</span><br>
                        ${report.safety_and_security?.comments || 'No comments'}
                      </div>
                      <div class="assessment-item">
                        <strong>Operational Effectiveness</strong><br>
                        <span class="rating ${(report.operational_effectiveness?.rating || '').toLowerCase().replace(' ', '')}"}>Rating: ${report.operational_effectiveness?.rating || 'Average'}</span><br>
                        ${report.operational_effectiveness?.comments || 'No comments'}
                      </div>
                      <div class="assessment-item">
                        <strong>Training and Readiness</strong><br>
                        <span class="rating ${(report.training_and_readiness?.rating || '').toLowerCase().replace(' ', '')}"}>Rating: ${report.training_and_readiness?.rating || 'Average'}</span><br>
                        ${report.training_and_readiness?.comments || 'No comments'}
                      </div>
                      <div class="assessment-item">
                        <strong>Plan Adherence and Adaptability</strong><br>
                        <span class="rating ${(report.plan_adherence_adaptability?.rating || '').toLowerCase().replace(' ', '')}"}>Rating: ${report.plan_adherence_adaptability?.rating || 'Average'}</span><br>
                        ${report.plan_adherence_adaptability?.comments || 'No comments'}
                      </div>
                    </div>
                    
                    ${report.key_findings_narrative ? `
                      <div class="section-title">Key Findings (Narrative)</div>
                      <div class="content">${report.key_findings_narrative}</div>
                    ` : ''}
                    
                    ${report.recommendations ? `
                      <div class="section-title">Recommendations</div>
                      <div class="content">${report.recommendations}</div>
                    ` : ''}
                    
                    ${report.appendices ? `
                      <div class="section-title">Appendices</div>
                      <div class="content">${report.appendices}</div>
                    ` : ''}
                  </div>
                `).join('') 
                : '<p>No evaluation reports available for this exercise.</p>'
              }
            </div>
            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    if (showAddEvaluation) {
      return (
        <EvaluationReportForm
          exerciseId={exerciseId}
          editingReport={editingEvaluation}
          onBack={handleBack}
          onSave={handleSave}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${theme.colors.textPrimary}`}>Exercise Evaluations</h1>
            {evaluationReports.length > 1 && (
              <p className={`text-sm ${theme.colors.textMuted} mt-1`}>
                Click on a report to select it for printing, or use "Print Evaluations" to choose
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printEvaluations}
              title={evaluationReports.length > 1 ? "Click a report to select it for printing, or print all reports" : "Print evaluation report"}
            >
              <Printer className="h-4 w-4 mr-2" />
              {selectedEvaluationId ? "Print Selected" : "Print Evaluations"}
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Evaluation
            </Button>
          </div>
        </div>

        {evaluationLoading ? (
          <Card className={`${theme.colors.tertiary} ${theme.colors.border}`}>
            <CardContent className="p-12 text-center">
              <div className={theme.colors.textMuted}>Loading evaluation reports...</div>
            </CardContent>
          </Card>
        ) : evaluationReports.length === 0 ? (
          <Card className={`${theme.colors.tertiary} ${theme.colors.border} border-dashed`}>
            <CardContent className="p-12 text-center">
              <Star className={`h-12 w-12 ${theme.colors.textMuted} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${theme.colors.textSecondary} mb-2`}>No Evaluations Yet</h3>
              <p className={`${theme.colors.textMuted} mb-4`}>Add exercise evaluations to track performance and effectiveness.</p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-black"
                onClick={handleAddNew}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Evaluation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {evaluationReports.map((report) => (
              <Card 
                key={report.id} 
                className={`${theme.colors.tertiary} ${theme.colors.border} cursor-pointer transition-all ${
                  selectedEvaluationId === report.id 
                    ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-500/5' 
                    : `${theme.colors.hover}`
                }`}
                onClick={() => setSelectedEvaluationId(selectedEvaluationId === report.id ? null : report.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className={`${theme.colors.textPrimary} text-lg`}>{report.report_title}</CardTitle>
                        {selectedEvaluationId === report.id && (
                          <Badge variant="outline" className="border-orange-500 text-orange-400 bg-orange-500/10 text-xs">
                            Selected for Print
                          </Badge>
                        )}
                      </div>
                      <CardDescription className={theme.colors.textMuted}>
                        By {report.evaluator_name} {report.evaluator_organization && `(${report.evaluator_organization})`} • {report.evaluation_date}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-black"
                        onClick={() => handleEdit(report)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.summary_of_findings && (
                    <div>
                      <h4 className={`font-semibold ${theme.colors.textPrimary} mb-2`}>Summary of Findings</h4>
                      <p className={`${theme.colors.textSecondary} text-sm`}>{report.summary_of_findings}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className={`font-semibold ${theme.colors.textPrimary} mb-2`}>Key Areas Assessment</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {[
                        { label: 'Command & Control', data: report.command_and_control },
                        { label: 'Communication', data: report.communication },
                        { label: 'Resource Management', data: report.resource_management },
                        { label: 'Safety & Security', data: report.safety_and_security },
                        { label: 'Operational Effectiveness', data: report.operational_effectiveness },
                        { label: 'Training & Readiness', data: report.training_and_readiness },
                        { label: 'Plan Adherence', data: report.plan_adherence_adaptability }
                      ].map((area, index) => (
                        <div key={index} className={`${theme.colors.quaternary} p-2 rounded text-center`}>
                          <div className={`text-xs ${theme.colors.textMuted} mb-1`}>{area.label}</div>
                          <div className={`text-xs font-semibold ${
                            area.data?.rating === 'Excellent' ? 'text-blue-400' :
                            area.data?.rating === 'Above Average' ? 'text-sky-400' :
                            area.data?.rating === 'Average' ? 'text-green-400' :
                            area.data?.rating === 'Below Average' ? 'text-orange-400' :
                            area.data?.rating === 'Unacceptable' ? 'text-red-400' :
                            theme.colors.textMuted
                          }`}>
                            {area.data?.rating || 'Not Rated'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

// Helper function to calculate overall rating (used in both form and print)
const calculateOverallRatingHelper = (reportData) => {
  const assessmentAreas = [
    'command_and_control',
    'communication', 
    'resource_management',
    'safety_and_security',
    'operational_effectiveness',
    'training_and_readiness',
    'plan_adherence_adaptability'
  ];

  // Convert ratings to numerical values for calculation
  const ratingValues = {
    'Excellent': 5,
    'Above Average': 4,
    'Average': 3,
    'Below Average': 2,
    'Unacceptable': 1
  };

  // Get all rated areas
  const ratedAreas = assessmentAreas
    .map(area => reportData[area]?.rating)
    .filter(rating => rating && ratingValues[rating])
    .map(rating => ratingValues[rating]);

  if (ratedAreas.length === 0) {
    return 'Average';
  }

  // Calculate simple average
  const average = ratedAreas.reduce((sum, value) => sum + value, 0) / ratedAreas.length;

  // Convert back to rating labels based on average
  if (average >= 4.5) return 'Excellent';
  if (average >= 3.5) return 'Above Average';
  if (average >= 2.5) return 'Average';
  if (average >= 1.5) return 'Below Average';
  return 'Unacceptable';
};

// Evaluation Report Form Component  
const EvaluationReportForm = ({ exerciseId, editingReport, onBack, onSave }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    report_title: '',
    evaluator_name: '',
    evaluator_organization: '',
    evaluation_date: '',
    exercise_overview: '',
    summary_of_findings: '',
    strengths: '',
    areas_for_improvement: '',
    key_findings_narrative: '',
    recommendations: '',
    appendices: '',
    command_and_control: { area_name: 'Command and Control', rating: 'Average', comments: '' },
    communication: { area_name: 'Communication', rating: 'Average', comments: '' },
    resource_management: { area_name: 'Resource Management', rating: 'Average', comments: '' },
    safety_and_security: { area_name: 'Safety and Security', rating: 'Average', comments: '' },
    operational_effectiveness: { area_name: 'Operational Effectiveness', rating: 'Average', comments: '' },
    training_and_readiness: { area_name: 'Training and Readiness', rating: 'Average', comments: '' },
    plan_adherence_adaptability: { area_name: 'Plan Adherence and Adaptability', rating: 'Average', comments: '' },
    evaluation_images: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);

  const ratingOptions = ['Excellent', 'Above Average', 'Average', 'Below Average', 'Unacceptable'];

  useEffect(() => {
    if (editingReport) {
      setFormData({
        report_title: editingReport.report_title || '',
        evaluator_name: editingReport.evaluator_name || '',
        evaluator_organization: editingReport.evaluator_organization || '',
        evaluation_date: editingReport.evaluation_date || '',
        exercise_overview: editingReport.exercise_overview || '',
        summary_of_findings: editingReport.summary_of_findings || '',
        strengths: editingReport.strengths || '',
        areas_for_improvement: editingReport.areas_for_improvement || '',
        key_findings_narrative: editingReport.key_findings_narrative || '',
        recommendations: editingReport.recommendations || '',
        appendices: editingReport.appendices || '',
        command_and_control: editingReport.command_and_control || { area_name: 'Command and Control', rating: 'Average', comments: '' },
        communication: editingReport.communication || { area_name: 'Communication', rating: 'Average', comments: '' },
        resource_management: editingReport.resource_management || { area_name: 'Resource Management', rating: 'Average', comments: '' },
        safety_and_security: editingReport.safety_and_security || { area_name: 'Safety and Security', rating: 'Average', comments: '' },
        operational_effectiveness: editingReport.operational_effectiveness || { area_name: 'Operational Effectiveness', rating: 'Average', comments: '' },
        training_and_readiness: editingReport.training_and_readiness || { area_name: 'Training and Readiness', rating: 'Average', comments: '' },
        plan_adherence_adaptability: editingReport.plan_adherence_adaptability || { area_name: 'Plan Adherence and Adaptability', rating: 'Average', comments: '' },
        evaluation_images: editingReport.evaluation_images || []
      });
      if (editingReport.evaluation_images) {
        setImagePreview(editingReport.evaluation_images);
      }
    } else {
      // Set default evaluation date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, evaluation_date: today }));
    }
  }, [editingReport]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.report_title.trim()) {
      newErrors.report_title = 'Report title is required';
    }

    if (!formData.evaluator_name.trim()) {
      newErrors.evaluator_name = 'Evaluator name is required';
    }

    if (!formData.evaluation_date.trim()) {
      newErrors.evaluation_date = 'Evaluation date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAreaAssessmentChange = (areaKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      [areaKey]: {
        ...prev[areaKey],
        [field]: value
      }
    }));
  };

  // Calculate overall rating for the current form data
  const calculateOverallRating = () => {
    return calculateOverallRatingHelper(formData);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(prev => [...prev, imageData]);
        setFormData(prev => ({ 
          ...prev, 
          evaluation_images: [...prev.evaluation_images, imageData] 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(prev => [...prev, imageData]);
        setFormData(prev => ({ 
          ...prev, 
          evaluation_images: [...prev.evaluation_images, imageData] 
        }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ 
      ...prev, 
      evaluation_images: prev.evaluation_images.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const reportData = {
        ...formData,
        exercise_id: exerciseId
      };

      if (editingReport) {
        await axios.put(`${API}/evaluation-reports/${editingReport.id}`, reportData);
      } else {
        await axios.post(`${API}/evaluation-reports`, reportData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving evaluation report:', error);
      alert('Failed to save evaluation report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">
            {editingReport ? 'Edit Evaluation Report' : 'Create Evaluation Report'}
          </h1>
          <p className={theme.colors.textMuted}>
            Comprehensive evaluation report for exercise performance assessment
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Evaluations
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className={`${theme.colors.secondary} ${theme.colors.border}`}>
          <CardHeader>
            <CardTitle className="text-orange-500">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="report_title" className={theme.colors.textPrimary}>
                  Report Title *
                </Label>
                <Input
                  id="report_title"
                  type="text"
                  value={formData.report_title}
                  onChange={(e) => handleInputChange('report_title', e.target.value)}
                  placeholder="Exercise Evaluation Report"
                  className={theme.colors.input}
                />
                {errors.report_title && (
                  <p className="text-red-400 text-sm mt-1">{errors.report_title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="evaluation_date" className={theme.colors.textPrimary}>
                  Evaluation Date *
                </Label>
                <Input
                  id="evaluation_date"
                  type="date"
                  value={formData.evaluation_date}
                  onChange={(e) => handleInputChange('evaluation_date', e.target.value)}
                  className={theme.colors.input}
                />
                {errors.evaluation_date && (
                  <p className="text-red-400 text-sm mt-1">{errors.evaluation_date}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="evaluator_name" className={theme.colors.textPrimary}>
                  Evaluator Name *
                </Label>
                <Input
                  id="evaluator_name"
                  type="text"
                  value={formData.evaluator_name}
                  onChange={(e) => handleInputChange('evaluator_name', e.target.value)}
                  placeholder="Primary evaluator's name"
                  className={theme.colors.input}
                />
                {errors.evaluator_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.evaluator_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="evaluator_organization" className="text-white">
                  Evaluator Organization
                </Label>
                <Input
                  id="evaluator_organization"
                  type="text"
                  value={formData.evaluator_organization}
                  onChange={(e) => handleInputChange('evaluator_organization', e.target.value)}
                  placeholder="Organization or department"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supporting Images */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Supporting Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="evaluation-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('evaluation-image-upload').click()}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 mr-3"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCameraCapture}
                    className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Use Camera
                  </Button>
                </div>
              </div>

              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Evaluation ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1 text-red-400 border-red-400 hover:bg-red-400 hover:text-white p-1"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Overview */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Exercise Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.exercise_overview}
              onChange={(e) => handleInputChange('exercise_overview', e.target.value)}
              placeholder="Provide a brief overview of the exercise, its purpose, and scope..."
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Key Areas Assessment */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Key Areas Assessment</CardTitle>
            <CardDescription className="text-gray-400">
              Evaluate critical operational areas during the exercise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: 'command_and_control', title: 'Command and Control', description: 'Leadership, decision-making processes, and clarity of roles and responsibilities' },
              { key: 'communication', title: 'Communication', description: 'Internal and external communication, information dissemination to relevant parties and emergency services' },
              { key: 'resource_management', title: 'Resource Management', description: 'Availability, allocation, and effectiveness of personnel, equipment, and supplies' },
              { key: 'safety_and_security', title: 'Safety and Security', description: 'Personnel protection, first aid, hazardous materials management, and overall security' },
              { key: 'operational_effectiveness', title: 'Operational Effectiveness', description: 'Execution of emergency procedures, evacuation plans, shelter-in-place, and site-specific responses' },
              { key: 'training_and_readiness', title: 'Training and Readiness', description: 'Staff training adequacy and preparedness to carry out assigned roles' },
              { key: 'plan_adherence_adaptability', title: 'Plan Adherence and Adaptability', description: 'Following existing plans and adaptability to scenario changes' }
            ].map((area) => (
              <div key={area.key} className="bg-gray-800 p-4 rounded border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-2">{area.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{area.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Rating</Label>
                    <Select
                      value={formData[area.key].rating}
                      onValueChange={(value) => handleAreaAssessmentChange(area.key, 'rating', value)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {ratingOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-gray-600">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Comments</Label>
                    <Textarea
                      value={formData[area.key].comments}
                      onChange={(e) => handleAreaAssessmentChange(area.key, 'comments', e.target.value)}
                      placeholder="Assessment comments..."
                      rows={2}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary and Findings */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Summary and Findings</CardTitle>
            <CardDescription className="text-gray-400">
              High-level overview and detailed findings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Rating Display */}
            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <Label className="text-white text-lg font-semibold">Overall Rating</Label>
              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 ${
                    calculateOverallRating() === 'Excellent' ? 'border-blue-500 text-blue-400 bg-blue-500/10' :
                    calculateOverallRating() === 'Above Average' ? 'border-sky-400 text-sky-400 bg-sky-400/10' :
                    calculateOverallRating() === 'Average' ? 'border-green-500 text-green-400 bg-green-500/10' :
                    calculateOverallRating() === 'Below Average' ? 'border-orange-500 text-orange-400 bg-orange-500/10' :
                    'border-red-500 text-red-400 bg-red-500/10'
                  }`}
                >
                  Overall Rating: {calculateOverallRating()}
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Calculated automatically based on the average of all assessment area ratings
              </p>
            </div>

            <div>
              <Label className="text-white">Summary of Findings</Label>
              <Textarea
                value={formData.summary_of_findings}
                onChange={(e) => handleInputChange('summary_of_findings', e.target.value)}
                placeholder="Provide a high-level overview of what went well and what needs improvement..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="text-white">Strengths</Label>
              <Textarea
                value={formData.strengths}
                onChange={(e) => handleInputChange('strengths', e.target.value)}
                placeholder="Detail what worked effectively during the exercise..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="text-white">Areas for Improvement</Label>
              <Textarea
                value={formData.areas_for_improvement}
                onChange={(e) => handleInputChange('areas_for_improvement', e.target.value)}
                placeholder="List the aspects of the plan, procedures, or response that were deficient..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="text-white">Key Findings (Narrative)</Label>
              <Textarea
                value={formData.key_findings_narrative}
                onChange={(e) => handleInputChange('key_findings_narrative', e.target.value)}
                placeholder="Include detailed, objective narrative summaries of specific events, problems, or successes observed..."
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recommendations and Appendices */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Recommendations and Appendices</CardTitle>
            <CardDescription className="text-gray-400">
              Action items and supporting documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Recommendations</Label>
              <Textarea
                value={formData.recommendations}
                onChange={(e) => handleInputChange('recommendations', e.target.value)}
                placeholder="Assign responsibilities and timelines for addressing identified gaps and improving the emergency management program..."
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="text-white">Appendices</Label>
              <Textarea
                value={formData.appendices}
                onChange={(e) => handleInputChange('appendices', e.target.value)}
                placeholder="Include supporting documents such as the problem log, debriefing notes, and evaluation forms..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="text-gray-400 border-gray-600 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
          >
            {loading ? 'Saving...' : (editingReport ? 'Update Report' : 'Create Report')}
          </Button>
        </div>
      </form>
    </div>
  );
};

  // Helper function to create print functions for improvement sections
  const createPrintFunction = (sectionName, sectionTitle) => {
    return () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>${sectionTitle} - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
              .item { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
              .item-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .item-description { margin-bottom: 10px; color: #666; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${sectionTitle}</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p>Exercise Type: ${exercise.exercise_type || 'N/A'}</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">
              <p>${sectionTitle} data for this exercise will be displayed here.</p>
            </div>
            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

// Lessons Learned Form Component  
const LessonsLearnedForm = ({ exerciseId, editingLesson, onBack, onSave, dotmplficcOptions }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    // First Container - Lesson Learned
    name: '',
    serial_number: null,
    priority: 'Pri 1',
    references: '',
    date: new Date().toISOString().split('T')[0],
    lesson_images: [],
    
    // Second Container - Observations and Recommended Actions
    dotmplficc: 'Doctrine',
    issues_observation: '',
    recommendations: '',
    
    // Third Container - Analysis and Actions
    additional_comments: '',
    recommended_actions: '',
    final_authority_remarks: '',
    testing_done_by: '',
    procedures_written_by: '',
    implement_new_ll_by: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Priority options with colors
  const priorityOptions = [
    { value: 'Pri 1', label: 'Pri 1', color: '#ef4444' }, // Red
    { value: 'Pri 2', label: 'Pri 2', color: '#f59e0b' }, // Orange  
    { value: 'Pri 3', label: 'Pri 3', color: '#22c55e' }, // Green
    { value: 'Pri 4', label: 'Pri 4', color: '#3b82f6' }  // Blue
  ];

  useEffect(() => {
    if (editingLesson) {
      setFormData({
        name: editingLesson.name || '',
        serial_number: editingLesson.serial_number || null,
        priority: editingLesson.priority || 'Pri 1',
        references: editingLesson.references || '',
        date: editingLesson.date || new Date().toISOString().split('T')[0],
        lesson_images: editingLesson.lesson_images || [],
        dotmplficc: editingLesson.dotmplficc || 'Doctrine',
        issues_observation: editingLesson.issues_observation || '',
        recommendations: editingLesson.recommendations || '',
        additional_comments: editingLesson.additional_comments || '',
        recommended_actions: editingLesson.recommended_actions || '',
        final_authority_remarks: editingLesson.final_authority_remarks || '',
        testing_done_by: editingLesson.testing_done_by || '',
        procedures_written_by: editingLesson.procedures_written_by || '',
        implement_new_ll_by: editingLesson.implement_new_ll_by || ''
      });
    }
  }, [editingLesson]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          lesson_images: [...prev.lesson_images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/png');
        setFormData(prev => ({
          ...prev,
          lesson_images: [...prev.lesson_images, imageData]
        }));
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      lesson_images: prev.lesson_images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Lesson name is required';
    }

    if (!formData.references.trim()) {
      newErrors.references = 'References are required';
    }

    if (!formData.issues_observation.trim()) {
      newErrors.issues_observation = 'Issues/Observation is required';
    }

    if (!formData.recommendations.trim()) {
      newErrors.recommendations = 'Recommendations are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        exercise_id: exerciseId
      };

      const url = editingLesson 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/lessons-learned/${editingLesson.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/lessons-learned`;
      
      const method = editingLesson ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const savedLesson = await response.json();
        onSave(savedLesson);
      } else {
        throw new Error('Failed to save lesson learned');
      }
    } catch (error) {
      console.error('Error saving lesson learned:', error);
      alert('Failed to save lesson learned. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {editingLesson ? 'Edit Lessons Learned' : 'Create Lessons Learned'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Container - Lesson Learned */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Lesson Learned</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Name of the lesson learned"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label className="text-white">Serial Number</Label>
                <Input
                  value={formData.serial_number || ''}
                  placeholder="Auto-generated"
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">Priority *</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  style={{
                    backgroundColor: priorityOptions.find(p => p.value === formData.priority)?.color + '20',
                    borderColor: priorityOptions.find(p => p.value === formData.priority)?.color
                  }}
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-white">Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">References *</Label>
              <Textarea
                value={formData.references}
                onChange={(e) => handleInputChange('references', e.target.value)}
                placeholder="Enter references..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              {errors.references && (
                <p className="text-red-400 text-sm mt-1">{errors.references}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-white">Supporting Images</Label>
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="lesson-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('lesson-image-upload').click()}
                  className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCameraCapture}
                  className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Use Camera
                </Button>
              </div>

              {formData.lesson_images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.lesson_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Lesson ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-700 aspect-square"
                        style={{ aspectRatio: '1/1' }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Second Container - Observations and Recommended Actions */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Observations and Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">DOTMPLFICC *</Label>
              <select
                value={formData.dotmplficc}
                onChange={(e) => handleInputChange('dotmplficc', e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                style={{
                  backgroundColor: dotmplficcOptions.find(opt => opt.value === formData.dotmplficc)?.color + '20',
                  borderColor: dotmplficcOptions.find(opt => opt.value === formData.dotmplficc)?.color
                }}
              >
                {dotmplficcOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-white">Issues / Observation *</Label>
              <Textarea
                value={formData.issues_observation}
                onChange={(e) => handleInputChange('issues_observation', e.target.value)}
                placeholder="Describe the issues or observations..."
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              {errors.issues_observation && (
                <p className="text-red-400 text-sm mt-1">{errors.issues_observation}</p>
              )}
            </div>

            <div>
              <Label className="text-white">Recommendations *</Label>
              <Textarea
                value={formData.recommendations}
                onChange={(e) => handleInputChange('recommendations', e.target.value)}
                placeholder="Enter your recommendations..."
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              {errors.recommendations && (
                <p className="text-red-400 text-sm mt-1">{errors.recommendations}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Third Container - Analysis and Actions */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Analysis and Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Additional Comments</Label>
              <Textarea
                value={formData.additional_comments}
                onChange={(e) => handleInputChange('additional_comments', e.target.value)}
                placeholder="Enter additional comments..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="text-white">Recommended Actions</Label>
              <Textarea
                value={formData.recommended_actions}
                onChange={(e) => handleInputChange('recommended_actions', e.target.value)}
                placeholder="Enter recommended actions..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="text-white">Final Authority Remarks</Label>
              <Textarea
                value={formData.final_authority_remarks}
                onChange={(e) => handleInputChange('final_authority_remarks', e.target.value)}
                placeholder="Enter final authority remarks..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-white">Testing done by</Label>
                <Input
                  type="date"
                  value={formData.testing_done_by}
                  onChange={(e) => handleInputChange('testing_done_by', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Procedures Written By</Label>
                <Input
                  type="date"
                  value={formData.procedures_written_by}
                  onChange={(e) => handleInputChange('procedures_written_by', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Implement new LL by</Label>
                <Input
                  type="date"
                  value={formData.implement_new_ll_by}
                  onChange={(e) => handleInputChange('implement_new_ll_by', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            Back to Lessons Learned
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-black"
          >
            {isSubmitting ? 'Saving...' : (editingLesson ? 'Update Lesson Learned' : 'Save Lesson Learned')}
          </Button>
        </div>
      </form>
    </div>
  );
};

  // DOTMPLFICC options with colors (shared between form and management)
  const dotmplficcOptions = [
    { value: 'Doctrine', label: 'Doctrine', color: '#3b82f6' }, // Blue
    { value: 'Organization', label: 'Organization', color: '#10b981' }, // Emerald
    { value: 'Training', label: 'Training', color: '#f59e0b' }, // Amber
    { value: 'Maint and Equip', label: 'Maint and Equip', color: '#8b5cf6' }, // Violet
    { value: 'Personnel', label: 'Personnel', color: '#06b6d4' }, // Cyan
    { value: 'Leadership', label: 'Leadership', color: '#ef4444' }, // Red
    { value: 'Facilities', label: 'Facilities', color: '#84cc16' }, // Lime
    { value: 'Interoperability', label: 'Interoperability', color: '#f97316' }, // Orange
    { value: 'Communications', label: 'Communications', color: '#ec4899' }, // Pink
    { value: 'Command and Control', label: 'Command and Control', color: '#6366f1' } // Indigo
  ];

  const renderLessonsLearnedManagement = () => {
    // Lessons Learned handlers
    const handleAddNewLesson = () => {
      setEditingLesson(null);
      setShowAddLesson(true);
    };

    const handleEditLesson = (lesson) => {
      setEditingLesson(lesson);
      setShowAddLesson(true);
    };

    const handleDeleteLesson = async (lessonId) => {
      if (window.confirm('Are you sure you want to delete this lesson learned?')) {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lessons-learned/${lessonId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            await fetchLessonsLearned();
          } else {
            throw new Error('Failed to delete lesson learned');
          }
        } catch (error) {
          console.error('Error deleting lesson learned:', error);
          alert('Failed to delete lesson learned. Please try again.');
        }
      }
    };

    const handleSaveLesson = async (savedLesson) => {
      setShowAddLesson(false);
      setEditingLesson(null);
      await fetchLessonsLearned();
    };

    const handleBackFromForm = () => {
      setShowAddLesson(false);
      setEditingLesson(null);
    };

    // Print function for Lessons Learned
    const printLessonsLearned = () => {
      if (lessonsLearned.length === 0) {
        alert('No lessons learned to print.');
        return;
      }

      let lessonsToPrint = [];

      // If there's only one lesson, print it directly
      if (lessonsLearned.length === 1) {
        lessonsToPrint = lessonsLearned;
      }
      // If there's a selected lesson, print only that one
      else if (selectedLessonId) {
        const selectedLesson = lessonsLearned.find(l => l.id === selectedLessonId);
        if (selectedLesson) {
          lessonsToPrint = [selectedLesson];
        } else {
          alert('Selected lesson learned not found.');
          return;
        }
      }
      // If multiple lessons and none selected, ask user which to print
      else {
        const lessonOptions = lessonsLearned.map((lesson, index) => 
          `${index + 1}. ${lesson.name} (Serial #${lesson.serial_number})`
        ).join('\n');
        
        const userChoice = prompt(
          `Multiple lessons learned found. Which would you like to print?\n\n${lessonOptions}\n\nEnter the number (1-${lessonsLearned.length}) or 'all' to print all lessons:`
        );

        if (!userChoice || userChoice.toLowerCase() === 'cancel') {
          return; // User cancelled
        }

        if (userChoice.toLowerCase() === 'all') {
          lessonsToPrint = lessonsLearned;
        } else {
          const choiceNum = parseInt(userChoice);
          if (choiceNum >= 1 && choiceNum <= lessonsLearned.length) {
            lessonsToPrint = [lessonsLearned[choiceNum - 1]];
          } else {
            alert('Invalid selection. Please try again.');
            return;
          }
        }
      }

      const currentDateTime = new Date().toLocaleString();
      
      // Collect all unique images from lessons to print
      const allImages = lessonsToPrint.reduce((images, lesson) => {
        if (lesson.lesson_images && lesson.lesson_images.length > 0) {
          return images.concat(lesson.lesson_images);
        }
        return images;
      }, []);
      
      const printContent = `
        <html>
          <head>
            <title>Exercise Lessons Learned - ${exercise.name || 'Exercise'}</title>
            <style>
              @page { 
                margin: 20px 20px 80px 20px; 
                size: A4;
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px 20px 60px 20px; 
                font-size: 12px;
                line-height: 1.4;
              }
              .header { border-bottom: 3px solid #333; margin-bottom: 30px; padding-bottom: 15px; }
              .header-images { margin: 15px 0; }
              .header-images img { width: 120px; height: 120px; object-fit: cover; margin-right: 15px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; aspect-ratio: 1/1; }
              .lesson-item { 
                border: 1px solid #ddd; 
                margin-bottom: 25px; 
                padding: 20px; 
                border-radius: 8px; 
                page-break-inside: avoid;
                page-break-after: auto;
              }
              .lesson-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #333; }
              .section-title { 
                font-size: 16px; 
                font-weight: bold; 
                margin: 20px 0 10px 0; 
                color: #555; 
                border-bottom: 1px solid #eee; 
                padding-bottom: 5px;
                page-break-after: avoid;
              }
              .content { margin-bottom: 15px; color: #666; }
              .priority { 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-weight: bold; 
                color: white; 
              }
              .priority.pri-1 { background-color: #ef4444; }
              .priority.pri-2 { background-color: #f59e0b; }
              .priority.pri-3 { background-color: #22c55e; }
              .priority.pri-4 { background-color: #3b82f6; }
              .dotmplficc { 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-weight: bold; 
                color: white; 
                margin-left: 10px;
              }
              .dotmplficc.doctrine { background-color: #3b82f6; }
              .dotmplficc.organization { background-color: #10b981; }
              .dotmplficc.training { background-color: #f59e0b; }
              .dotmplficc.maint { background-color: #8b5cf6; }
              .dotmplficc.personnel { background-color: #06b6d4; }
              .dotmplficc.leadership { background-color: #ef4444; }
              .dotmplficc.facilities { background-color: #84cc16; }
              .dotmplficc.interoperability { background-color: #f97316; }
              .dotmplficc.communications { background-color: #ec4899; }
              .dotmplficc.command { background-color: #6366f1; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0; }
              .grid-item { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px;
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px;
                height: 40px;
                z-index: 999;
              }
              .no-print { display: none; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Lessons Learned</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <p><strong>Exercise Type:</strong> ${exercise.exercise_type || 'N/A'}</p>
              <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
              
              ${allImages.length > 0 ? `
                <div class="header-images">
                  <h3>Supporting Images:</h3>
                  ${allImages.slice(0, 6).map(image => `<img src="${image}" alt="Lesson Image" />`).join('')}
                </div>
              ` : ''}
            </div>
            <div class="lessons-content">
              ${lessonsToPrint.length > 0 ? 
                lessonsToPrint.map((lesson, index) => `
                  <div class="lesson-item">
                    <div class="lesson-title">${lesson.name}</div>
                    <div class="content">
                      <strong>Serial Number:</strong> ${lesson.serial_number || 'N/A'}<br>
                      <strong>Priority:</strong> <span class="priority ${lesson.priority.toLowerCase().replace(' ', '-')}">${lesson.priority}</span><br>
                      <strong>Date:</strong> ${lesson.date}<br>
                      <strong>DOTMPLFICC:</strong> <span class="dotmplficc ${lesson.dotmplficc.toLowerCase().replace(/\s+/g, '').replace('and', '')}">${lesson.dotmplficc}</span>
                    </div>
                    
                    ${lesson.references ? `
                      <div class="section-title">References</div>
                      <div class="content">${lesson.references}</div>
                    ` : ''}
                    
                    <div class="section-title">Observations and Recommended Actions</div>
                    ${lesson.issues_observation ? `
                      <div class="content">
                        <strong>Issues/Observation:</strong><br>${lesson.issues_observation}
                      </div>
                    ` : ''}
                    ${lesson.recommendations ? `
                      <div class="content">
                        <strong>Recommendations:</strong><br>${lesson.recommendations}
                      </div>
                    ` : ''}
                    
                    <div class="section-title">Analysis and Actions</div>
                    <div class="grid">
                      ${lesson.additional_comments ? `
                        <div class="grid-item">
                          <strong>Additional Comments:</strong><br>${lesson.additional_comments}
                        </div>
                      ` : ''}
                      ${lesson.recommended_actions ? `
                        <div class="grid-item">
                          <strong>Recommended Actions:</strong><br>${lesson.recommended_actions}
                        </div>
                      ` : ''}
                      ${lesson.final_authority_remarks ? `
                        <div class="grid-item">
                          <strong>Final Authority Remarks:</strong><br>${lesson.final_authority_remarks}
                        </div>
                      ` : ''}
                      ${lesson.testing_done_by || lesson.procedures_written_by || lesson.implement_new_ll_by ? `
                        <div class="grid-item">
                          <strong>Timeline:</strong><br>
                          ${lesson.testing_done_by ? `Testing done by: ${lesson.testing_done_by}<br>` : ''}
                          ${lesson.procedures_written_by ? `Procedures written by: ${lesson.procedures_written_by}<br>` : ''}
                          ${lesson.implement_new_ll_by ? `Implement new LL by: ${lesson.implement_new_ll_by}` : ''}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('') : 
                '<div class="lesson-item"><p>No lessons learned found.</p></div>'
              }
            </div>
            <div class="footer">
              <p>Generated on ${currentDateTime} | Page <span id="pageNumber"></span></p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    // Show form if adding/editing
    if (showAddLesson) {
      return (
        <LessonsLearnedForm
          exerciseId={exerciseId}
          editingLesson={editingLesson}
          onBack={handleBackFromForm}
          onSave={handleSaveLesson}
          dotmplficcOptions={dotmplficcOptions}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Lessons Learned</h1>
            {lessonsLearned.length > 1 && (
              <p className="text-sm text-gray-400 mt-1">
                Click on a lesson to select it for printing, or use "Print Lessons Learned" to choose
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printLessonsLearned}
              title={lessonsLearned.length > 1 ? "Click a lesson to select it for printing, or print all lessons" : "Print lessons learned"}
            >
              <Printer className="h-4 w-4 mr-2" />
              {selectedLessonId ? "Print Selected" : "Print Lessons Learned"}
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={handleAddNewLesson}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson Learned
            </Button>
          </div>
        </div>

        {lessonsLoading ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400">Loading lessons learned...</div>
            </CardContent>
          </Card>
        ) : lessonsLearned.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700 border-dashed">
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Lessons Learned Yet</h3>
              <p className="text-gray-500 mb-4">Document key lessons and insights from the exercise.</p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-black"
                onClick={handleAddNewLesson}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Lesson
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {lessonsLearned.map((lesson) => (
              <Card 
                key={lesson.id} 
                className={`bg-gray-800 border-gray-700 cursor-pointer transition-all ${
                  selectedLessonId === lesson.id 
                    ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-500/5' 
                    : 'hover:border-gray-600 hover:bg-gray-750'
                }`}
                onClick={() => setSelectedLessonId(selectedLessonId === lesson.id ? null : lesson.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white text-lg">{lesson.name}</CardTitle>
                        {selectedLessonId === lesson.id && (
                          <Badge variant="outline" className="border-orange-500 text-orange-400 bg-orange-500/10 text-xs">
                            Selected for Print
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Serial #{lesson.serial_number}</span>
                        <Badge 
                          className={`text-white ${
                            lesson.priority === 'Pri 1' ? 'bg-red-500' :
                            lesson.priority === 'Pri 2' ? 'bg-orange-500' :
                            lesson.priority === 'Pri 3' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                        >
                          {lesson.priority}
                        </Badge>
                        <span>{lesson.date}</span>
                        <Badge 
                          className="text-white"
                          style={{
                            backgroundColor: dotmplficcOptions.find(opt => opt.value === lesson.dotmplficc)?.color || '#6b7280'
                          }}
                        >
                          {lesson.dotmplficc}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLesson(lesson);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLesson(lesson.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lesson.references && (
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">References</h4>
                      <p className="text-gray-300 text-sm">{lesson.references}</p>
                    </div>
                  )}
                  
                  {lesson.issues_observation && (
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Issues/Observation</h4>
                      <p className="text-gray-300 text-sm">{lesson.issues_observation.substring(0, 200)}{lesson.issues_observation.length > 200 ? '...' : ''}</p>
                    </div>
                  )}
                  
                  {lesson.recommendations && (
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Recommendations</h4>
                      <p className="text-gray-300 text-sm">{lesson.recommendations.substring(0, 200)}{lesson.recommendations.length > 200 ? '...' : ''}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDeficienciesManagement = () => {
    const printDeficiencies = createPrintFunction('deficiencies', 'Exercise Deficiencies');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Deficiencies</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printDeficiencies}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Deficiencies
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {/* Add new deficiency logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deficiency
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Deficiencies Recorded</h3>
            <p className="text-gray-500 mb-4">Track areas that need improvement or fell short of expectations.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Deficiency
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderNearMissesManagement = () => {
    const printNearMisses = createPrintFunction('nearmisses', 'Exercise Near Misses');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Near Misses</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printNearMisses}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Near Misses
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {/* Add new near miss logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Near Miss
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <Zap className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Near Misses Reported</h3>
            <p className="text-gray-500 mb-4">Document incidents that almost occurred but were avoided.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Near Miss
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCommentsManagement = () => {
    const printComments = createPrintFunction('comments', 'Exercise Comments');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Comments</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printComments}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Comments
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {/* Add new comment logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Comments Yet</h3>
            <p className="text-gray-500 mb-4">Add general observations and feedback about the exercise.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Comment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCorrectiveActionsManagement = () => {
    const printCorrectiveActions = createPrintFunction('corrective', 'Exercise Corrective Actions');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Corrective Actions</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={printCorrectiveActions}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Corrective Actions
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-black"
              onClick={() => {/* Add new corrective action logic */}}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Corrective Action
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 border-dashed">
          <CardContent className="p-12 text-center">
            <CheckSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Corrective Actions Yet</h3>
            <p className="text-gray-500 mb-4">Define actions to address identified issues and improvements.</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add First Corrective Action
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFinalReportManagement = () => {
    // Print function for Final Report
    const printFinalReport = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>After Action Report - ${exercise.name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { border-bottom: 3px solid #333; margin-bottom: 30px; padding-bottom: 15px; }
              .section { margin-bottom: 25px; }
              .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
              .subsection { margin-bottom: 15px; margin-left: 20px; }
              .subsection-title { font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #555; }
              .content { margin-bottom: 10px; color: #666; }
              .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .summary-table th, .summary-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .summary-table th { background-color: #f4f4f4; font-weight: bold; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
                .page-break { page-break-after: always; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>After Action Report</h1>
              <h2>${exercise.name || 'Exercise Name'}</h2>
              <table class="summary-table">
                <tr>
                  <th>Exercise Type</th>
                  <td>${exercise.exercise_type || 'N/A'}</td>
                  <th>Start Date</th>
                  <td>${exercise.start_date || 'N/A'}</td>
                </tr>
                <tr>
                  <th>End Date</th>
                  <td>${exercise.end_date || 'N/A'}</td>
                  <th>Duration</th>
                  <td>${exercise.start_date && exercise.end_date ? 
                    Math.ceil((new Date(exercise.end_date) - new Date(exercise.start_date)) / (1000 * 60 * 60 * 24)) + ' days' : 
                    'N/A'}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Exercise Overview</div>
              <div class="content">${exercise.description || 'No description provided'}</div>
            </div>

            <div class="section">
              <div class="section-title">Goals Summary</div>
              ${exercise.goals && exercise.goals.length > 0 ? 
                exercise.goals.map((goal, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${goal.name || 'Unnamed Goal'}</div>
                    <div class="content">${goal.description || 'No description'}</div>
                    <div class="content"><strong>Status:</strong> ${goal.achieved || 'No'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No goals defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Objectives Summary</div>
              ${exercise.objectives && exercise.objectives.length > 0 ? 
                exercise.objectives.map((obj, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${obj.name || 'Unnamed Objective'}</div>
                    <div class="content">${obj.description || 'No description'}</div>
                    <div class="content"><strong>Status:</strong> ${obj.achieved || 'No'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No objectives defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Events Summary</div>
              ${exercise.events && exercise.events.length > 0 ? 
                exercise.events.map((event, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${event.name || 'Unnamed Event'}</div>
                    <div class="content">${event.description || 'No description'}</div>
                    <div class="content"><strong>Time:</strong> ${event.time || 'Not specified'}</div>
                    <div class="content"><strong>Location:</strong> ${event.location || 'Not specified'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No events defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Functions Summary</div>
              ${exercise.functions && exercise.functions.length > 0 ? 
                exercise.functions.map((func, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${func.name || 'Unnamed Function'}</div>
                    <div class="content">${func.description || 'No description'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No functions defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Organizations Summary</div>
              ${exercise.organizations && exercise.organizations.length > 0 ? 
                exercise.organizations.map((org, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${org.name || 'Unnamed Organization'}</div>
                    <div class="content">${org.description || 'No description'}</div>
                    <div class="content"><strong>Contact:</strong> ${org.contact || 'Not specified'}</div>
                    <div class="content"><strong>Phone:</strong> ${org.phone || 'Not specified'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No organizations defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Team Coordinators</div>
              ${exercise.coordinators && exercise.coordinators.length > 0 ? 
                exercise.coordinators.map((coord, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${coord.name || 'Unnamed Coordinator'}</div>
                    <div class="content"><strong>Role:</strong> ${coord.role || 'Not specified'}</div>
                    <div class="content"><strong>Email:</strong> ${coord.email || 'Not specified'}</div>
                    <div class="content"><strong>Phone:</strong> ${coord.phone || 'Not specified'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No team coordinators defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Code Words</div>
              ${exercise.codeWords && exercise.codeWords.length > 0 ? 
                exercise.codeWords.map((code, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${code.word || 'Unnamed Code Word'}</div>
                    <div class="content">${code.meaning || 'No meaning specified'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No code words defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Callsigns</div>
              ${exercise.callsigns && exercise.callsigns.length > 0 ? 
                exercise.callsigns.map((call, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${call.callsign || 'Unnamed Callsign'}</div>
                    <div class="content"><strong>Unit:</strong> ${call.unit || 'Not specified'}</div>
                    <div class="content"><strong>Description:</strong> ${call.description || 'No description'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No callsigns defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Communication Frequencies</div>
              ${exercise.frequencies && exercise.frequencies.length > 0 ? 
                exercise.frequencies.map((freq, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${freq.name || 'Unnamed Frequency'}</div>
                    <div class="content"><strong>Frequency:</strong> ${freq.frequency || 'Not specified'}</div>
                    <div class="content"><strong>Description:</strong> ${freq.description || 'No description'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No frequencies defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Assumptions</div>
              ${exercise.assumptions && exercise.assumptions.length > 0 ? 
                exercise.assumptions.map((assumption, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${assumption.name || 'Unnamed Assumption'}</div>
                    <div class="content">${assumption.description || 'No description'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No assumptions defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Artificialities</div>
              ${exercise.artificialities && exercise.artificialities.length > 0 ? 
                exercise.artificialities.map((art, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${art.name || 'Unnamed Artificiality'}</div>
                    <div class="content">${art.description || 'No description'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No artificialities defined for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Safety Concerns</div>
              ${exercise.safetyConcerns && exercise.safetyConcerns.length > 0 ? 
                exercise.safetyConcerns.map((safety, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${safety.concern || 'Unnamed Safety Concern'}</div>
                    <div class="content">${safety.description || 'No description'}</div>
                    <div class="content"><strong>Safety Officer:</strong> ${safety.officer || 'Not specified'}</div>
                    <div class="content"><strong>Officer Phone:</strong> ${safety.officerPhone || 'Not specified'}</div>
                  </div>
                `).join('') 
                : '<div class="content">No safety concerns defined for this exercise.</div>'
              }
            </div>

            <div class="page-break"></div>

            <div class="section">
              <div class="section-title">Scope Information</div>
              <div class="subsection">
                <div class="subsection-title">Description</div>
                <div class="content">${exercise.scope_description || 'No scope description provided'}</div>
              </div>
              <div class="subsection">
                <div class="subsection-title">Geographic Area</div>
                <div class="content">${exercise.scope_geographic_area || 'No geographic area specified'}</div>
              </div>
              <div class="subsection">
                <div class="subsection-title">Functions</div>
                <div class="content">${exercise.scope_functions || 'No functions specified'}</div>
              </div>
              <div class="subsection">
                <div class="subsection-title">Organizations</div>
                <div class="content">${exercise.scope_organizations || 'No organizations specified'}</div>
              </div>
              <div class="subsection">
                <div class="subsection-title">Personnel</div>
                <div class="content">${exercise.scope_personnel || 'No personnel specified'}</div>
              </div>
              <div class="subsection">
                <div class="subsection-title">Hazards</div>
                <div class="content">${exercise.scope_hazards || 'No hazards specified'}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Purpose Information</div>
              <div class="content">${exercise.purpose || 'No purpose specified'}</div>
            </div>

            <div class="section">
              <div class="section-title">Scenario Information</div>
              <div class="subsection">
                <div class="subsection-title">Description</div>
                <div class="content">${exercise.scenario_description || 'No scenario description provided'}</div>
              </div>
              <div class="subsection">
                <div class="subsection-title">Location</div>
                <div class="content">${exercise.scenario_location || 'No scenario location specified'}</div>
              </div>
              <div class="subsection">
                <div class="subsection-title">Coordinates</div>
                <div class="content">
                  Latitude: ${exercise.scenario_latitude || 'Not specified'}, 
                  Longitude: ${exercise.scenario_longitude || 'Not specified'}
                </div>
              </div>
              <div class="subsection">
                <div class="subsection-title">Timeline</div>
                <div class="content">${exercise.scenario_timeline || 'No timeline specified'}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Lessons Learned Summary</div>
              ${lessonsLearned && lessonsLearned.length > 0 ? 
                lessonsLearned.map((lesson, index) => `
                  <div class="subsection">
                    <div class="subsection-title">${index + 1}. ${lesson.name || 'Unnamed Lesson'}</div>
                    <table class="summary-table">
                      <tr>
                        <th style="width: 20%;">Date</th>
                        <td>${lesson.date || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <th>Priority</th>
                        <td>
                          <span style="padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; background-color: ${
                            lesson.priority === 'Pri 1' ? '#ef4444' :
                            lesson.priority === 'Pri 2' ? '#f59e0b' :
                            lesson.priority === 'Pri 3' ? '#22c55e' : '#3b82f6'
                          };">${lesson.priority}</span>
                        </td>
                      </tr>
                      <tr>
                        <th>DOTMPLFICC</th>
                        <td>
                          <span style="padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; background-color: ${
                            lesson.dotmplficc === 'Doctrine' ? '#3b82f6' :
                            lesson.dotmplficc === 'Organization' ? '#10b981' :
                            lesson.dotmplficc === 'Training' ? '#f59e0b' :
                            lesson.dotmplficc === 'Maint and Equip' ? '#8b5cf6' :
                            lesson.dotmplficc === 'Personnel' ? '#06b6d4' :
                            lesson.dotmplficc === 'Leadership' ? '#ef4444' :
                            lesson.dotmplficc === 'Facilities' ? '#84cc16' :
                            lesson.dotmplficc === 'Interoperability' ? '#f97316' :
                            lesson.dotmplficc === 'Communications' ? '#ec4899' : '#6366f1'
                          };">${lesson.dotmplficc}</span>
                        </td>
                      </tr>
                      <tr>
                        <th>Issues / Observation</th>
                        <td>${lesson.issues_observation || 'No issues/observations specified'}</td>
                      </tr>
                      ${lesson.recommendations ? `
                        <tr>
                          <th>Recommendations</th>
                          <td>${lesson.recommendations}</td>
                        </tr>
                      ` : ''}
                    </table>
                  </div>
                `).join('') 
                : '<div class="content">No lessons learned documented for this exercise.</div>'
              }
            </div>

            <div class="section">
              <div class="section-title">Exercise Conclusion</div>
              <div class="content">
                This exercise report provides a comprehensive overview of the exercise activities, 
                objectives achievement, and key outcomes. For detailed analysis and follow-up actions, 
                please refer to the individual section reports available in the exercise management system.
              </div>
            </div>

            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">After Action Report</h1>
          <Button 
            variant="outline"
            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            onClick={printFinalReport}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print After Action Report
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Exercise Summary</CardTitle>
            <CardDescription className="text-gray-400">
              Comprehensive overview of exercise execution and results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Exercise Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Exercise Details</h3>
                <div className="text-sm text-gray-300">
                  <p><span className="font-medium">Name:</span> {exercise.name}</p>
                  <p><span className="font-medium">Type:</span> {exercise.exercise_type || 'N/A'}</p>
                  <p><span className="font-medium">Start Date:</span> {exercise.start_date || 'N/A'}</p>
                  <p><span className="font-medium">End Date:</span> {exercise.end_date || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Status Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-700 p-3 rounded">
                    <p className="text-orange-500 font-medium">Goals</p>
                    <p className="text-gray-300">{exercise.goals?.length || 0} defined</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <p className="text-orange-500 font-medium">Objectives</p>
                    <p className="text-gray-300">{exercise.objectives?.length || 0} defined</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <p className="text-orange-500 font-medium">Events</p>
                    <p className="text-gray-300">{exercise.events?.length || 0} planned</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <p className="text-orange-500 font-medium">Organizations</p>
                    <p className="text-gray-300">{exercise.organizations?.length || 0} participating</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Goals Achievement Summary */}
            {exercise.goals && exercise.goals.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Goals Achievement</h3>
                <div className="space-y-2">
                  {exercise.goals.slice(0, 5).map((goal, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                      <div>
                        <p className="font-medium text-white">{goal.name}</p>
                        <p className="text-sm text-gray-400">{goal.description}</p>
                      </div>
                      <Badge className={
                        goal.achieved === 'Yes' ? 'bg-green-500/20 text-green-300' :
                        goal.achieved === 'Partial' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }>
                        {goal.achieved || 'No'}
                      </Badge>
                    </div>
                  ))}
                  {exercise.goals.length > 5 && (
                    <p className="text-sm text-gray-400">...and {exercise.goals.length - 5} more goals</p>
                  )}
                </div>
              </div>
            )}

            <Separator className="bg-gray-700" />

            {/* Lessons Learned Summary */}
            {lessonsLearned && lessonsLearned.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Lessons Learned Summary</h3>
                  <div className="space-y-3">
                    {lessonsLearned.slice(0, 3).map((lesson, index) => (
                      <Card key={index} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-sm">{lesson.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  className={`text-white text-xs ${
                                    lesson.priority === 'Pri 1' ? 'bg-red-500' :
                                    lesson.priority === 'Pri 2' ? 'bg-orange-500' :
                                    lesson.priority === 'Pri 3' ? 'bg-green-500' : 'bg-blue-500'
                                  }`}
                                >
                                  {lesson.priority}
                                </Badge>
                                <Badge 
                                  className="text-white text-xs"
                                  style={{
                                    backgroundColor: dotmplficcOptions.find(opt => opt.value === lesson.dotmplficc)?.color || '#6b7280'
                                  }}
                                >
                                  {lesson.dotmplficc}
                                </Badge>
                                <span className="text-xs text-gray-400">{lesson.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-400">Issues/Observation:</span>
                              <p className="text-gray-300 mt-1">{lesson.issues_observation ? (lesson.issues_observation.length > 100 ? lesson.issues_observation.substring(0, 100) + '...' : lesson.issues_observation) : 'No issues/observations specified'}</p>
                            </div>
                            {lesson.recommendations && (
                              <div>
                                <span className="text-gray-400">Recommendations:</span>
                                <p className="text-gray-300 mt-1">{lesson.recommendations.length > 100 ? lesson.recommendations.substring(0, 100) + '...' : lesson.recommendations}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {lessonsLearned.length > 3 && (
                      <p className="text-sm text-gray-400">...and {lessonsLearned.length - 3} more lessons learned</p>
                    )}
                  </div>
                </div>

                <Separator className="bg-gray-700" />
              </>
            )}

            {/* Report Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Report Actions</h3>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  onClick={printFinalReport}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Full Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderScribeManagement = () => {
    // Print function for Scribe Notes
    const printScribeNotes = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise Scribe Notes - ${exercise.exercise_name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.8; }
              .header { border-bottom: 3px solid #0891b2; margin-bottom: 30px; padding-bottom: 15px; }
              .section { margin-bottom: 25px; page-break-inside: avoid; }
              .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #0891b2; }
              .notes-section { 
                min-height: 200px; 
                border: 1px solid #ddd; 
                padding: 15px; 
                margin: 15px 0;
                background: #f9f9f9;
              }
              .exercise-info { background: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Scribe Notes</h1>
              <h2>${exercise.exercise_name || 'Exercise Name'}</h2>
            </div>

            <div class="exercise-info">
              <p><strong>Exercise Type:</strong> ${exercise.exercise_type || 'N/A'}</p>
              <p><strong>Date:</strong> ${exercise.start_date || 'N/A'} - ${exercise.end_date || 'N/A'}</p>
              <p><strong>Location:</strong> ${exercise.location || 'N/A'}</p>
              <p><strong>Scribe:</strong> ________________________________</p>
            </div>

            <div class="section">
              <div class="section-title">Exercise Timeline & Key Events</div>
              <div class="notes-section">
                <p><em>Record key events, timings, and observations during the exercise:</em></p>
                <br><br><br><br><br><br><br><br>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Communications Log</div>
              <div class="notes-section">
                <p><em>Track important communications, radio calls, and messages:</em></p>
                <br><br><br><br><br><br><br><br>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Decision Points & Actions</div>
              <div class="notes-section">
                <p><em>Document key decisions made and actions taken:</em></p>
                <br><br><br><br><br><br><br><br>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Issues & Challenges</div>
              <div class="notes-section">
                <p><em>Note any problems, delays, or unexpected situations:</em></p>
                <br><br><br><br><br><br><br><br>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Participant Performance</div>
              <div class="notes-section">
                <p><em>Observations about participant responses and performance:</em></p>
                <br><br><br><br><br><br><br><br>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Additional Notes</div>
              <div class="notes-section">
                <p><em>Any other relevant observations or comments:</em></p>
                <br><br><br><br><br><br><br><br>
              </div>
            </div>

            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    };

    // Print function for Timeline Sheet
    const printTimelineSheet = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise Timeline Sheet - ${exercise.exercise_name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { border-bottom: 3px solid #3b82f6; margin-bottom: 30px; padding-bottom: 15px; }
              .timeline-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
              }
              .timeline-table th, .timeline-table td { 
                border: 1px solid #333; 
                padding: 8px; 
                text-align: left; 
                vertical-align: top;
              }
              .timeline-table th { 
                background-color: #f4f4f4; 
                font-weight: bold; 
                font-size: 14px;
              }
              .timeline-table td { 
                height: 40px; 
                font-size: 12px;
              }
              .exercise-info { background: #eff6ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
              .time-col { width: 10%; }
              .event-col { width: 30%; }
              .location-col { width: 20%; }
              .participants-col { width: 20%; }
              .notes-col { width: 20%; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Timeline Sheet</h1>
              <h2>${exercise.exercise_name || 'Exercise Name'}</h2>
            </div>

            <div class="exercise-info">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div><strong>Exercise Type:</strong> ${exercise.exercise_type || 'N/A'}</div>
                <div><strong>Date:</strong> ${exercise.start_date || 'N/A'}</div>
                <div><strong>Location:</strong> ${exercise.location || 'N/A'}</div>
              </div>
              <div style="margin-top: 10px;">
                <strong>Scribe:</strong> ________________________________ 
                <strong style="margin-left: 50px;">Start Time:</strong> ________________________________
              </div>
            </div>

            <table class="timeline-table">
              <thead>
                <tr>
                  <th class="time-col">Time</th>
                  <th class="event-col">Event/Activity</th>
                  <th class="location-col">Location</th>
                  <th class="participants-col">Participants</th>
                  <th class="notes-col">Notes/Observations</th>
                </tr>
              </thead>
              <tbody>
                ${Array.from({ length: 35 }, (_, i) => `
                  <tr>
                    <td class="time-col"></td>
                    <td class="event-col"></td>
                    <td class="location-col"></td>
                    <td class="participants-col"></td>
                    <td class="notes-col"></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="margin-top: 30px; page-break-before: always;">
              <h3 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">Key Milestones & Decision Points</h3>
              <table class="timeline-table">
                <thead>
                  <tr>
                    <th class="time-col">Time</th>
                    <th style="width: 40%;">Milestone/Decision</th>
                    <th style="width: 50%;">Details/Impact</th>
                  </tr>
                </thead>
                <tbody>
                  ${Array.from({ length: 15 }, (_, i) => `
                    <tr>
                      <td class="time-col"></td>
                      <td></td>
                      <td></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    };

    // Print function for Scribe Duties Checklist
    const printScribeChecklist = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Scribe Duties Checklist - ${exercise.exercise_name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { border-bottom: 3px solid #22c55e; margin-bottom: 30px; padding-bottom: 15px; }
              .checklist-section { 
                margin-bottom: 30px; 
                page-break-inside: avoid;
              }
              .section-title { 
                font-size: 18px; 
                font-weight: bold; 
                margin-bottom: 15px; 
                color: #22c55e; 
                border-bottom: 1px solid #22c55e;
                padding-bottom: 5px;
              }
              .checklist-item { 
                display: flex; 
                align-items: flex-start; 
                margin-bottom: 12px; 
                padding: 8px;
                border-left: 3px solid #dcfce7;
                background: #f0fdf4;
              }
              .checkbox { 
                width: 16px; 
                height: 16px; 
                border: 2px solid #22c55e; 
                margin-right: 12px; 
                margin-top: 2px;
                flex-shrink: 0;
              }
              .checklist-text { 
                flex-grow: 1; 
                font-size: 14px;
              }
              .time-field { 
                margin-left: 10px; 
                border-bottom: 1px solid #ccc; 
                min-width: 80px; 
                display: inline-block;
              }
              .exercise-info { background: #f0fdf4; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #22c55e; }
              .footer { 
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                right: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
                border-top: 1px solid #ddd; 
                padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Scribe Duties Checklist</h1>
              <h2>${exercise.exercise_name || 'Exercise Name'}</h2>
            </div>

            <div class="exercise-info">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div><strong>Exercise Type:</strong> ${exercise.exercise_type || 'N/A'}</div>
                <div><strong>Date:</strong> ${exercise.start_date || 'N/A'}</div>
                <div><strong>Location:</strong> ${exercise.location || 'N/A'}</div>
              </div>
              <div style="margin-top: 10px;">
                <strong>Scribe Name:</strong> ________________________________ 
                <strong style="margin-left: 30px;">Signature:</strong> ________________________________
              </div>
            </div>

            <div class="checklist-section">
              <div class="section-title">Pre-Exercise Preparation</div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Review exercise plan and objectives</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Print all necessary scribe templates and forms</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Set up scribe station with adequate supplies (pens, clipboards, extra paper)</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Synchronize clock/watch with exercise control time</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Test communication equipment (radios, phones)</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Attend pre-exercise briefing and take notes</div>
                <div class="time-field">Time: _______</div>
              </div>
            </div>

            <div class="checklist-section">
              <div class="section-title">During Exercise Execution</div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Record exercise start time and initial conditions</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Document all significant events with precise timestamps</div>
                <div class="time-field">Ongoing</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Log all radio communications and key messages</div>
                <div class="time-field">Ongoing</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Track participant arrivals and role assignments</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Record all inject delivery times and participant responses</div>
                <div class="time-field">Ongoing</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Document decision points and rationale</div>
                <div class="time-field">Ongoing</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Note any deviations from planned scenario</div>
                <div class="time-field">As needed</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Track issues, problems, or equipment failures</div>
                <div class="time-field">As needed</div>
              </div>
            </div>

            <div class="checklist-section">
              <div class="section-title">Post-Exercise Activities</div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Record official exercise end time</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Complete final notes and observations</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Organize and review all documentation</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Submit all forms and notes to exercise control</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Participate in hot wash/immediate debrief if required</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Secure and store all exercise materials</div>
                <div class="time-field">Time: _______</div>
              </div>
            </div>

            <div class="checklist-section">
              <div class="section-title">Quality Control</div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Verify all times are recorded in 24-hour format</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Ensure all forms are legible and complete</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Cross-reference timeline with event log</div>
                <div class="time-field">Time: _______</div>
              </div>
              <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-text">Sign and date all completed forms</div>
                <div class="time-field">Time: _______</div>
              </div>
            </div>

            <div style="margin-top: 30px; border: 2px solid #22c55e; padding: 15px; background: #f0fdf4;">
              <h3 style="color: #22c55e; margin-top: 0;">Emergency Contacts</h3>
              <p><strong>Exercise Control:</strong> ________________________________</p>
              <p><strong>Safety Officer:</strong> ________________________________</p>
              <p><strong>Exercise Director:</strong> ________________________________</p>
            </div>

            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Exercise Scribe</h1>
          <Button 
            variant="outline"
            className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
            onClick={printScribeNotes}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Scribe Sheet
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-500">Scribe Documentation</CardTitle>
            <CardDescription className="text-gray-400">
              Generate and manage exercise documentation templates for scribes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Exercise Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Exercise Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded">
                  <p className="text-sm text-gray-400 mb-1">Exercise Name</p>
                  <p className="text-white font-medium">{exercise.exercise_name || 'Not specified'}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                  <p className="text-sm text-gray-400 mb-1">Exercise Type</p>
                  <p className="text-white font-medium">{exercise.exercise_type || 'Not specified'}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                  <p className="text-sm text-gray-400 mb-1">Start Date</p>
                  <p className="text-white font-medium">{exercise.start_date || 'Not specified'}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded">
                  <p className="text-sm text-gray-400 mb-1">Location</p>
                  <p className="text-white font-medium">{exercise.location || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Scribe Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Scribe Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 h-auto py-4 flex-col"
                  onClick={printScribeNotes}
                >
                  <PenTool className="h-6 w-6 mb-2" />
                  <span className="font-medium">Scribe Template</span>
                  <span className="text-xs text-gray-400">Print note-taking template</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 h-auto py-4 flex-col"
                  onClick={printTimelineSheet}
                >
                  <Clock className="h-6 w-6 mb-2" />
                  <span className="font-medium">Timeline Sheet</span>
                  <span className="text-xs text-gray-400">Event timing template</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 h-auto py-4 flex-col"
                  onClick={printScribeChecklist}
                >
                  <CheckSquare className="h-6 w-6 mb-2" />
                  <span className="font-medium">Checklist</span>
                  <span className="text-xs text-gray-400">Scribe duties checklist</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 h-auto py-4 flex-col"
                  onClick={() => setActiveSection('scribe_form')}
                >
                  <FileEdit className="h-6 w-6 mb-2" />
                  <span className="font-medium">Digital Form</span>
                  <span className="text-xs text-gray-400">Input data digitally</span>
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Scribe Instructions</h3>
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4">
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-400 font-bold">1.</span>
                    <span>Print the Scribe Template before the exercise begins</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-400 font-bold">2.</span>
                    <span>Record all key events with precise timestamps</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-400 font-bold">3.</span>
                    <span>Document important communications and radio traffic</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-400 font-bold">4.</span>
                    <span>Note decision points and actions taken by participants</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-400 font-bold">5.</span>
                    <span>Track issues, challenges, and unexpected situations</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  const renderScribeFormManagement = () => {
    const saveScribeTemplate = async () => {
      setScribeFormLoading(true);
      try {
        const templateData = {
          ...scribeFormData,
          exercise_id: exerciseId
        };

        let response;
        if (currentTemplate) {
          // Update existing template
          response = await fetch(`${API}/scribe-templates/${currentTemplate.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(templateData)
          });
        } else {
          // Create new template
          response = await fetch(`${API}/scribe-templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(templateData)
          });
        }

        if (response.ok) {
          const savedTemplate = await response.json();
          setCurrentTemplate(savedTemplate);
          loadScribeTemplates(); // Reload list
          alert('Scribe template saved successfully!');
        } else {
          throw new Error('Failed to save scribe template');
        }
      } catch (error) {
        console.error('Error saving scribe template:', error);
        alert('Error saving scribe template. Please try again.');
      } finally {
        setScribeFormLoading(false);
      }
    };

    const printFilledTemplate = () => {
      const currentDateTime = new Date().toLocaleString();
      const printContent = `
        <html>
          <head>
            <title>Exercise Scribe Notes - ${exercise.exercise_name || 'Exercise'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.8; }
              .header { border-bottom: 3px solid #0891b2; margin-bottom: 30px; padding-bottom: 15px; }
              .section { margin-bottom: 25px; page-break-inside: avoid; }
              .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #0891b2; }
              .data-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .data-table th { background-color: #f4f4f4; font-weight: bold; }
              .exercise-info { background: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
              .notes-section { background: #f9f9f9; padding: 15px; margin: 15px 0; border: 1px solid #ddd; }
              .footer { 
                position: fixed; bottom: 20px; left: 20px; right: 20px; text-align: center; 
                font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; 
              }
              @media print { 
                @page { 
                  margin: 20px 20px 80px 20px; 
                  size: A4;
                }
                body { 
                  margin: 0; 
                  padding: 20px 20px 60px 20px; 
                  font-size: 12px;
                  line-height: 1.4;
                } 
                .no-print { display: none; }
                .footer { 
                  position: fixed; 
                  bottom: 20px; 
                  left: 20px; 
                  right: 20px;
                  height: 40px;
                  z-index: 999;
                }
                .report-item { 
                  page-break-inside: avoid; 
                  page-break-after: auto;
                  margin-bottom: 20px;
                }
                .section-title { 
                  page-break-after: avoid;
                }
                .assessment-grid { 
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exercise Scribe Notes</h1>
              <h2>${exercise.exercise_name || 'Exercise Name'}</h2>
            </div>

            <div class="exercise-info">
              <p><strong>Exercise Type:</strong> ${exercise.exercise_type || 'N/A'}</p>
              <p><strong>Date:</strong> ${exercise.start_date || 'N/A'} - ${exercise.end_date || 'N/A'}</p>
              <p><strong>Location:</strong> ${exercise.location || 'N/A'}</p>
              <p><strong>Scribe:</strong> ${scribeFormData.scribe_name || 'Not specified'}</p>
              <p><strong>Exercise Start:</strong> ${scribeFormData.exercise_start_time || 'Not specified'}</p>
              <p><strong>Exercise End:</strong> ${scribeFormData.exercise_end_time || 'Not specified'}</p>
            </div>

            <div class="section">
              <div class="section-title">Exercise Timeline & Key Events</div>
              ${scribeFormData.timeline_events.length > 0 ? `
                <table class="data-table">
                  <thead>
                    <tr><th>Time</th><th>Event</th><th>Observations</th></tr>
                  </thead>
                  <tbody>
                    ${scribeFormData.timeline_events.map(event => `
                      <tr>
                        <td>${event.time || ''}</td>
                        <td>${event.event || ''}</td>
                        <td>${event.observations || ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<p><em>No timeline events recorded.</em></p>'}
            </div>

            <div class="section">
              <div class="section-title">Communications Log</div>
              ${scribeFormData.communications.length > 0 ? `
                <table class="data-table">
                  <thead>
                    <tr><th>Time</th><th>From</th><th>To</th><th>Message</th><th>Method</th><th>Content</th></tr>
                  </thead>
                  <tbody>
                    ${scribeFormData.communications.map(comm => `
                      <tr>
                        <td>${comm.time || ''}</td>
                        <td>${comm.from_person || ''}</td>
                        <td>${comm.to_person || ''}</td>
                        <td>${comm.message || ''}</td>
                        <td>${comm.method || ''}</td>
                        <td>${comm.content || ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<p><em>No communications recorded.</em></p>'}
            </div>

            <div class="section">
              <div class="section-title">Additional Notes</div>
              <div class="notes-section">
                ${scribeFormData.additional_notes || '<em>No additional notes.</em>'}
              </div>
            </div>

            <div class="footer">
              <p>Generated on: ${currentDateTime} | Powered by EXRSIM</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    };

    // Helper functions to add/remove items from arrays
    const addTimelineEvent = () => {
      setScribeFormData(prev => ({
        ...prev,
        timeline_events: [...prev.timeline_events, { time: '', event: '', observations: '' }]
      }));
    };

    const removeTimelineEvent = (index) => {
      setScribeFormData(prev => ({
        ...prev,
        timeline_events: prev.timeline_events.filter((_, i) => i !== index)
      }));
    };

    const updateTimelineEvent = (index, field, value) => {
      setScribeFormData(prev => ({
        ...prev,
        timeline_events: prev.timeline_events.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    };

    const addCommunication = () => {
      setScribeFormData(prev => ({
        ...prev,
        communications: [...prev.communications, { time: '', from_person: '', to_person: '', message: '', method: '', content: '' }]
      }));
    };

    const removeCommunication = (index) => {
      setScribeFormData(prev => ({
        ...prev,
        communications: prev.communications.filter((_, i) => i !== index)
      }));
    };

    const updateCommunication = (index, field, value) => {
      setScribeFormData(prev => ({
        ...prev,
        communications: prev.communications.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Digital Scribe Form</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
              onClick={() => setActiveSection('scribe')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>
            <Button 
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              onClick={printFilledTemplate}
              disabled={!scribeFormData.scribe_name}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Filled Template
            </Button>
            <Button 
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={saveScribeTemplate}
              disabled={scribeFormLoading}
            >
              {scribeFormLoading ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-purple-500">Exercise Scribe Data Entry</CardTitle>
            <CardDescription className="text-gray-400">
              Enter scribe data digitally and generate a filled template for printing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scribe_name" className="text-gray-300">Scribe Name</Label>
                <Input
                  id="scribe_name"
                  value={scribeFormData.scribe_name}
                  onChange={(e) => setScribeFormData(prev => ({ ...prev, scribe_name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter scribe name"
                />
              </div>
              <div>
                <Label htmlFor="scribe_signature" className="text-gray-300">Scribe Signature</Label>
                <Input
                  id="scribe_signature"
                  value={scribeFormData.scribe_signature}
                  onChange={(e) => setScribeFormData(prev => ({ ...prev, scribe_signature: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter signature"
                />
              </div>
              <div>
                <Label htmlFor="start_time" className="text-gray-300">Exercise Start Time</Label>
                <Input
                  id="start_time"
                  value={scribeFormData.exercise_start_time}
                  onChange={(e) => {
                    const value = e.target.value;
                    setScribeFormData(prev => ({ ...prev, exercise_start_time: value }));
                    
                    // Validate time format
                    if (value && !validateTimeFormat(value)) {
                      setScribeTimeErrors(prev => ({ ...prev, start_time: 'Please enter time in format: 10:00 AM or 2:30 PM' }));
                    } else {
                      setScribeTimeErrors(prev => ({ ...prev, start_time: null }));
                    }
                  }}
                  onBlur={(e) => {
                    const formatted = formatTimeInput(e.target.value);
                    if (formatted !== e.target.value) {
                      setScribeFormData(prev => ({ ...prev, exercise_start_time: formatted }));
                    }
                  }}
                  className={`bg-gray-700 border-gray-600 text-white ${scribeTimeErrors.start_time ? 'border-red-500' : ''}`}
                  placeholder="10:00 AM"
                />
                {scribeTimeErrors.start_time && (
                  <p className="text-red-500 text-sm mt-1">{scribeTimeErrors.start_time}</p>
                )}
              </div>
              <div>
                <Label htmlFor="end_time" className="text-gray-300">Exercise End Time</Label>
                <Input
                  id="end_time"
                  value={scribeFormData.exercise_end_time}
                  onChange={(e) => {
                    const value = e.target.value;
                    setScribeFormData(prev => ({ ...prev, exercise_end_time: value }));
                    
                    // Validate time format
                    if (value && !validateTimeFormat(value)) {
                      setScribeTimeErrors(prev => ({ ...prev, end_time: 'Please enter time in format: 10:00 AM or 2:30 PM' }));
                    } else {
                      setScribeTimeErrors(prev => ({ ...prev, end_time: null }));
                    }
                  }}
                  onBlur={(e) => {
                    const formatted = formatTimeInput(e.target.value);
                    if (formatted !== e.target.value) {
                      setScribeFormData(prev => ({ ...prev, exercise_end_time: formatted }));
                    }
                  }}
                  className={`bg-gray-700 border-gray-600 text-white ${scribeTimeErrors.end_time ? 'border-red-500' : ''}`}
                  placeholder="2:30 PM"
                />
                {scribeTimeErrors.end_time && (
                  <p className="text-red-500 text-sm mt-1">{scribeTimeErrors.end_time}</p>
                )}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Timeline Events Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Timeline Events</h3>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={addTimelineEvent}
                  className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
              {scribeFormData.timeline_events.map((event, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded border border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-gray-300">Time</Label>
                      <Input
                        value={event.time || ''}
                        onChange={(e) => updateTimelineEvent(index, 'time', e.target.value)}
                        onBlur={(e) => {
                          const formatted = formatTimeInput(e.target.value);
                          if (formatted !== e.target.value) {
                            updateTimelineEvent(index, 'time', formatted);
                          }
                        }}
                        className={`bg-gray-600 border-gray-500 text-white ${event.time && !validateTimeFormat(event.time) ? 'border-red-500' : ''}`}
                        placeholder="10:00 AM"
                      />
                      {event.time && !validateTimeFormat(event.time) && (
                        <p className="text-red-500 text-xs mt-1">Format: 10:00 AM</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300">Event</Label>
                      <Input
                        value={event.event}
                        onChange={(e) => updateTimelineEvent(index, 'event', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Event description"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label className="text-gray-300">Observations</Label>
                        <Input
                          value={event.observations}
                          onChange={(e) => updateTimelineEvent(index, 'observations', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white"
                          placeholder="Observations"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTimelineEvent(index)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-700" />

            {/* Communications Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Communications</h3>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={addCommunication}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Communication
                </Button>
              </div>
              {scribeFormData.communications.map((comm, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded border border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                    <div>
                      <Label className="text-gray-300">Time</Label>
                      <Input
                        value={comm.time || ''}
                        onChange={(e) => updateCommunication(index, 'time', e.target.value)}
                        onBlur={(e) => {
                          const formatted = formatTimeInput(e.target.value);
                          if (formatted !== e.target.value) {
                            updateCommunication(index, 'time', formatted);
                          }
                        }}
                        className={`bg-gray-600 border-gray-500 text-white ${comm.time && !validateTimeFormat(comm.time) ? 'border-red-500' : ''}`}
                        placeholder="10:00 AM"
                      />
                      {comm.time && !validateTimeFormat(comm.time) && (
                        <p className="text-red-500 text-xs mt-1">Format: 10:00 AM</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-300">From</Label>
                      <Input
                        value={comm.from_person}
                        onChange={(e) => updateCommunication(index, 'from_person', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Sender"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">To</Label>
                      <Input
                        value={comm.to_person}
                        onChange={(e) => updateCommunication(index, 'to_person', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Recipient"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Message</Label>
                      <Input
                        value={comm.message}
                        onChange={(e) => updateCommunication(index, 'message', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Message content"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label className="text-gray-300">Method</Label>
                        <select
                          value={comm.method}
                          onChange={(e) => updateCommunication(index, 'method', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 text-white rounded px-3 py-2"
                        >
                          <option value="">Select method</option>
                          <option value="Radio">Radio</option>
                          <option value="Phone">Phone</option>
                          <option value="Face-to-face">Face-to-face</option>
                          <option value="Email">Email</option>
                          <option value="Text">Text</option>
                        </select>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCommunication(index)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Content</Label>
                    <textarea
                      value={comm.content}
                      onChange={(e) => updateCommunication(index, 'content', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 text-white rounded px-3 py-2"
                      rows="3"
                      placeholder="Detailed communication content, context, or additional information..."
                    />
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-700" />

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Additional Notes</h3>
              <textarea
                value={scribeFormData.additional_notes}
                onChange={(e) => setScribeFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2"
                rows="6"
                placeholder="Enter any additional observations or notes..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={theme.colors.textMuted}>Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldAlert className={`h-12 w-12 ${theme.colors.textMuted} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${theme.colors.textSecondary} mb-2`}>Exercise Not Found</h3>
          <p className={`${theme.colors.textMuted} mb-4`}>The requested exercise could not be loaded.</p>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '#dashboard'}
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.primary} ${theme.colors.textPrimary}`}>
      <div className="flex">
        {/* Exercise-Specific Sidebar */}
        <div className={`w-80 ${theme.colors.secondary} border-r ${theme.colors.borderAccent} h-screen sticky top-0`}>
          <div className="p-4">
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${theme.colors.textSecondary} hover:text-orange-500 mb-4`}
              onClick={() => window.location.href = '#dashboard'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="mb-6">
              <h2 className={`text-lg font-semibold ${theme.colors.textPrimary} mb-2`}>{exercise.exercise_name}</h2>
              <Badge className={getStatusColor(getExerciseStatus())}>
                {getExerciseStatus()}
              </Badge>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-1">
                {/* Top Level Menu Items */}
                {topLevelMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "secondary" : "ghost"}
                      className={`w-full justify-start text-left ${
                        activeSection === item.id
                          ? "bg-orange-500/20 text-orange-300 border-orange-500/50"
                          : `${theme.colors.textSecondary} hover:text-orange-500 ${theme.colors.hover}`
                      }`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Button>
                  );
                })}
                
                {/* Exercise Steps Collapsible Section */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${theme.colors.textSecondary} hover:text-orange-500 ${theme.colors.hover} mb-1`}
                    onClick={() => setExerciseStepsExpanded(!exerciseStepsExpanded)}
                  >
                    {exerciseStepsExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                    )}
                    <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">Exercise Steps</span>
                  </Button>
                  
                  {/* Exercise Steps Sub-menu Items */}
                  {exerciseStepsExpanded && (
                    <div className={`ml-4 space-y-1 border-l ${theme.colors.border} pl-2`}>
                      {exerciseStepsMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={activeSection === item.id ? "secondary" : "ghost"}
                            className={`w-full justify-start text-left text-sm ${
                              activeSection === item.id
                                ? "bg-orange-500/20 text-orange-300 border-orange-500/50"
                                : `${theme.colors.textMuted} hover:text-orange-500 ${theme.colors.hover}`
                            }`}
                            onClick={() => setActiveSection(item.id)}
                          >
                            <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Improvement Collapsible Section */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${theme.colors.textSecondary} hover:text-orange-500 ${theme.colors.hover} mb-1`}
                    onClick={() => setImprovementExpanded(!improvementExpanded)}
                  >
                    {improvementExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                    )}
                    <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">Improvement</span>
                  </Button>
                  
                  {/* Improvement Sub-menu Items */}
                  {improvementExpanded && (
                    <div className={`ml-4 space-y-1 border-l ${theme.colors.border} pl-2`}>
                      {improvementMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={activeSection === item.id ? "secondary" : "ghost"}
                            className={`w-full justify-start text-left text-sm ${
                              activeSection === item.id
                                ? "bg-orange-500/20 text-orange-300 border-orange-500/50"
                                : `${theme.colors.textMuted} hover:text-orange-500 ${theme.colors.hover}`
                            }`}
                            onClick={() => setActiveSection(item.id)}
                          >
                            <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ScopeModal 
        isOpen={scopeModalOpen}
        onClose={() => setScopeModalOpen(false)}
        onSave={handleScopeUpdate}
        initialData={editingScope}
        exerciseId={exerciseId}
      />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [managingExerciseId, setManagingExerciseId] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  
  // Fetch current exercise data when managingExerciseId changes
  useEffect(() => {
    const fetchCurrentExercise = async () => {
      if (managingExerciseId) {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/exercise-builder/${managingExerciseId}`);
          if (response.ok) {
            const exerciseData = await response.json();
            setCurrentExercise(exerciseData);
          } else {
            setCurrentExercise(null);
          }
        } catch (error) {
          console.error('Error fetching current exercise:', error);
          setCurrentExercise(null);
        }
      } else {
        setCurrentExercise(null);
      }
    };

    fetchCurrentExercise();
  }, [managingExerciseId]);
  
  // Scribe form state
  const [scribeTemplates, setScribeTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [scribeFormLoading, setScribeFormLoading] = useState(false);
  const [scribeTimeErrors, setScribeTimeErrors] = useState({});
  const [scribeFormData, setScribeFormData] = useState({
    scribe_name: '',
    scribe_signature: '',
    exercise_start_time: '',
    exercise_end_time: '',
    timeline_events: [],
    communications: [],
    decisions: [],
    issues: [],
    participant_observations: [],
    additional_notes: ''
  });

  // Evaluation state
  const [evaluationReports, setEvaluationReports] = useState([]);
  const [showAddEvaluation, setShowAddEvaluation] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);

  // Handle URL-based navigation for editing exercises
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the #
      
      // Check for parameters in hash format: #builder?exercise=<id> or #manage?exercise=<id>
      const queryStart = hash.indexOf('?');
      let hashBase = hash;
      let exerciseId = null;
      
      if (queryStart !== -1) {
        hashBase = hash.substring(0, queryStart);
        const queryString = hash.substring(queryStart + 1);
        const urlParams = new URLSearchParams(queryString);
        exerciseId = urlParams.get('exercise');
      }
      
      if (hashBase === 'manage' && exerciseId) {
        setActiveMenu('manage');
        setManagingExerciseId(exerciseId);
      } else if (hashBase === 'ics' && exerciseId) {
        setActiveMenu('ics');
        setManagingExerciseId(exerciseId);
      } else if (hashBase === 'builder') {
        setActiveMenu('builder');
        setManagingExerciseId(null);
      } else if (hashBase && ['dashboard', 'exercises', 'msel', 'hira', 'participants', 'resources'].includes(hashBase)) {
        setActiveMenu(hashBase);
        setManagingExerciseId(null);
      } else if (!hashBase) {
        setActiveMenu('dashboard');
        setManagingExerciseId(null);
      }
    };

    // Handle initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);
  // Load scribe templates when exercise changes
  useEffect(() => {
    if (managingExerciseId && activeMenu === 'manage') {
      loadScribeTemplates();
    }
  }, [managingExerciseId, activeMenu]);

  const loadScribeTemplates = async () => {
    if (!managingExerciseId) return;
    
    try {
      const response = await fetch(`${API}/scribe-templates/exercise/${managingExerciseId}`);
      if (response.ok) {
        const templates = await response.json();
        setScribeTemplates(templates);
        if (templates.length > 0) {
          setCurrentTemplate(templates[0]);
          setScribeFormData(templates[0]);
        }
      }
    } catch (error) {
      console.error('Error loading scribe templates:', error);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'exercises':
        return <ExerciseView />;
      case 'msel':
        return <MSELView />;
      case 'hira':
        return <HIRAView />;
      case 'participants':
        return <ParticipantsView />;
      case 'resources':
        return <ResourcesView />;
      case 'builder':
        return <ExerciseBuilder />;
      case 'manage':
        return <ExerciseManagementDashboard 
          exerciseId={managingExerciseId} 
          scribeTemplates={scribeTemplates}
          currentTemplate={currentTemplate}
          scribeFormData={scribeFormData}
          scribeFormLoading={scribeFormLoading}
          scribeTimeErrors={scribeTimeErrors}
          setCurrentTemplate={setCurrentTemplate}
          setScribeFormData={setScribeFormData}
          setScribeFormLoading={setScribeFormLoading}
          setScribeTimeErrors={setScribeTimeErrors}
          loadScribeTemplates={loadScribeTemplates}
        />;
      case 'ics':
        return <ICSDashboard currentExercise={currentExercise} />;
      default:
        return <Dashboard />;
    }
  };

  // Exercise management and ICS dashboard with navigation
  if (activeMenu === 'manage' || activeMenu === 'ics') {
    return (
      <div className={`min-h-screen ${theme.colors.primary} ${theme.colors.textPrimary}`}>
        <BrowserRouter>
          <div className="flex flex-col h-screen">
            <Navigation currentExercise={currentExercise} activeMenu={activeMenu} />
            <main className="flex-1 overflow-auto">
              {renderContent()}
            </main>
          </div>
        </BrowserRouter>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.primary} ${theme.colors.textPrimary}`}>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <Navigation currentExercise={currentExercise} activeMenu={activeMenu} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar onMenuSelect={setActiveMenu} activeMenu={activeMenu} />
            <main className="flex-1 overflow-auto">
              {renderContent()}
            </main>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;