import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Clock, Calendar } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  latitude: number;
  longitude: number;
  address: string;
  loading: boolean;
  error: string | null;
}

export const AttendanceMarker = () => {
  const { currentUser, markAttendance, getStudentAttendance } = useAttendance();
  const [location, setLocation] = useState<LocationState>({
    latitude: 0,
    longitude: 0,
    address: "",
    loading: false,
    error: null,
  });
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  // Check if already marked today
  const todayAttendance = getStudentAttendance(currentUser?.id || "");
  const today = new Date().toDateString();
  const alreadyMarked = todayAttendance.some(
    record => record.timestamp.toDateString() === today
  );

  const getCurrentLocation = async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by this browser"
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Simulate reverse geocoding (in real app, use Google Maps API)
          const address = `Campus Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          
          setLocation({
            latitude,
            longitude,
            address,
            loading: false,
            error: null,
          });
        } catch (error) {
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: "Failed to get address"
          }));
        }
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: "Failed to get location. Please enable location services."
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleMarkAttendance = async () => {
    if (!currentUser || !location.latitude) {
      toast({
        title: "Error",
        description: "Location not available",
        variant: "destructive",
      });
      return;
    }

    setIsMarking(true);

    try {
      await markAttendance({
        studentId: currentUser.id,
        studentName: currentUser.name || "",
        department: currentUser.department!,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
      });

      toast({
        title: "Attendance Marked!",
        description: "Your attendance has been recorded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setIsMarking(false);
    }
  };

  useEffect(() => {
    if (!alreadyMarked) {
      getCurrentLocation();
    }
  }, [alreadyMarked]);

  if (alreadyMarked) {
    const todayRecord = todayAttendance.find(record => 
      record.timestamp.toDateString() === today
    );

    return (
      <Card className="animate-fade-in border-success/20 bg-success/5">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-xl text-success">
            Attendance Already Marked
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayRecord && (
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Marked at {todayRecord.timestamp.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {todayRecord.location.address}
              </div>

              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Present Today
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">
          Mark Today's Attendance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-primary" />
            Location Status
          </div>
          
          {location.loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Getting your location...
            </div>
          )}
          
          {location.error && (
            <div className="space-y-2">
              <p className="text-sm text-destructive">{location.error}</p>
              <Button variant="outline" onClick={getCurrentLocation} size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
          
          {location.address && !location.loading && (
            <div className="space-y-2">
              <p className="text-sm text-success">📍 Location detected</p>
              <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                {location.address}
              </p>
            </div>
          )}
        </div>

        {/* Mark Attendance Button */}
        <Button
          onClick={handleMarkAttendance}
          disabled={isMarking || !location.latitude || location.loading}
          variant="attendance"
          size="xl"
          className="w-full"
        >
          {isMarking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Marking Attendance...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark Attendance
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Make sure you're at the correct location before marking attendance
        </p>
      </CardContent>
    </Card>
  );
};