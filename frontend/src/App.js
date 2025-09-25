import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import shadcn components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { ScrollArea } from './components/ui/scroll-area';
import { 
  CalendarDays, 
  Users, 
  AlertTriangle, 
  ClipboardList, 
  Plus, 
  Settings,
  Home,
  BookOpen,
  Target,
  Shield
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-black border-b border-orange-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-orange-500 text-2xl font-bold tracking-wider">
            EXRSIM
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/builder" 
              className="text-gray-300 hover:text-orange-500 transition-colors font-medium"
            >
              Exercise Builder
            </Link>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </nav>
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
const Dashboard = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${API}/exercises`);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      planned: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      active: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Exercise Dashboard</h1>
          <p className="text-gray-400">Manage your emergency training exercises</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-black font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          New Exercise
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : exercises.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-gray-800 border-gray-700 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Exercises Yet</h3>
                <p className="text-gray-500 text-center mb-4">
                  Create your first emergency training exercise to get started with EXRSIM.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-black font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Exercise
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          exercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors cursor-pointer"
              data-testid={`exercise-card-${exercise.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">{exercise.name}</CardTitle>
                    <Badge className={getStatusColor(exercise.status)}>
                      {exercise.status.charAt(0).toUpperCase() + exercise.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-400 mt-2">
                  {exercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Start: {formatDate(exercise.start_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>End: {formatDate(exercise.end_date)}</span>
                  </div>
                  {exercise.goals.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>{exercise.goals.length} Goal{exercise.goals.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Placeholder components for other views
const ExerciseView = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">Exercises</h1>
    <p className="text-gray-400">Exercise management interface coming soon...</p>
  </div>
);

const MSELView = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">MSEL</h1>
    <p className="text-gray-400">Master Sequence Event List interface coming soon...</p>
  </div>
);

const HIRAView = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">HIRA</h1>
    <p className="text-gray-400">Hazard Identification Risk Assessment interface coming soon...</p>
  </div>
);

const ParticipantsView = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">Participants</h1>
    <p className="text-gray-400">Participant management interface coming soon...</p>
  </div>
);

const ExerciseBuilder = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-orange-500 mb-4">Exercise Builder</h1>
    <p className="text-gray-400">Step-by-step exercise builder coming soon...</p>
  </div>
);

// Main App Component
function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

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
      case 'builder':
        return <ExerciseBuilder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <Navigation />
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