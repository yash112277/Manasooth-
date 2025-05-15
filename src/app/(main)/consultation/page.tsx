
"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Video, VideoOff, AlertTriangle, Phone, PhoneOff, UserCircle, CalendarDays, Clock, CheckCircle, Loader2, XCircle, Mic, MicOff, ScreenShare, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { bookConsultation, type BookConsultationInput, type BookConsultationOutput } from '@/ai/flows/book-consultation';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const availableTimeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM", 
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
];

export default function ConsultationPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(undefined);
  const [bookingStatus, setBookingStatus] = useState<BookConsultationOutput | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showVideoSection, setShowVideoSection] = useState(false);
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);


  const handleDateSelect = (date?: Date) => {
    if (isBookingSuccessful) return;
    setSelectedDate(date);
    setSelectedTimeSlot(undefined); 
    setBookingStatus(null); 
  };

  const handleTimeSlotSelect = (value: string) => {
    if (isBookingSuccessful) return;
    setSelectedTimeSlot(value);
  };

  const handleBookConsultation = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a date and time slot.",
      });
      return;
    }

    setIsBooking(true);
    setBookingStatus(null);

    const input: BookConsultationInput = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTimeSlot,
      userName: user?.displayName || user?.email || 'Anonymous User',
    };

    try {
      const result = await bookConsultation(input);
      setBookingStatus(result);
      if (result.success) {
        setIsBookingSuccessful(true);
        setShowVideoSection(true); 
        toast({
          title: "Booking Successful!",
          description: result.message,
          className: "bg-primary text-primary-foreground",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Booking Error:', error);
      const errorMsg = "An unexpected error occurred while booking. Please try again.";
      setBookingStatus({ success: false, message: errorMsg });
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: errorMsg,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleScheduleNewConsultation = () => {
    setIsBookingSuccessful(false);
    setShowVideoSection(false);
    setBookingStatus(null);
    setSelectedDate(undefined);
    setSelectedTimeSlot(undefined);
    // If call was active, end it
    if (isCallActive) {
      handleEndCall();
    }
  };


  const getCameraPermissionAndStart = async () => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        return true; // Permission granted
      } catch (error) {
        console.error('Error accessing camera/microphone:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Camera and microphone permissions are required. Please enable them in your browser settings.',
        });
        return false; // Permission denied
      }
    } else {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Your browser does not support the necessary features for video calls.',
      });
      return false; // Feature not supported
    }
  };

  const handleStartCall = async () => {
    let permissionGranted = hasCameraPermission;
    if (hasCameraPermission === null || !hasCameraPermission) {
       permissionGranted = await getCameraPermissionAndStart();
    }
    if (permissionGranted) { // Check the potentially updated permissionGranted
       setIsCallActive(true);
        toast({ title: "Call Started", description: "Connecting to a professional..." });
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    // Do not reset hasCameraPermission here, let it persist until user leaves page or explicitly revokes.
    toast({ title: "Call Ended", description: "You have disconnected." });
  };


  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Card className="shadow-2xl hover:shadow-primary/10 transition-shadow duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Book a Professional Consultation</CardTitle>
          <CardDescription className="text-md">
            {isBookingSuccessful ? "Your consultation is booked. Join the call below." : "Select a date and time that works for you."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {isBookingSuccessful && bookingStatus?.success ? (
            <Alert variant="default" className={cn("bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700")}>
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle className={cn("text-green-700 dark:text-green-300")}>Booking Confirmed!</AlertTitle>
              <AlertDescription className={cn("text-green-600 dark:text-green-400/90")}>
                {bookingStatus.message}
                {bookingStatus.bookingId && (<p className="mt-1 text-xs">Booking ID: {bookingStatus.bookingId}</p>)}
                 <p className="mt-2 font-semibold">Please scroll down to join your scheduled call section.</p>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center">
                <Label htmlFor="consultation-calendar" className="text-lg font-semibold mb-2 self-start flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Select Date
                </Label>
                <Calendar
                  id="consultation-calendar"
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border shadow-inner bg-muted/30 p-3 w-full"
                  fromDate={new Date()} 
                  disabled={(date) => date.getDay() === 0 || date.getDay() === 6 || isBooking || isBookingSuccessful}
                />
              </div>

              {selectedDate && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                   <Clock className="mr-2 h-5 w-5 text-primary" /> Available Slots for {format(selectedDate, 'PPP')}
                  </h3>
                  <RadioGroup
                    value={selectedTimeSlot}
                    onValueChange={handleTimeSlotSelect}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    aria-label="Select a time slot"
                  >
                    {availableTimeSlots.map((slot) => (
                      <Label
                        key={slot}
                        htmlFor={`slot-${slot}`}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all text-sm",
                          "hover:bg-accent hover:text-accent-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                          selectedTimeSlot === slot ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2" : "bg-card hover:shadow-md",
                          (isBooking || isBookingSuccessful) && "cursor-not-allowed opacity-50 hover:bg-card"
                        )}
                      >
                        <RadioGroupItem value={slot} id={`slot-${slot}`} className="sr-only" disabled={isBooking || isBookingSuccessful} />
                        {slot}
                      </Label>
                    ))}
                  </RadioGroup>
                   {availableTimeSlots.length === 0 && (
                      <p className="text-sm text-muted-foreground">No available slots for this date. Please select another date.</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {!isBookingSuccessful && bookingStatus && !bookingStatus.success && (
             <Alert variant="destructive">
              <XCircle className="h-5 w-5" />
              <AlertTitle>Booking Failed</AlertTitle>
              <AlertDescription>{bookingStatus.message}</AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 pt-6 border-t">
          {isBookingSuccessful ? (
            <Button size="lg" onClick={handleScheduleNewConsultation} className="w-full sm:w-auto hover:bg-secondary transition-colors py-3">
              Schedule New Consultation
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleBookConsultation}
              disabled={!selectedDate || !selectedTimeSlot || isBooking || isBookingSuccessful}
              className="w-full sm:w-auto hover:bg-primary/80 transition-colors py-3"
            >
              {isBooking && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isBooking ? "Booking..." : "Book Appointment"}
            </Button>
          )}
          {!user && !isBookingSuccessful && <p className="text-xs text-muted-foreground">Login to save your booking history (feature coming soon).</p>}
        </CardFooter>
      </Card>
      
      {(showVideoSection) && (
        <>
          <Separator className="my-8" />

          <Card className="shadow-2xl hover:shadow-primary/10 transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">Join Your Scheduled Call</CardTitle>
              <CardDescription className="text-md">
                Connect with the healthcare professional for your simulated video call.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* User Video Area */}
                <div className="border bg-muted rounded-lg aspect-video flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                  {!isCallActive && hasCameraPermission !== true && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 space-y-2 p-4">
                      <VideoOff className="h-16 w-16 text-muted-foreground" />
                      <p className="text-muted-foreground text-center">Your camera is off or permission is not granted.</p>
                    </div>
                  )}
                   {isCallActive && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 p-2 bg-black/30 rounded-lg backdrop-blur-sm">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" title="Mute/Unmute Mic (dummy)">
                            <MicOff className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" title="Stop/Start Video (dummy)">
                            <VideoOff className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" title="Share Screen (dummy)">
                            <ScreenShare className="h-5 w-5" />
                        </Button>
                         <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" title="Chat (dummy)">
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                    </div>
                    )}
                </div>

                {/* Professional Video Area */}
                <div className="border bg-muted rounded-lg aspect-video flex items-center justify-center shadow-inner" data-ai-hint="professional consultation">
                  {isCallActive ? (
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                       <Image src="https://picsum.photos/150/150" alt="Professional" width={150} height={150} className="rounded-full mb-2 shadow-md" data-ai-hint="professional doctor" />
                      <p className="font-semibold">Dr. Wellness (Simulated)</p>
                      <div className="flex items-center text-green-500">
                        <Loader2 className="h-4 w-4 animate-spin mr-1" /> Connecting...
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 p-4">
                      <UserCircle className="h-16 w-16" />
                      <p className="text-center">Professional&apos;s video will appear here once the call starts.</p>
                    </div>
                  )}
                </div>
              </div>

              {hasCameraPermission === false && !isCallActive && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Camera/Microphone Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera and microphone access in your browser settings to use this feature. 
                    If you&apos;ve denied permission, you might need to reset it for this site.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t">
              {!isCallActive ? (
                <Button size="lg" onClick={handleStartCall} className="w-full sm:w-auto hover:bg-primary/80 transition-colors shadow-md hover:shadow-lg">
                  <Phone className="mr-2 h-5 w-5" /> Start Call
                </Button>
              ) : (
                <Button size="lg" variant="destructive" onClick={handleEndCall} className="w-full sm:w-auto hover:bg-destructive/80 transition-colors shadow-md hover:shadow-lg">
                  <PhoneOff className="mr-2 h-5 w-5" /> End Call
                </Button>
              )}
            </CardFooter>
          </Card>
        </>
      )}

      <Card className="shadow-lg hover:shadow-primary/10 transition-shadow duration-300">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2">
          <p>1. Select an available date and time slot from the calendar above.</p>
          <p>2. Click &quot;Book Appointment&quot; to confirm your (simulated) booking.</p>
          <p>3. Once booked, the video call section will appear. Click &quot;Start Call&quot; to begin.</p>
          <p>4. Your browser will ask for permission to access your camera and microphone. Please allow it.</p>
          <p>5. Once connected, you will see the (simulated) professional and they will see you.</p>
          <p>6. Discuss your concerns. When finished, click &quot;End Call&quot;.</p>
          <p className="text-sm pt-2"><strong>Note:</strong> This is a demo feature. In a real application, this would connect you to a licensed healthcare professional and manage real availability.</p>
        </CardContent>
      </Card>
    </div>
  );
}
    

